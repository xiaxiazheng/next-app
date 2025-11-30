import { useState } from "react";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import TodoFormDrawer from "../todo-form-drawer";
import TodoDetailDrawer from "../todo-detail-drawer";
import { useRouter } from "next/router";

interface Props {
    operatorType?: 'add' | 'copy' | 'progress';
    /** 在 copy 和 progerss 时用的模板 todo 的 todo_id */
    todo_id?: string;
    renderChildren: (props: { onClick: Function }) => any;
    /** 在新增完之后，关闭 TodoDetailDrawer 时触发 */
    onClose?: Function;
}

function AddTodoHoc(props: Props) {
    const { operatorType = 'add', todo_id, renderChildren, onClose } = props;
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
    const [newTodo, setNewTodo] = useState<TodoItemType>();
    const [showDetail, setShowDetail] = useState<boolean>(false);

    return (
        <>
            {renderChildren({
                onClick: () => {
                    setShowAddTodo(true);
                }
            })}
            <TodoFormDrawer
                placement="bottom"
                todo_id={todo_id}
                operatorType={operatorType}
                open={showAddTodo}
                onClose={() => {
                    setShowAddTodo(false);
                    setShowDetail(true);
                }}
                onSubmit={(val) => {
                    setNewTodo(val);
                }}
            />
            {newTodo && (
                <TodoDetailDrawer
                    activeTodo={newTodo}
                    visible={showDetail}
                    keyword={""}
                    onRefresh={(item) => { setNewTodo(item) }}
                    onClose={() => {
                        setShowAddTodo(false);
                        setNewTodo(undefined);
                        onClose?.();
                        setShowDetail(false);
                    }}
                />
            )}
        </>
    );
}

export default AddTodoHoc;