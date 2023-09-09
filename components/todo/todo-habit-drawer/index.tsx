import { useEffect, useState } from "react";
import { AddTodoItem } from "../../../service";
import { Button, message, Space } from "antd";
import { CreateTodoItemReq, TodoItemType } from "../types";
import TodoFormDrawer from "../todo-form-drawer";
import dayjs from "dayjs";
import DrawerWrapper from "../../common/drawer-wrapper";
import PunchTheClockCalendar from "./Calendar";
import { handleIsTodayPunchTheClock, handleTimeRange } from "../todo-form-habit/utils";

dayjs.locale("zh-cn");

export const renderHabitDetail = (item: TodoItemType) => {
    const { startTime, endTime, target } = handleTimeRange(item.timeRange);
    return (
        <>
            <div>
                打卡开始日期：{startTime}，已经进行 {dayjs(endTime).diff(dayjs(startTime), "d")} 天
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

interface IProps {
    active?: TodoItemType;
    handleClose: Function;
    onRefresh: Function;
}

const TodoHabitDrawer: React.FC<IProps> = (props) => {
    const { active, handleClose, onRefresh } = props;

    const punchTheClock = async (active: TodoItemType) => {
        const val: CreateTodoItemReq = {
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
            isWork: "0",
            time: dayjs().format("YYYY-MM-DD"),
        };
        await AddTodoItem(val);
        message.success("打卡成功");
        onRefresh?.();
        handleClose?.();
    };

    // const [showEdit, setShowEdit] = useState<boolean>(false);

    return (
        <>
            <DrawerWrapper
                title={active?.name}
                footer={
                    <Space style={{ paddingBottom: 20 }}>
                        {handleIsTodayPunchTheClock(active) ? (
                            <Button type="primary" style={{ background: "green" }}>
                                今日已打卡
                            </Button>
                        ) : (
                            <Button type="primary" onClick={() => punchTheClock(active)}>
                                现在打卡
                            </Button>
                        )}
                        {/* <Button
                            onClick={() => {
                                setShowEdit(true);
                            }}
                        >
                            编辑
                        </Button> */}
                    </Space>
                }
                open={!!active}
                onClose={() => handleClose?.()}
            >
                <PunchTheClockCalendar active={active} />
                {active && renderHabitDetail(active)}
            </DrawerWrapper>
            {/* <TodoFormDrawer
                todo_id={active?.todo_id}
                open={showEdit}
                onClose={() => {
                    setShowEdit(false);
                }}
                operatorType={"edit"}
                onSubmit={() => {
                    onRefresh?.();
                    setShowEdit(false);
                }}
                // isPunchTheClock={true}
            /> */}
        </>
    );
};

export default TodoHabitDrawer;
