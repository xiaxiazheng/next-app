import Header from "../../components/common/header";
import TodoNoteComp from "../../components/pages/todo-note-comp";

const TodoNote = () => {
    return (
        <>
            <Header title="todo-note" />
            <main>
                <TodoNoteComp />
            </main>
        </>
    );
};

export default TodoNote;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
