'use client';
import Header from "../../components/common/header";
import TodoNoteComp from "../../components/pages/todo-note-comp";

export default function TodoNote() {
    return (
        <>
            <Header title="todo-note" />
            <main>
                <TodoNoteComp />
            </main>
        </>
    );
}
