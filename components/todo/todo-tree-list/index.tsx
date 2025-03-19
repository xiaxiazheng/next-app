import { useState } from "react";
import { TodoItemType } from "../types";
import TodoDetailDrawer from "../todo-detail-drawer";
import TodoTree from "./todo-tree";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
    showTime?: boolean;
    keyword?: string;
}

/** todo 列表渲染的统一入口 */
const TodoTreeList: React.FC<IProps> = (props) => {
    const { list, onRefresh, showTime = false, keyword } = props;

    const [activeId, setActiveId] = useState<string>('');

    return (
        <>
            {/* {list.map((item) => (
                <TodoItemTitle
                    key={item.todo_id}
                    item={item}
                    onClick={(item) => {
                        setActiveId(item.todo_id);
                    }}
                    keyword={keyword}
                    showTime={showTime}
                />
            ))} */}
            <TodoTree
                todoList={list}
                onClick={(item) => {
                    setActiveId(item.todo_id);
                }}
                keyword={keyword}
                getTodoItemProps={(item) => {
                    return {
                        showTime,
                    }
                }}
            />
            {/* 一个list，对应一个详情弹窗 */}
            {activeId !== '' && <TodoDetailDrawer
                visible={true}
                onClose={() => setActiveId("")}
                activeTodo={list.filter(item => item.todo_id === activeId)?.[0]}
                onRefresh={() => onRefresh()}
                keyword={keyword}
            />}
        </>
    );
};

export default TodoTreeList;
