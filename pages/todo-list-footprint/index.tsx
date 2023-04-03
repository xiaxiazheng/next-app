import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoFootprint, getTodoTarget } from "../../service";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoItemType } from "../../components/todo/types";

const TodoFootprint = () => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoFootprint();
        if (res) {
            const list = res.data.list;
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="足迹" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title="足迹" />
            </main>
        </Spin>
    );
};

export default TodoFootprint;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
