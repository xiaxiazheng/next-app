import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import EditTodo from "../../components/todo/todo-form";
import { TodoStatus } from "../../service";
import styles from "./index.module.scss";

const AddTodo = () => {
    return (
        <main className={styles.add_todo}>
            <h2>新增 todo</h2>
            <EditTodo status={TodoStatus.todo} showFooter={true} />
        </main>
    );
};

export default AddTodo;
