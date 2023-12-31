import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, message, Spin } from "antd";
import { useRouter } from "next/router";
import { getTodo, getTodoDone, getTodoFollowUp, getTodoHabit, getTodoPool, TodoStatus } from "../service";
import TodoDayList from "../components/todo/todo-day-list";
import TodoItemList from "../components/todo/todo-item-list";
import dayjs from "dayjs";
import SearchHistory, { setHistoryWord } from "./todo-list-search/search-history";
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
    const [poolList, setPoolList] = useState([]);
    const [followUpList, setFollowUpList] = useState([]);
    const [habitList, setHabitList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    // 获取当前 Todo
    const getTodoList = async () => {
        const res = await getTodo();
        if (res) {
            setTodoList(res.data.list.filter((item) => item.isHabit !== "1"));
        }
    };

    // 获取今日已完成 Todo
    const getTodayDoneTodoList = async () => {
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
    };

    // 获取打卡情况
    const getTodoHabitTodoList = async () => {
        const res = await getTodoHabit({
            status: TodoStatus.todo,
        });
        if (res) {
            setHabitList(res.data.list);
        }
    };

    // 获取待办池
    const getTodoPoolList = async () => {
        const res = await getTodoPool({
            sortBy: [['time', 'DESC']]
        });
        if (res) {
            setPoolList(res.data.list.slice(0, 5));
        }
    };
    
    // 获取待办池
    const getTodoFollowUpList = async () => {
        const res = await getTodoFollowUp();
        if (res) {
            setFollowUpList(res.data.list);
        }
    };


    const getData = () => {
        setLoading(true);
        Promise.all([getTodoList(), getTodayDoneTodoList(), getTodoHabitTodoList(), getTodoPoolList(), getTodoFollowUpList()]).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    const [keyword, setKeyword] = useState<string>("");
    const search = () => {
        setHistoryWord(keyword);
        router.push(`/todo-list-search?keyword=${keyword}`);
    };

    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.todo}>
                <Spin spinning={loading}>
                    <TodoDayList
                        list={isShowHistory ? [] : todoList}
                        getData={getData}
                        title="todo"
                        isReverse={true}
                        search={
                            <>
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
                                    onFocus={() => setIsShowHistory(true)}
                                    onBlur={() => {
                                        // 这个 blur，要等别处的 click 触发后才执行
                                        setTimeout(() => setIsShowHistory(false), 100);
                                    }}
                                />
                                {isShowHistory && (
                                    <SearchHistory
                                        onSearch={(key) => {
                                            setKeyword(key);
                                            search();
                                        }}
                                    />
                                )}
                            </>
                        }
                    />
                    {!isShowHistory && (
                        <>
                            <div className={styles.time}>今日已完成 ({doneList?.length})</div>
                            <TodoItemList list={doneList} onRefresh={getTodoDone} />
                            {!!habitList.length && (
                                <>
                                    <div className={styles.time}>想养成的习惯 ({habitList?.length})</div>
                                    <TodoItemList list={habitList} onRefresh={getTodoHabitTodoList} />
                                </>
                            )}
                            {!!followUpList.length && (
                                <>
                                    <div className={styles.time}>需要跟进or待消化 ({followUpList?.length})</div>
                                    <TodoItemList list={followUpList} onRefresh={getTodoFollowUpList} />
                                </>
                            )}
                            {!!poolList.length && (
                                <>
                                    <div className={styles.time}>待办池最近五条 ({poolList?.length})</div>
                                    <TodoItemList list={poolList} onRefresh={getTodoPoolList} />
                                </>
                            )}
                        </>
                    )}
                </Spin>
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
