import { useEffect, useState } from "react";
import Header from "../../../components/common/header";
import styles from "./index.module.scss";
import { getTodoHabit, TodoStatus } from "../../../service";
import { Button, Space, Spin } from "antd";
import { TodoItemType } from "../../../components/todo/types";
import { PlusOutlined, SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import TodoFormDrawer from "../../../components/todo/todo-form-drawer";
import dayjs from "dayjs";
import { handleIsTodayPunchTheClock } from "../../../components/todo/todo-form-habit/utils";
import TodoHabitDrawer, { renderHabitDetail } from "../../../components/todo/todo-habit-drawer";
import useSettings from "../../../hooks/useSettings";

dayjs.locale("zh-cn");

interface IProps {
    refreshFlag: number;
}

const TodoListHabit: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);
    
    const settings = useSettings();

    const getData = async () => {
        setLoading(true);
        const params = {
            status: TodoStatus.todo,
        };
        const res = await getTodoHabit(params);
        if (res) {
            const list = res.data.list;
            setTodoList(list);
            if (active) {
                setActive(list.find((item) => item.todo_id === active.todo_id));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    const [showAdd, setShowAdd] = useState<boolean>(false);
    const handleAdd = () => {
        setShowAdd(true);
    };

    const [active, setActive] = useState<TodoItemType>();

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.["habit"]} />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span style={{ fontSize: 16 }}>
                        {settings?.todoNameMap?.["habit"]} ({todoList?.length || 0})
                    </span>
                    <Space size={8}>
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                        {/* 新建待办 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            onClick={() => handleAdd()}
                            type="primary"
                        />
                    </Space>
                </h2>
                {/* 待办 todo 列表 */}
                <div className={styles.list}>
                    {todoList &&
                        todoList.map((item) => (
                            <div
                                key={item.todo_id}
                                style={{ borderColor: handleIsTodayPunchTheClock(item) ? "green" : "#4096ff" }}
                                onClick={() => {
                                    setActive(item);
                                }}
                            >
                                <div className={styles.name}>{item.name}</div>
                                {renderHabitDetail(item)}
                            </div>
                        ))}
                </div>
                <TodoFormDrawer
                    todo_id={active?.todo_id}
                    open={showAdd}
                    onClose={() => {
                        setShowAdd(false);
                    }}
                    operatorType={"add"}
                    onSubmit={() => {
                        getData();
                        setShowAdd(false);
                    }}
                />
                <TodoHabitDrawer active={active} handleClose={() => setActive(undefined)} onRefresh={() => getData()} />
            </main>
        </Spin>
    );
};

export default TodoListHabit;

