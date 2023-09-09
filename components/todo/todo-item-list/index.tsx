import { useEffect, useState } from "react";
import { getTodoById, TodoStatus } from "../../../service";
import { TodoItemType } from "../types";
import TodoDetailDrawer from "../todo-detail-drawer";
import TodoItemTitle from "./todo-item-title";
import TodoHabitDrawer from "../todo-habit-drawer";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
    showTime?: boolean;
    keyword?: string;
}

const TodoItemList: React.FC<IProps> = (props) => {
    const { list, onRefresh, showTime = false, keyword } = props;

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [showHabit, setShowHabit] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    return (
        <>
            {list.map((item) => (
                <TodoItemTitle
                    key={item.todo_id}
                    item={item}
                    onClick={(item) => {
                        setActiveTodo(item);
                        if (item && item.isHabit === '1') {
                            setShowHabit(true);
                        } else {
                            setShowDesc(true);
                        }
                    }}
                    keyword={keyword}
                    showTime={showTime}
                />
            ))}
            {/* 普通详情弹窗 */}
            <TodoDetailDrawer
                visible={showDesc}
                setVisible={setShowDesc}
                activeTodo={activeTodo}
                setActiveTodo={setActiveTodo}
                onRefresh={onRefresh}
                keyword={keyword}
            />
            {/* 打卡详情弹窗 */}
            <TodoHabitDrawer
                active={showHabit && activeTodo}
                handleClose={() => setActiveTodo(undefined)}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default TodoItemList;
