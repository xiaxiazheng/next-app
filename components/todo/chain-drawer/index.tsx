import { Divider, DrawerProps, Spin } from "antd";
import { useEffect, useState } from "react";
import { getTodoChainById } from "../../../service";
import DrawerWrapper from "../../common/drawer-wrapper";
import TodoTreeList from "../todo-tree-list";
import { TodoItemType } from "../types";

interface IProps extends DrawerProps {
    todo_id?: string;
}

const ChainDrawer: React.FC<IProps> = (props) => {
    const { todo_id, open, ...rest } = props;

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
        if (todoId && open) {
            getTodoChain(todoId);
        }
    }, [todoId, open]);

    const handleRefresh = (id: string) => {
        if (id !== todoId) {
            getTodoChain(id);
        } else {
            setTodoId(id);
        }
    };

    return (
        <DrawerWrapper title={"todo chain"} open={open} {...rest}>
            <Spin spinning={loading}>
                {todoId && (
                    <TodoTreeList
                        list={todoChainList}
                        onRefresh={(item) => {
                            handleRefresh(item.todo_id);
                        }}
                        showTime={true}
                    />
                )}
            </Spin>
        </DrawerWrapper>
    );
};

export default ChainDrawer;
