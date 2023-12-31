import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoPool } from "../../service";
import { Spin } from "antd";
import { TodoItemType } from "../../components/todo/types";
import TodoAllList from "../../components/todo/todo-split-time-range-list";

interface IProps {
    refreshFlag: number;
    settings: any;
}

const TodoPool: React.FC<IProps> = ({ refreshFlag, settings }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoPool();
        if (res) {
            setTodoList(res.data.list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.["pool"]} />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title={settings?.todoNameMap?.["pool"]} />
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
