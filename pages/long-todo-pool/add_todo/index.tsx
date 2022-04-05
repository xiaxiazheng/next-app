import EditTodo from "../../../components/todo/edit-todo";
import { TodoStatus } from "../../../service";

const AddTodo = () => {

    return (
        <main>
            <h2>新增 todo</h2>
            <EditTodo status={TodoStatus.pool} />
        </main>
    );
};

export default AddTodo;
