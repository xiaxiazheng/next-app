import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { AddTodoItem, getTodoTarget } from "../../service";
import { Button, message, Space, Spin } from "antd";
import { TodoItemType } from "../../components/todo/types";
import { PlusOutlined, SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import TodoFormDrawer from "../../components/todo/todo-form-drawer";
import dayjs from "dayjs";
import DrawerWrapper from "../../components/common/drawer-wrapper";
import PunchTheClockCalendar from "./Calendar";
import { handleIsTodayPunchTheClock, handleTimeRange } from "../../components/todo/todo-form-punch-the-clock/utils";

dayjs.locale("zh-cn");

const TodoListPunchTheClock = () => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoTarget();
        if (res) {
            const list = res.data.list.filter((item: TodoItemType) => !!item.timeRange);
            setTodoList(list);
            if (active) {
                setActive(list.find((item) => item.todo_id === active.todo_id));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const handleAdd = () => {
        setShowAdd(true);
    };

    const [active, setActive] = useState<TodoItemType>();

    const punchTheClock = async (active: TodoItemType) => {
        const val = {
            category: active.category,
            color: active.color,
            description: active.description,
            name: `打卡：${active.name}`,
            isBookMark: "0",
            isNote: "0",
            isTarget: "0",
            doing: "0",
            other_id: active.todo_id,
            status: "1",
            time: dayjs().format("YYYY-MM-DD"),
        };
        await AddTodoItem(val);
        message.success("打卡成功");
        setActive(undefined);
        getData();
    };

    const renderDetail = (item: TodoItemType) => {
        const { startTime, endTime, range, target } = handleTimeRange(item.timeRange);
        return (
            <>
                <div>
                    打卡周期：{startTime} ~ {endTime}，共 {range} 天
                </div>
                <div>
                    达标天数：{target}，
                    {item.child_todo_list_length < target
                        ? `还差 ${target - item.child_todo_list_length} 天`
                        : `已达成目标`}
                </div>
                <div>已打卡天数：{item.child_todo_list_length}</div>
                <div>
                    今日：
                    {handleIsTodayPunchTheClock(item) ? "已打卡" : "未打卡"}
                </div>
            </>
        );
    };

    return (
        <Spin spinning={loading}>
            <Header title="打卡" />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span>打卡任务({todoList?.length || 0})</span>
                    <Space size={8}>
                        {/* 排序方式 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<CalendarOutlined />}
                            onClick={() => setIsSortTime((prev) => !prev)}
                            type={isSortTime ? "primary" : "default"}
                        />
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
                                {renderDetail(item)}
                            </div>
                        ))}
                </div>
                <TodoFormDrawer
                    todo_id={active?.todo_id}
                    open={showAdd}
                    onClose={() => {
                        setShowAdd(false);
                    }}
                    operatorType={active ? "edit" : "add"}
                    onSubmit={() => {
                        getData();
                        setShowAdd(false);
                    }}
                    isPunchTheClock={true}
                />
                <DrawerWrapper
                    title={active?.name}
                    footer={
                        <Space>
                            <Button
                                onClick={() => {
                                    setShowAdd(true);
                                }}
                            >
                                修改打卡计划
                            </Button>
                            {handleIsTodayPunchTheClock(active) ? (
                                <Button type="primary" style={{ background: "green" }}>
                                    今日已打卡
                                </Button>
                            ) : (
                                <Button type="primary" onClick={() => punchTheClock(active)}>
                                    现在打卡
                                </Button>
                            )}
                        </Space>
                    }
                    open={!!active}
                    onClose={() => setActive(undefined)}
                >
                    <PunchTheClockCalendar active={active} />
                    {active && renderDetail(active)}
                </DrawerWrapper>
            </main>
        </Spin>
    );
};

export default TodoListPunchTheClock;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
