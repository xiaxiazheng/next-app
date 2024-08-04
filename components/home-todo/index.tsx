import Header from "../common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Spin, Tabs } from "antd";
import { useRouter } from "next/router";
import {
    getTodo,
    getTodoDone,
    getTodoFollowUp,
    getTodoTarget,
    getTodoPool,
    TodoStatus,
    getTodoFootprint,
} from "../../service";
import TodoDayListWrapper from "../todo/todo-day-list-wrapper";
import TodoItemList from "../todo/todo-item-list";
import dayjs from "dayjs";
import SearchHistory, { setHistoryWord } from "../../pages/todo-list-search/search-history";
import useSettings from "../../hooks/useSettings";
import { CaretDownOutlined, CaretUpOutlined, FireFilled } from "@ant-design/icons";
import TodayBeforeYears from "../todo/today-before-years";
import TodoDayList from "../todo/todo-day-list";

const TabPane = Tabs.TabPane;

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

const HomeTodo: React.FC<IProps> = ({ refreshFlag }) => {
    const router = useRouter();

    const settings = useSettings();

    const [todoList, setTodoList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const [yesterdayList, setYesterdayList] = useState([]);
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

    // 获取昨天已完成 Todo
    const getYesterdayDoneTodoList = async () => {
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
        const params: any = {
            keyword: "",
            pageNo: 1,
            pageSize: 30,
            status: TodoStatus.done,
            startTime: yesterday,
            endTime: yesterday,
        };
        const res = await getTodoDone(params);
        if (res) {
            setYesterdayList(res.data.list);
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
            pageSize: 10,
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
            pageSize: 10,
        });
        if (res) {
            setFootprintList(res.data.list);
        }
    };

    // 获取已完成的重要 todo
    const getTodoImportantDoneList = async () => {
        const params: any = {
            keyword: "",
            status: TodoStatus.done,
            color: ["0", "1", "2"],
            pageSize: 8,
        };
        const res = await getTodoDone(params);
        if (res) {
            setImportantList(res.data.list.filter((item) => Number(item.color) < 3));
        }
    };

    const [activeKey, setActiveKey] = useState<string>("todo");

    const getData = () => {
        const map = {
            todo: [getTodoList, getTodayDoneTodoList, getTodoFollowUpList],
            done: [getTodayDoneTodoList, getYesterdayDoneTodoList, getTodoImportantDoneList],
            footprint: [getTodoFootprintList],
            other: [getTodoTargetTodoList, getTodoPoolList],
        };
        if (map?.[activeKey]) {
            setLoading(true);
            Promise.all(map[activeKey].map((item) => item())).finally(() => {
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        getData();
    }, [refreshFlag, activeKey]);

    const [keyword, setKeyword] = useState<string>("");
    const search = () => {
        setHistoryWord(keyword);
        router.push(`/todo-list-search?keyword=${keyword}`);
    };

    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
    const [isFollowUp, setIsFollowUp] = useState<boolean>(true);

    const getTodayList = () => {
        return isShowHistory ? [] : todoList.concat(isFollowUp ? followUpList : []).filter(item => !dayjs(item.time).isAfter(dayjs()));
    };

    const getAfterList = () => {
        return todoList.filter(item => dayjs(item.time).isAfter(dayjs()));
    };

    return (
        <Spin spinning={loading}>
            <Tabs className={styles.todoHome} activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
                <TabPane tab="todo" key="todo" className={styles.content}>
                    <TodoDayListWrapper
                        list={getTodayList()}
                        getData={getData}
                        title="todo"
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
                        btn={
                            <Button
                                onClick={() => setIsFollowUp(!isFollowUp)}
                                type={isFollowUp ? "primary" : "default"}
                            >
                                <FireFilled />
                            </Button>
                        }
                    />
                    {!isShowHistory && (
                        <>
                            <TitleWrapper title={`之后待办`} list={getAfterList()}>
                                <TodoDayList getData={getData} list={getAfterList()} />
                            </TitleWrapper>
                            <TitleWrapper title={`今日已完成`} list={doneList}>
                                <TodoItemList list={doneList} onRefresh={getData} />
                            </TitleWrapper>
                        </>
                    )}
                </TabPane>
                {!isShowHistory && (
                    <>
                        <TabPane tab="done" key="done" className={styles.content}>
                            <TitleWrapper title={`今日已完成`} list={doneList}>
                                <TodoItemList list={doneList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`昨日已完成`} list={yesterdayList}>
                                <TodoItemList list={yesterdayList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`已完成的重要todo最近八条`} list={importantList}>
                                <TodoItemList list={importantList} onRefresh={getData} />
                            </TitleWrapper>
                        </TabPane>
                        <TabPane tab="footprint" key="footprint" className={styles.content}>
                            <TitleWrapper title={`${settings?.todoNameMap?.footprint}最近十条`} list={footprintList}>
                                <TodoItemList list={footprintList} onRefresh={getData} />
                            </TitleWrapper>
                        </TabPane>
                        <TabPane tab="other" key="other" className={styles.content}>
                            <TitleWrapper title={settings?.todoNameMap?.target} list={targetList}>
                                <TodoItemList list={targetList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={settings?.todoNameMap?.followUp} list={followUpList}>
                                <TodoItemList list={followUpList} onRefresh={getData} />
                            </TitleWrapper>
                            <TitleWrapper title={`待办池最近十条`} list={poolList}>
                                <TodoItemList list={poolList} onRefresh={getData} />
                            </TitleWrapper>
                        </TabPane>
                        <TabPane tab="history" key="history" className={styles.content}>
                            <TodayBeforeYears refreshFlag={refreshFlag} />
                        </TabPane>
                    </>
                )}
            </Tabs>
        </Spin>
    );
};

export default HomeTodo;
