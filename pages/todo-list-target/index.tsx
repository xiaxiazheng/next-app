import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoTarget } from "../../service";
import { Spin } from "antd";
import TodoAllList from "../../components/todo/todo-all-list";
import { TodoItemType } from "../../components/todo/types";
import useSettings from "../../hooks/useSettings";

interface IProps {
    refreshFlag: number;
}

const TodoListTarget: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoList, setTodoList] = useState<TodoItemType[]>();

    const settings = useSettings();

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
            <Header title={settings?.todoNameMap?.['target']} />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title={settings?.todoNameMap?.['target']} />
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
