import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodo } from "../../service";
import { Spin } from "antd";
import TodoDayList from "../../components/todo/todo-day-list";

const Todo = () => {
    const [todoList, setTodoList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodo();
        if (res) {
            setTodoList(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="todo" />
            <main className={styles.todo}>
                <TodoDayList list={todoList} getData={getData} title="todo" />
            </main>
        </Spin>
    );
};

export default Todo;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
