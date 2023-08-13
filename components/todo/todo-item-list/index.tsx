import { useEffect, useState } from "react";
import { getTodoById, TodoStatus } from "../../../service";
import { TodoItemType } from "../types";
import TodoDetailDrawer from "../todo-detail-drawer";
import TodoItemTitle from "./todo-item-title";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
    showTime?: boolean;
    keyword?: string;
}

const TodoItemList: React.FC<IProps> = (props) => {
    const { list, onRefresh, showTime = false, keyword } = props;

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    return (
        <>
            {list.map((item) => (
                <TodoItemTitle
                    key={item.todo_id}
                    item={item}
                    onClick={(item) => {
                        setActiveTodo(item);
                        setShowDesc(true);
                    }}
                    keyword={keyword}
                    showTime={showTime}
                />
            ))}
            {/* 详情弹窗 */}
            <TodoDetailDrawer
                visible={showDesc}
                setVisible={setShowDesc}
                activeTodo={activeTodo}
                setActiveTodo={setActiveTodo}
                onRefresh={onRefresh}
                keyword={keyword}
            />
        </>
    );
};

export default TodoItemList;
