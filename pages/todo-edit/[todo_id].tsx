import { useRouter } from "next/router";
import styles from "./index.module.scss";
import EditTodo from "../../components/todo/todo-form";
import { useEffect, useState } from "react";
import { GetTodoById, TodoStatus } from "../../service";
import { Spin } from "antd";

const EditTodoComp = () => {
    const router = useRouter();
    const { todo_id } = router.query;

    const [data, setData] = useState();
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoById(todo_id);
        setData(res.data);
        setLoading(false);
    };

    useEffect(() => {
        todo_id && getData();
    }, [todo_id]);

    return (
        <main className={styles.edit_todo}>
            <Spin spinning={loading}>
                <h2>编辑 todo</h2>
                <EditTodo status={TodoStatus.todo} todo={data} />
            </Spin>
        </main>
    );
};

export default EditTodoComp;
