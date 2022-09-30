import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodoPool } from "../../service";
import { Spin } from "antd";
import { TodoType } from "../../components/todo/types";
import TodoAllList from "../../components/todo/todo-all-list";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoPool();
        if (res) {
            setTodoList(res.data.filter((item) => item.color !== "-1"));
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="待办池" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title={'待办池'} />
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
