import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { AddTodoItem, getTodoTarget } from "../../service";
import { Button, Space, Spin, Calendar, DatePicker, TimePicker } from "antd";
import { TodoItemType } from "../../components/todo/types";
import { PlusOutlined, SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import TodoFormDrawer from "../../components/todo/todo-form-drawer";
import moment from "moment";
import DrawerWrapper from "../../components/drawer-wrapper";

// 计算时间相关
const handleTimeRange = (timeRange: string) => {
    const [startTime, range] = JSON.parse(timeRange);
    return {
        startTime,
        endTime: moment(startTime)
            .add(Number(range - 1), "d")
            .format("YYYY-MM-DD"),
        range,
    };
};

// 判断今天是否已打卡
const handleIsTodayPunchTheClock = (item: TodoItemType): boolean => {
    return item?.child_todo_list.map((item) => item.time).includes(moment().format("YYYY-MM-DD")) || false;
};

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoTarget();
        if (res) {
            const list = res.data.list.filter((item: TodoItemType) => item.timeRange);
            setTodoList(list);
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
            other_id: active.todo_id,
            status: "1",
            time: moment().format("YYYY-MM-DD"),
        };
        const res = await AddTodoItem(val);
        setActive(undefined);
        getData();
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
                                onClick={() => {
                                    setActive(item);
                                }}
                            >
                                <div>{item.name}</div>
                                <div>
                                    打卡周期：{handleTimeRange(item.timeRange).startTime} ~{" "}
                                    {handleTimeRange(item.timeRange).endTime}
                                </div>
                                <div>计划天数：{handleTimeRange(item.timeRange).range}</div>
                                <div>已打卡天数：{item.child_todo_list_length}</div>
                                <div>
                                    今日：
                                    {handleIsTodayPunchTheClock(item) ? "已打卡" : "未打卡"}
                                </div>
                            </div>
                        ))}
                </div>
                <TodoFormDrawer
                    todo_id={active?.todo_id}
                    open={showAdd}
                    onClose={() => setShowAdd(false)}
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
                                <Button type="primary">今日已打卡</Button>
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
                    <div className={styles.calendarWrapper}>
                        <Calendar fullscreen={false} onPanelChange={() => {}} />
                    </div>
                </DrawerWrapper>
            </main>
        </Spin>
    );
};

export default TodoPool;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
