import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetTodo, EditTodoItem, GetTodoById } from "../../service";
import { Button, message, Space, Spin } from "antd";
import {
    PlusOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    VerticalAlignTopOutlined,
    FileImageOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import MyModal from "../../components/my-modal";
import { formatArrayToTimeMap, getWeek } from "../../components/todo/utils";
import { TodoType } from "../../components/todo/types";
import Category from "../../components/todo/category";
import DescriptionModal from "../../components/todo/description-modal";

const Todo = () => {
    const [todoMap, setTodoMap] = useState({});
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const [loading, setLaoding] = useState<boolean>(false);

    const getData = async () => {
        setLaoding(true);
        const res = await GetTodo();
        if (res) {
            setTotal(res.data.length);
            setTodoMap(formatArrayToTimeMap(res.data));
        }
        setLaoding(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const today = dayjs().format("YYYY-MM-DD");

    const handleAdd = () => {
        router.push("/todo-add");
    };

    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
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
        <Spin spinning={loading}>
            <Header title="todo" />
            <main className={styles.todo}>
                <h2 className={styles.h2}>
                    <span>待办({total})</span>
                    <Space size={8}>
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                        {/* 新增待办 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            onClick={() => handleAdd()}
                            type="primary"
                        />
                    </Space>
                </h2>
                <div>
                    {Object.keys(todoMap).map((time) => (
                        <div key={time}>
                            {/* 日期 */}
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
                            {/* 当日 todo */}
                            <div className={styles.one_day}>
                                {todoMap[time].map((item: TodoType) => (
                                    <div key={item.todo_id}>
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
                {/* 详情弹窗 */}
                <DescriptionModal
                    isTodo={true}
                    visible={showDesc}
                    setVisible={setShowDesc}
                    activeTodo={activeTodo}
                    refresh={() => getTodoById(activeTodo.todo_id)}
                />
                {/* 批量调整过期 todo 日期的弹窗 */}
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
        </Spin>
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
