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

    useEffect(() => {
        if (todoId && visible) {
            getTodoChain(todoId);
        }
    }, [todoId, visible]);

    const handleRefresh = (id: string) => {
        if (id !== todoId) {
            getTodoChain(id);
        } else {
            setTodoId(id);
        }
    };

    return (
        <DrawerWrapper title={"todo chain"} open={visible} {...rest}>
            <Spin spinning={loading}>
                {todoId && (
                    <>
                        {todoChainList.filter((item) => item.todo_id !== todoId)?.length !== 0 && (
                            <>
                                <h4>前置：</h4>
                                <TodoItemList
                                    list={todoChainList.filter((item) => item.todo_id !== todoId) || []}
                                    onRefresh={(item) => {
                                        handleRefresh(item.todo_id);
                                    }}
                                    showTime={true}
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
                            onRefresh={(item) => {
                                handleRefresh(item.todo_id);
                            }}
                            showTime={true}
                        />
                        {todoChainList.find((item) => item.todo_id === todoId)?.child_todo_list_length !== 0 && (
                            <>
                                <Divider style={{ margin: "12px 0" }} />
                                <h4>后续：</h4>
                                <TodoItemList
                                    list={todoChainList.find((item) => item.todo_id === todoId)?.child_todo_list || []}
                                    onRefresh={(item) => {
                                        handleRefresh(item.todo_id);
                                    }}
                                    showTime={true}
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
