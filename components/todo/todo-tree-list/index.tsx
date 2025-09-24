import { useState } from "react";
import { TodoItemType, TodoTree } from "@xiaxiazheng/blog-libs";
import TodoDetailDrawer from "../todo-detail-drawer";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
    showTime?: boolean;
    keyword?: string;
    dataMode?: 'flat' | 'tree';
}

/** todo 列表渲染的统一入口 */
const TodoTreeList: React.FC<IProps> = (props) => {
    const { list, onRefresh, showTime = false, keyword, dataMode = 'flat' } = props;

    const [activeId, setActiveId] = useState<string>('');

    return (
        <>
            <TodoTree
                dataMode={dataMode}
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
