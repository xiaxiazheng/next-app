import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { TodoItemType } from "../../../components/todo/types";
import { CalendarOutlined } from "@ant-design/icons";
import TodoItemList from "../todo-item-list";
import { getShowList } from "../utils";

const { Search } = Input;

interface IProps {
    list: TodoItemType[];
    getData: Function;
    title: string;
}

const TodoAllList = (props: IProps) => {
    const { list, getData, title } = props;

    useEffect(() => {
        if (list) {
            setTodoList(list);
            setTotal(list.length);
        }
    }, [list]);

    const [todoList, setTodoList] = useState<TodoItemType[]>();
    const [total, setTotal] = useState(0);
    const [isSortTime, setIsSortTime] = useState<boolean>(false);

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
                </Space>
            </h2>
            {/* 待办 todo 列表 */}
            <div className={styles.list}>
                {todoList && <TodoItemList list={getShowList(todoList, { isSortTime })} onRefresh={getData} />}
            </div>
        </>
    );
};

export default TodoAllList;
