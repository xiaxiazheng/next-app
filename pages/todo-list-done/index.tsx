import Header from "../../components/header";
import styles from "./index.module.scss";
import { getTodoDone, GetTodoById } from "../../service";
import { useEffect, useState } from "react";
import { TodoType } from "../../components/todo/types";
import dayjs from "dayjs";
import { Pagination, Input, Button, Spin } from "antd";
import { QuestionCircleOutlined, SettingOutlined, FileImageOutlined, SyncOutlined } from "@ant-design/icons";
import { formatArrayToTimeMap, getWeek } from "../../components/todo/utils";
import MyModal from "../../components/my-modal";
import Category from "../../components/todo/category";
import { useRouter } from "next/router";
import DescriptionModal from "../../components/todo/description-modal";

const { Search } = Input;

const TodoDone = () => {
    const router = useRouter();

    const [todoMap, setTodoMap] = useState({});
    const [total, setTotal] = useState(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const params = {
            keyword,
            pageNo,
        };
        const res = await getTodoDone(params);
        if (res) {
            setTotal(res.data.total);
            setTodoMap(formatArrayToTimeMap(res.data.list));
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [pageNo]);

    const today = dayjs().format("YYYY-MM-DD");
    const [activeTodo, setActiveTodo] = useState<TodoType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);

    return (
        <Spin spinning={loading}>
            <Header title="已完成 todo" />
            <main className={styles.done}>
                <h2 className={styles.h2}>
                    <span>已完成 todo ({total})</span>
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                </h2>
                {/* 搜索框 */}
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
                <div className={styles.list}>
                    {Object.keys(todoMap).map((time) => (
                        <div key={time}>
                            {/* 日期 */}
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? "" : styles.future
                                }`}
                            >
                                {time} ({getWeek(time)}){todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
                            </div>
                            {/* 当日的 todo */}
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
                <Pagination
                    className={styles.pagination}
                    pageSize={15}
                    current={pageNo}
                    total={total}
                    size="small"
                    onChange={(val) => setPageNo(val)}
                />
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

export default TodoDone;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
