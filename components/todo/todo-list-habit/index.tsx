import { useEffect, useState } from "react";
import Header from "../../../components/common/header";
import styles from "./index.module.scss";
import { getTodoHabit, TodoStatus } from "../../../service";
import { Button, Space, Spin } from "antd";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useSettings from "../../../hooks/useSettings";
import TodoTreeList from "../todo-tree-list";

dayjs.locale("zh-cn");

interface IProps {
    refreshFlag: number;
}

const TodoListHabit: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);

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
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

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
                    </Space>
                </h2>
                {/* 待办 todo 列表 */}
                <TodoTreeList
                    list={todoList}
                    onRefresh={getData}
                />
            </main>
        </Spin>
    );
};

export default TodoListHabit;

