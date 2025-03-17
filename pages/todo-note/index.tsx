import Header from "../../components/common/header";

const TodoNote = () => {
    return (
        <>
            <Header title="todo-note" />
            <main>
                <TodoNote />
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
