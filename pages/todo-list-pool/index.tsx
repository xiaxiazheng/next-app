import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodoPool } from "../../service";
import { Spin } from "antd";
import { TodoType } from "../../components/todo/types";
import TodoDayList from "../../components/todo/todo-day-list";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoPool();
        if (res) {
            setTodoList(res.data.filter((item) => item.color !== "-1" && item.color !== "-2"));
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
                <TodoDayList list={todoList} getData={getData} title={'待办池'} />
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
