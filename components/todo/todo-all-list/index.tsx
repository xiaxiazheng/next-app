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
    const [keyword, setKeyword] = useState<string>();

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
                {todoList && <TodoItemList list={getShowList(todoList, { isSortTime, keyword })} onRefresh={getData} />}
            </div>
        </>
    );
};

export default TodoAllList;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
