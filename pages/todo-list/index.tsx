import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodo } from "../../service";
import { Spin } from "antd";
import TodoDayList from "../../components/todo/todo-day-list";

const Todo = () => {
    const [todoList, setTodoList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodo();
        if (res) {
            setTodoList(res.data.list.filter((item) => item.isTarget !== "1"));
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
                <TodoDayList list={todoList} getData={getData} title="todo" isReverse={true} />
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
