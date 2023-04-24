import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoTarget } from "../../service";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoItemType } from "../../components/todo/types";

interface IProps {
    refreshFlag: number;
}

const TodoListTarget: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoTarget();
        if (res) {
            const list = res.data.list;
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    return (
        <Spin spinning={loading}>
            <Header title="目标" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title="目标" />
            </main>
        </Spin>
    );
};

export default TodoListTarget;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
