import { useRouter } from "next/router";
import styles from './index.module.scss';
import EditTodo from "../../../components/todo/edit-todo";
import { useEffect, useState } from "react";
import { GetTodoById, TodoStatus } from "../../../service";

const EditTodoComp = () => {
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
            <h2>编辑 todo</h2>
            <EditTodo status={TodoStatus.todo} todo={data} />
        </main>
    )
}

export default EditTodoComp;