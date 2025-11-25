import { useState } from "react";
import { HomeTodoDirectoryChildList, TodoItemType, TodoTree } from "@xiaxiazheng/blog-libs";
import TodoDetailDrawer from "../../todo-detail-drawer";

interface IProps {
    categoryTodo: TodoItemType | undefined;
    refreshFlag: number;
}

/** category 的 child List 列表 */
const TodoListDirectoryChild: React.FC<IProps> = (props) => {
    const { categoryTodo, refreshFlag } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();
    const [flag, setFlag] = useState<number>(0);

    if (!categoryTodo) {
        return null;
    }

    return (
        <>
            <HomeTodoDirectoryChildList
                type="all"
                flag={refreshFlag + flag}
                categroy_todo_id={categoryTodo?.todo_id}
                onClick={item => {
                    setActiveTodo(item);
                    setVisible(true);
                }}
            />
            {/* 一个list，对应一个详情弹窗 */}
            <TodoDetailDrawer
                key={activeTodo?.todo_id}
                visible={visible}
                onClose={() => {
                    console.log('onClose');
                    setActiveTodo(undefined);
                    setVisible(false);
                }}
                activeTodo={activeTodo}
                onRefresh={() => {
                    setFlag(prev => prev + 1);
                }}
            />
        </>
    );
};

export default TodoListDirectoryChild;
