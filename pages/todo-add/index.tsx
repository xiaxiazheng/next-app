import { useState, useEffect } from "react";
import EditTodo from "../../components/todo/edit-todo";
import { TodoStatus } from "../../service";
import styles from "./index.module.scss";

const AddTodo = () => {
    return (
        <main className={styles.add_todo}>
            <h2>新增 todo</h2>
            <EditTodo status={TodoStatus.todo} />
        </main>
    );
};

export default AddTodo;
