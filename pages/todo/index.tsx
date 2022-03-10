import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodo, DoneTodoItem, EditTodoItem, GetTodoById } from "../../service";
import { Button, message } from "antd";
import {
    PlusOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    VerticalAlignTopOutlined,
    FileImageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import MyModal from "../../components/my-modal";
import { handleDesc, formatArrayToTimeMap, getWeek } from "../../components/todo/utils";
import { TodoType } from "../../components/todo/types";
import Category from "../../components/todo/category";
import PreviewImages from "../../components/preview-images";
import UploadImage from "../../components/upload-image";

const Todo = () => {
    const [todoMap, setTodoMap] = useState({});
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const getData = async () => {
        const res = await GetTodo();
        if (res) {
            setTotal(res.data.length);
            setTodoMap(formatArrayToTimeMap(res.data));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const today = dayjs().format("YYYY-MM-DD");

    const handleAdd = () => {
        router.push("/todo/add_todo");
    };

    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const handleDone = async () => {
        const params = {
            todo_id: activeTodo.todo_id,
        };

        const res = await DoneTodoItem(params);
        if (res) {
            message.success(res.message);
            setShowModal(false);
            getData();
        }
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);

    // 把过期任务的日期调整成今天
    const [showChangeExpire, setShowChangeExpire] = useState<boolean>(false);
    const [changeExpireList, setChangeExpireList] = useState<TodoType[]>();
    const handleChangeExpire = (todoList: TodoType[]) => {
        setChangeExpireList(todoList);
        setShowChangeExpire(true);
    };
    const changeExpireToToday = async () => {
        const promiseList = changeExpireList.map((item) => {
            return EditTodoItem({
                ...item,
                time: dayjs().format("YYYY-MM-DD"),
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 日期调整成功`);
            getData();
            setShowChangeExpire(false);
        }
    };

    return (
        <>
            <Header title="todo" />
            <main className={styles.todo}>
                <h2 className={styles.h2}>
                    <span>待办({total})</span>
                    <Button style={{ width: 50 }} icon={<PlusOutlined />} onClick={() => handleAdd()} type="primary" />
                </h2>
                <div>
                    {Object.keys(todoMap).map((time) => (
                        <div key={time}>
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? styles.previously : styles.future
                                }`}
                            >
                                <span>
                                    {time} ({getWeek(time)})
                                </span>
                                {time < today && (
                                    <Button
                                        size="small"
                                        title="调整日期"
                                        icon={<VerticalAlignTopOutlined />}
                                        onClick={() => handleChangeExpire(todoMap[time])}
                                        type="primary"
                                    />
                                )}
                            </div>
                            <div className={styles.one_day}>
                                {todoMap[time].map((item: TodoType) => (
                                    <div key={item.todo_id}>
                                        <Button
                                            size="small"
                                            type="primary"
                                            icon={<SettingOutlined />}
                                            style={{ marginRight: 5, verticalAlign: "middle" }}
                                            onClick={() => {
                                                setShowModal(true);
                                                setActiveTodo(item);
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
                        </div>
                    ))}
                </div>
                <MyModal
                    title={"请选择操作"}
                    visible={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={() => (
                        <>
                            <Button onClick={() => router.push(`/todo/copy_todo/${activeTodo?.todo_id}`)} danger>
                                复制
                            </Button>
                            <Button onClick={() => router.push(`/todo/edit_todo/${activeTodo?.todo_id}`)} danger>
                                编辑
                            </Button>
                            <Button onClick={() => handleDone()} danger>
                                完成
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
                <MyModal
                    title={<span className={styles.modalName}>{activeTodo?.name}</span>}
                    visible={showDesc}
                    onCancel={() => setShowDesc(false)}
                    cancelText="知道了"
                >
                    {activeTodo?.description && handleDesc(activeTodo.description)}
                    {activeTodo?.imgList && (
                        <div>
                            <UploadImage
                                type="todo"
                                otherId={activeTodo.todo_id}
                                refreshImgList={() => getTodoById(activeTodo.todo_id)}
                            />
                            <PreviewImages imagesList={activeTodo.imgList} />
                        </div>
                    )}
                </MyModal>
                <MyModal
                    visible={showChangeExpire}
                    title={"调整日期"}
                    onOk={() => changeExpireToToday()}
                    onCancel={() => {
                        setShowChangeExpire(false);
                    }}
                >
                    是否将 {changeExpireList?.[0].time} 的 Todo 日期调整成今天
                </MyModal>
            </main>
        </>
    );
};

export default Todo;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
