import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { getTodoTarget } from "../../service";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoItemType } from "../../components/todo/types";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoTarget();
        if (res) {
            const list = res.data;
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="目标" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title="目标" />
            </main>
        </Spin>
    );
};

export default TodoPool;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
