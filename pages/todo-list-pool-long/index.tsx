import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodoPool } from "../../service";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoType } from "../../components/todo/types";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoPool();
        if (res) {
            const list = res.data.filter((item) => item.color === "-1");
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="长期方向" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title="长期方向" />
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
