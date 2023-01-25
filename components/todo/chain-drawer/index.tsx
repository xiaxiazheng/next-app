import { Divider, DrawerProps, Spin } from "antd";
import { useEffect, useState } from "react";
import { getTodoChainById } from "../../../service";
import DrawerWrapper from "../../drawer-wrapper";
import TodoItemList from "../todo-item-list";
import { TodoItemType } from "../types";

interface IProps extends DrawerProps {
    todo_id?: string;
}

const ChainDrawer: React.FC<IProps> = (props) => {
    const { todo_id, visible, ...rest } = props;

    const [todoId, setTodoId] = useState<string>();
    useEffect(() => {
        setTodoId(todo_id);
    }, [todo_id]);

    const [loading, setLoading] = useState<boolean>(false);
    const getTodoChain = async (todo_id: string) => {
        setLoading(true);
        const res = await getTodoChainById(todo_id);
        setTodoChainList(res.data.reverse());
        setLoading(false);
    };

    const [todoChainList, setTodoChainList] = useState<TodoItemType[]>([]);
    console.log('todoChainList', todoChainList);
    console.log('todoId', todoId);
    

    useEffect(() => {
        if (todoId && visible) {
            getTodoChain(todoId);
        }
    }, [todoId, visible]);

    return (
        <DrawerWrapper title={"todo chain"} visible={visible} {...rest}>
            <Spin spinning={loading}>
                {todoId && (
                    <>
                        {todoChainList.filter((item) => item.todo_id !== todoId)?.length !== 0 && (
                            <>
                                <h4>前置：</h4>
                                <TodoItemList
                                    list={todoChainList.filter((item) => item.todo_id !== todoId) || []}
                                    onRefresh={(item) => setTodoId(item.todo_id)}
                                />
                                <Divider style={{ margin: "12px 0" }} />
                            </>
                        )}
                        <h4>
                            <span
                                style={{
                                    color: "#40a9ff",
                                }}
                            >
                                当前：
                            </span>
                        </h4>
                        <TodoItemList
                            list={todoChainList.filter((item) => item.todo_id === todoId) || []}
                            onRefresh={(item) => setTodoId(item.todo_id)}
                        />
                        {todoChainList.find((item) => item.todo_id === todoId)?.child_todo_list_length !== 0 && (
                            <>
                                <Divider style={{ margin: "12px 0" }} />
                                <h4>后续：</h4>
                                <TodoItemList
                                    list={todoChainList.find((item) => item.todo_id === todoId)?.child_todo_list || []}
                                    onRefresh={(item) => setTodoId(item.todo_id)}
                                />
                            </>
                        )}
                    </>
                )}
            </Spin>
        </DrawerWrapper>
    );
};

export default ChainDrawer;
