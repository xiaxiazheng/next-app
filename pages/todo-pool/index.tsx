import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodoPool, GetTodoById } from "../../service";
import { Button, Space, Spin } from "antd";
import {
    PlusOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    FileImageOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Category from "../../components/todo/category";
import MyModal from "../../components/my-modal";
import { TodoType } from "../../components/todo/types";
import DescriptionModal from "../../components/todo/description-modal";

const TodoPool = () => {
    const [todoList, setTodoList] = useState<TodoType[]>();
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoPool();
        if (res) {
            setTotal(res.data.length);
            setTodoList(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleAdd = () => {
        router.push("/todo-pool/add_todo");
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <Spin spinning={loading}>
            <Header title="待办池 todo" />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span>待办池({total})</span>
                    <Space size={8}>
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                        {/* 新建待办 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            onClick={() => handleAdd()}
                            type="primary"
                        />
                    </Space>
                </h2>
                {/* 待办 todo 列表 */}
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
                            <span
                                onClick={() => {
                                    setActiveTodo(item);
                                    setShowDesc(true);
                                }}
                            >
                                <span>{item.name}</span>
                                {item.description && <QuestionCircleOutlined className={styles.icon} />}
                                {item.imgList.length !== 0 && <FileImageOutlined className={styles.icon} />}
                            </span>
                        </div>
                    ))}
                </div>
                {/* 操作弹窗 */}
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
                {/* 详情弹窗 */}
                <DescriptionModal
                    visible={showDesc}
                    setVisible={setShowDesc}
                    activeTodo={activeTodo}
                    refresh={() => getTodoById(activeTodo.todo_id)}
                />
            </main>
        </Spin>
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
