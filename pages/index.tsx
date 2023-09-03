import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, message, Spin } from "antd";
import { useRouter } from "next/router";
import { getTodo, getTodoDone, getTodoTarget, TodoStatus } from "../service";
import TodoDayList from "../components/todo/todo-day-list";
import TodoItemList from "../components/todo/todo-item-list";
import dayjs from "dayjs";
// import HomeTips from "../components/common/home-tips";

interface IProps {
    refreshFlag: number;
}

const Home: React.FC<IProps> = ({ refreshFlag }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, []);

    const [todoList, setTodoList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [targetList, setTargetList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    // 获取当前 Todo
    const getTodoList = async () => {
        setLoading(true);
        const res = await getTodo();
        if (res) {
            setTodoList(res.data.list);
        }
        setLoading(false);
    };

    // 获取今日已完成 Todo
    const getTodayDoneTodoList = async () => {
        setLoading(true);
        const params: any = {
            keyword: "",
            pageNo: 1,
            status: TodoStatus.done,
            startTime: dayjs().format("YYYY-MM-DD"),
        };
        const res = await getTodoDone(params);
        if (res) {
            setDoneList(res.data.list);
        }
        setLoading(false);
    };

    // 获取打卡情况
    const getTodoHabitTodoList = async () => {
        setLoading(true);
        const res = await getTodoTarget({
            status: TodoStatus.todo
        });
        if (res) {
            setTargetList(res.data.list);
        }
        setLoading(false);
    };

    const getData = () => {
        setLoading(true);
        Promise.all([getTodoList(), getTodayDoneTodoList(), getTodoHabitTodoList()]).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    const [keyword, setKeyword] = useState<string>("");
    const search = () => {
        router.push(`/todo-list-search?keyword=${keyword}`);
    };

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.todo}>
                <Spin spinning={loading}>
                    <TodoDayList
                        list={todoList}
                        getData={getData}
                        title="todo"
                        isReverse={true}
                        search={
                            <Input.Search
                                className={styles.search}
                                placeholder="输入搜索已完成 todo"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                enterButton
                                allowClear
                                onSearch={() => {
                                    search();
                                }}
                            />
                        }
                    />
                    <div className={styles.time}>今日已完成 ({doneList?.length})</div>
                    <TodoItemList list={doneList} onRefresh={getTodoDone} />
                    <div className={styles.time}>想养成的习惯 ({targetList?.length})</div>
                    <TodoItemList list={targetList} onRefresh={getTodoHabitTodoList} />
                </Spin>
                <div
                    className={styles.beforeToday}
                    onClick={() => {
                        router.push("/today-before-years");
                    }}
                >
                    看看往年今天?
                </div>
                {/* <HomeTips /> */}
            </main>
        </div>
    );
};

export default Home;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
