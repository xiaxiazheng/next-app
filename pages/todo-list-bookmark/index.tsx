import { useEffect, useState } from "react";
import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoBookMark } from "../../service";
import { Spin } from "antd";
import { TodoItemType } from "../../components/todo/types";
import TodoAllList from "../../components/todo/todo-all-list";
import useSettings from "../../hooks/useSettings";

interface IProps {
    refreshFlag: number;
}

const TodoListBookmark: React.FC<IProps> = ({ refreshFlag }) => {
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
    }, [refreshFlag]);
    
    const settings = useSettings();

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.["bookMark"]} />
            <main className={styles.pool}>
                <TodoAllList list={todoList} getData={getData} title={settings?.todoNameMap?.["bookMark"]} />
            </main>
        </Spin>
    );
};

export default TodoListBookmark;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
