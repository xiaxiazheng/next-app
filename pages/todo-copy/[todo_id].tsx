import { useRouter } from "next/router";
import styles from './index.module.scss';
import EditTodo from "../../components/todo/todo-form";
import { useEffect, useState } from "react";
import { GetTodoById, TodoStatus } from "../../service";

const CopyTodo = () => {
    const router = useRouter();
    const { todo_id } = router.query;

    const [data, setData] = useState();

    const getData = async () => {
        const res = await GetTodoById(todo_id);
        setData(res.data);
    };

    useEffect(() => {
        todo_id && getData();
    }, [todo_id]);

    return (
        <main className={styles.edit_todo}>
            <h2>复制 todo</h2>
            <EditTodo status={TodoStatus.todo} todo={data} isCopy={true} />
        </main>
    )
}

export default CopyTodo;