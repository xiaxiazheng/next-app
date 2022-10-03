import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { GetTodoById } from "../../../service";
import { Button, Space } from "antd";
import { PlusOutlined, QuestionCircleOutlined, FileImageOutlined, SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Category from "../../../components/todo/category";
import { TodoType } from "../../../components/todo/types";
import DescriptionModal from "../../../components/todo/description-modal";
import { CalendarOutlined } from "@ant-design/icons";

interface IProps {
    list: any[];
    getData: Function;
    title: string;
}

const TodoPool = (props: IProps) => {
    const { list, getData, title } = props;

    useEffect(() => {
        if (list) {
            setTodoList(list);
            setTotal(list.length);
        }
    }, [list]);

    const [todoList, setTodoList] = useState<TodoType[]>();
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const handleAdd = () => {
        router.push("/todo-add");
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const getShowList = (list: TodoType[]) => {
        return !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );
    };

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title}({total})
                </span>
                <Space size={8}>
                    {/* 排序方式 */}
                    <Button
                        style={{ width: 50 }}
                        icon={<CalendarOutlined />}
                        onClick={() => setIsSortTime((prev) => !prev)}
                        type={isSortTime ? "primary" : "default"}
                    />
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                    {/* 新建待办 */}
                    <Button style={{ width: 50 }} icon={<PlusOutlined />} onClick={() => handleAdd()} type="primary" />
                </Space>
            </h2>
            {/* 待办 todo 列表 */}
            <div className={styles.list}>
                {todoList &&
                    getShowList(todoList).map((item) => (
                        <div key={item.todo_id} style={{ marginBottom: 8 }}>
                            <Category color={item.color} category={item.category} style={{ verticalAlign: "-1px" }} />
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
            {/* 详情弹窗 */}
            <DescriptionModal
                visible={showDesc}
                setVisible={setShowDesc}
                activeTodo={activeTodo}
                refresh={() => getTodoById(activeTodo.todo_id)}
            />
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
