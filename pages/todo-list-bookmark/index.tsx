import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { getTodoBookMark } from "../../service";
import { Spin } from "antd";
import { TodoItemType } from "../../components/todo/types";
import TodoAllList from "../../components/todo/todo-all-list";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoBookMark();
        if (res) {
            setTodoList(res.data.list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Spin spinning={loading}>
            <Header title="书签" />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title={"书签"} />
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
