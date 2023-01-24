import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { GetTodoById, TodoStatus } from "../../../service";
import { Button, Input, Space } from "antd";
import {
    PlusOutlined,
    QuestionCircleOutlined,
    FileImageOutlined,
    SyncOutlined,
    AimOutlined,
    BookOutlined,
    StarFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Category from "../../../components/todo/category";
import { TodoItemType } from "../../../components/todo/types";
import DescriptionModal from "../../../components/todo/description-modal";
import { CalendarOutlined } from "@ant-design/icons";
import TodoItem from "../todo-item";

const { Search } = Input;

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

    const [todoList, setTodoList] = useState<TodoItemType[]>();
    const [total, setTotal] = useState(0);

    const router = useRouter();

    const handleAdd = () => {
        router.push("/todo-add");
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>();
    const getShowList = (list: TodoItemType[]) => {
        const l = !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );

        return !keyword
            ? l
            : l.filter((item) => item.name.indexOf(keyword) !== -1 || item.description.indexOf(keyword) !== -1);
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
            <div>
                <Search
                    className={styles.search}
                    placeholder="输入搜索"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    enterButton
                    allowClear
                    onSearch={() => {
                        getData();
                    }}
                />
            </div>
            {/* 待办 todo 列表 */}
            <div className={styles.list}>
                {todoList && (
                    <TodoItem
                        list={getShowList(todoList)}
                        handleClick={(item) => {
                            setActiveTodo(item);
                            setShowDesc(true);
                        }}
                    />
                )}
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
