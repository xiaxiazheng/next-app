import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodoPool } from "../../service";
import { Button } from "antd";
import { PlusOutlined, QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Category from "../../components/todo/category";
import MyModal from "../../components/my-modal";
import { handleDesc } from "../../components/todo/utils";

const obj = {
    category: "公司",
    color: "1",
    description: "",
    name: "文档填写",
    status: "0",
    time: "2021-09-13",
    todo_id: "92f77eff-69fd-4dc6-9fdd-6e6c6b097bdc",
    username: "zyb",
};
type TodoType = typeof obj;

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoType[]>();
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const getData = async () => {
        const res = await GetTodoPool();
        if (res) {
            setTotal(res.data.length);
            setTodoList(res.data);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleAdd = () => {
        router.push("/todo-pool/add_todo");
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <Header title="Todo" />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span>待办池({total})</span>
                    <Button style={{ width: 50 }} icon={<PlusOutlined />} onClick={() => handleAdd()} type="primary" />
                </h2>
                <div className={styles.list}>
                    {todoList?.map((item) => (
                        <div key={item.todo_id}>
                            <Button
                                size="small"
                                type="primary"
                                icon={<SettingOutlined />}
                                style={{ marginRight: 5, verticalAlign: "middle" }}
                                onClick={() => {
                                    setActiveTodo(item);
                                    setShowModal(true);
                                }}
                            />
                            <Category color={item.color} category={item.category} />
                            {item.description && (
                                <span
                                    onClick={() => {
                                        setActiveTodo(item);
                                        setShowDesc(true);
                                    }}
                                >
                                    <span>{item.name}</span>
                                    <QuestionCircleOutlined className={styles.desc} />
                                </span>
                            )}
                            {!item.description && <span>{item.name}</span>}
                        </div>
                    ))}
                </div>
                <MyModal
                    title={"请选择操作"}
                    visible={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={() => (
                        <>
                            <Button onClick={() => router.push(`/todo-pool/copy_todo/${activeTodo?.todo_id}`)} danger>
                                复制
                            </Button>
                            <Button onClick={() => router.push(`/todo-pool/edit_todo/${activeTodo?.todo_id}`)} danger>
                                编辑
                            </Button>
                            <Button onClick={() => setShowModal(false)} type="primary">
                                取消
                            </Button>
                        </>
                    )}
                >
                    <Category color={activeTodo?.color} category={activeTodo?.category} />
                    <span>{activeTodo?.name}</span>
                </MyModal>
                <MyModal title={"详情："} visible={showDesc} onCancel={() => setShowDesc(false)} cancelText="知道了">
                    {activeTodo?.description && handleDesc(activeTodo.description)}
                </MyModal>
            </main>
        </>
    );
};

export default TodoPool;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
