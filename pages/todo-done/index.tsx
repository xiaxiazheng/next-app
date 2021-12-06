import Header from "../../components/header";
import styles from "./index.module.scss";
import { getTodoDone } from "../../service";
import { useEffect, useState } from "react";
import { TodoType } from "../../components/todo/types";
import dayjs from "dayjs";
import { Pagination, Input, Button } from "antd";
import { QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { handleDesc, formatArrayToTimeMap, getWeek } from "../../components/todo/utils";
import MyModal from "../../components/my-modal";
import Category from "../../components/todo/category";
import { useRouter } from "next/router";

const { Search } = Input;

const TodoDone = () => {
    const router = useRouter();

    const [todoMap, setTodoMap] = useState({});
    const [total, setTotal] = useState(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);

    const getData = async () => {
        const params = {
            keyword,
            pageNo,
        };
        const res = await getTodoDone(params);
        if (res) {
            setTotal(res.data.total);
            setTodoMap(formatArrayToTimeMap(res.data.list));
        }
    };

    useEffect(() => {
        getData();
    }, [pageNo]);

    const today = dayjs().format("YYYY-MM-DD");
    const [activeTodo, setActiveTodo] = useState<TodoType>();
    const [showDesc, setShowDesc] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <Header title="已完成 todo" />
            <main className={styles.done}>
                <h2 className={styles.h2}>
                    <span>已完成 todo ({total})</span>
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
                <div className={styles.list}>
                    {Object.keys(todoMap).map((time) => (
                        <div key={time}>
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? "" : styles.future
                                }`}
                            >
                                {time} ({getWeek(time)})
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
                    title={"详细描述："}
                    visible={showDesc}
                    onCancel={() => setShowDesc(false)}
                    cancelText="知道了"
                >
                    {activeTodo?.description && handleDesc(activeTodo.description)}
                </MyModal>
            </main>
        </>
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
