import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Spin } from "antd";
import { useRouter } from "next/router";
import {
    getTodo,
    getTodoDone,
    getTodoFollowUp,
    getTodoTarget,
    getTodoPool,
    TodoStatus,
    getTodoFootprint,
} from "../service";
import TodoDayList from "../components/todo/todo-day-list";
import TodoItemList from "../components/todo/todo-item-list";
import dayjs from "dayjs";
import SearchHistory, { setHistoryWord } from "./todo-list-search/search-history";
import useSettings from "../hooks/useSettings";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
// import HomeTips from "../components/common/home-tips";

interface IProps {
    refreshFlag: number;
}

const TitleWrapper: React.FC<any> = (props) => {
    const [isCollapse, setIsCollapse] = useState<boolean>(false);
    const { title, list } = props;

    if (!list?.length) return null;

    return (
        <>
            <div className={styles.time} onClick={() => setIsCollapse(!isCollapse)}>
                <span>
                    {title} ({list?.length}) {isCollapse ? <CaretDownOutlined /> : <CaretUpOutlined />}
                </span>
            </div>
            {!isCollapse && props.children}
        </>
    );
};

const Home: React.FC<IProps> = ({ refreshFlag }) => {
    const router = useRouter();

    const settings = useSettings();

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
    const [targetList, setTargetList] = useState([]);
    const [footprintList, setFootprintList] = useState([]);
    const [importantList, setImportantList] = useState([]);

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

    // 获取 targetList
    const getTodoTargetTodoList = async () => {
        const res = await getTodoTarget({
            status: TodoStatus.todo,
        });
        if (res) {
            setTargetList(res.data.list);
        }
    };

    // 获取待办池
    const getTodoPoolList = async () => {
        const res = await getTodoPool({
            sortBy: [["time", "DESC"]],
            pageSize: 5,
        });
        if (res) {
            setPoolList(res.data.list);
        }
    };

    // 获取完成但没结束
    const getTodoFollowUpList = async () => {
        const res = await getTodoFollowUp();
        if (res) {
            setFollowUpList(res.data.list);
        }
    };

    // 获取足迹
    const getTodoFootprintList = async () => {
        const res = await getTodoFootprint({
            pageSize: 5,
        });
        if (res) {
            setFootprintList(res.data.list);
        }
    };

    // 获取已完成的重要 todo
    const getTodoImportantList = async () => {
        const params: any = {
            keyword: "",
            status: TodoStatus.done,
            color: ["0", "1", "2"],
            pageSize: 5,
        };
        const res = await getTodoDone(params);
        if (res) {
            setImportantList(res.data.list.filter((item) => Number(item.color) < 3));
        }
    };

    const getData = () => {
        setLoading(true);
        Promise.all([
            getTodoList(),
            getTodayDoneTodoList(),
            getTodoTargetTodoList(),
            getTodoPoolList(),
            getTodoFollowUpList(),
            getTodoFootprintList(),
            getTodoImportantList(),
        ]).finally(() => {
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
                        timeStyle={{ fontSize: 17 }}
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
                            <TitleWrapper title={`今日已完成`} list={doneList}>
                                <TodoItemList list={doneList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={settings?.todoNameMap?.target} list={targetList}>
                                <TodoItemList list={targetList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={settings?.todoNameMap?.followUp} list={followUpList}>
                                <TodoItemList list={followUpList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`${settings?.todoNameMap?.footprint}最近五条`} list={footprintList}>
                                <TodoItemList list={footprintList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`已完成的重要todo最近五条`} list={importantList}>
                                <TodoItemList list={importantList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`待办池最近五条`} list={poolList}>
                                <TodoItemList list={poolList} onRefresh={getData} />
                            </TitleWrapper>
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
