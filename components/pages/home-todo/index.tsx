import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Spin, Tabs } from "antd";
import { useRouter } from "next/router";
import {
    getTodo,
    getTodoDone,
    getTodoFollowUp,
    getTodoTarget,
    TodoStatus,
    getTodoFootprint,
} from "../../../service";
import TodoDayListWrapper from "../../todo/todo-day-list-wrapper";
import TodoTreeList from "../../todo/todo-tree-list";
import dayjs from "dayjs";
import SearchHistory, { setHistoryWord } from "../../todo/todo-list-search/search-history";
import TodoListDone from "../../todo/todo-list-done";
import useSettings from "../../../hooks/useSettings";
import { CaretDownOutlined, CaretUpOutlined, FireFilled, FieldTimeOutlined } from "@ant-design/icons";
import TodayBeforeYears from "../../todo/today-before-years";
import TodoDayList from "../../todo/todo-day-list";
import type { TabsProps } from 'antd';
import useStorageState from "../../../hooks/useStorageState";
import { getExtraDayjs, getToday } from "../../todo/utils";
import TodoListHabit from "../../todo/todo-list-habit";
import TodoListBookmark from "../../todo/todo-list-bookmark";
import TodoIcon from "../../todo/todo-icon";
import { TodoItemType } from "../../todo/types";

interface IProps {
    refreshFlag: number;
}

const TitleWrapper: React.FC<any> = (props) => {
    const { title, list } = props;
    const [isCollapse, updateIsCollapse] = useStorageState(`isCollapse-${title}`);

    if (!list?.length) return null;

    return (
        <>
            <div className={styles.time} onClick={() => updateIsCollapse()}>
                <span>
                    {title} ({list?.length}) {!isCollapse ? <CaretDownOutlined /> : <CaretUpOutlined />}
                </span>
            </div>
            {!isCollapse && props.children}
        </>
    );
};

const HomeTodo: React.FC<IProps> = ({ refreshFlag }) => {
    const router = useRouter();

    const settings = useSettings();

    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [followUpList, setFollowUpList] = useState<TodoItemType[]>([]);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [footprintList, setFootprintList] = useState<TodoItemType[]>([]);
    const [importantList, setImportantList] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    // 获取当前 Todo
    const getTodoList = async () => {
        const res = await getTodo();
        if (res) {
            setTodoList(res?.data?.list?.filter((item) => item.isHabit !== "1"));
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
            todo: [getTodoList, getTodoFollowUpList],
            other: [getTodoTargetTodoList, getTodoImportantDoneList, getTodoFootprintList],
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
        setActiveKey('done');
        setIsShowHistory(false);
    };

    /** 是否展现搜索历史词 */
    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

    const getTodayList = () => {
        return isShowHistory
            ? []
            : todoList.concat(isFollowUp ? followUpList : []).filter((item) => !dayjs(item.time).isAfter(dayjs()));
    };

    const getOnlyTodayList = (list: TodoItemType[]) => {
        const d = settings?.todoShowBeforeToday?.days || 0;
        return list.filter(item => {
            if (item.time === getToday().format('YYYY-MM-DD')) {
                return true;
            }
            if (getExtraDayjs(item.time).isBefore(getExtraDayjs(dayjs())) && getExtraDayjs(item.time).isAfter(getExtraDayjs(dayjs()).subtract(d + 1, 'day'))) {
                return true;
            }
        });
    }

    const getAfterList = () => {
        return todoList.filter((item) => dayjs(item.time).isAfter(dayjs()));
    };

    const [isFollowUp, updateIsFollowUp] = useStorageState('isFollowUp');
    const [isOnlyToday, updateIsOnlyToday] = useStorageState('isOnlyToday');

    const tabs: TabsProps['items'] = [
        {
            key: 'todo', label: 'todo', children:
                <div className={styles.content}> 
                    <TodoDayListWrapper
                        list={isOnlyToday ? getOnlyTodayList(getTodayList()) : getTodayList()}
                        getData={getData}
                        title="todo"
                        timeStyle={{ fontSize: 17 }}
                        btn={
                            <>
                                <Button
                                    onClick={() => {
                                        message.info(!isOnlyToday ? settings?.todoShowBeforeToday?.text : '看所有 todo', 1);
                                        updateIsOnlyToday();
                                    }}
                                    type={isOnlyToday ? "primary" : "default"}
                                >
                                    <FieldTimeOutlined />
                                </Button>
                                <Button
                                    onClick={() => {
                                        message.info(!isFollowUp ? '看 follow up todo' : '不看 follow up todo', 1);
                                        updateIsFollowUp()
                                    }}
                                    type={isFollowUp ? "primary" : "default"}
                                >
                                    <FireFilled />
                                </Button>
                            </>
                        }
                    />
                    {!isShowHistory && (
                        <>
                            <TitleWrapper title={`之后待办`} list={getAfterList()}>
                                <TodoDayList getData={getData} list={getAfterList()} />
                            </TitleWrapper>
                        </>
                    )}
                </div>
        },
        {
            key: 'done', label: 'done', children: <div className={styles.content}>
                <TodoListDone refreshFlag={refreshFlag} keyword={keyword} setKeyword={setKeyword} />
            </div>
        },
        {
            key: 'habit', label: <><TodoIcon iconType="habit" style={{ marginRight: 3 }}/>habit</>, children:
                <div className={styles.content}>
                    <TodoListHabit refreshFlag={refreshFlag} />
                </div>
        },
        {
            key: 'mark', label: <><TodoIcon iconType="bookMark" style={{ marginRight: 3 }}/>mark</>, children:
                <div className={styles.content}>
                    <TodoListBookmark refreshFlag={refreshFlag} />
                </div>
        },
        {
            key: 'other', label: 'other', children: <div className={styles.content}>
                {/* target */}
                <TitleWrapper title={settings?.todoNameMap?.target} list={targetList}>
                    <TodoTreeList list={targetList} onRefresh={getData} />
                </TitleWrapper>
                <TitleWrapper title={`已完成的重要todo最近八条`} list={importantList}>
                    <TodoTreeList list={importantList} onRefresh={getData} />
                </TitleWrapper>
                {/* footprint */}
                <TitleWrapper
                    title={`${settings?.todoNameMap?.footprint}最近十条`}
                    list={footprintList}
                >
                    <TodoTreeList list={footprintList} onRefresh={getData} showTime={true} />
                </TitleWrapper>
            </div>
        },
        {
            key: 'before', label: 'before', children:
                <div className={styles.content}>
                    <TodayBeforeYears refreshFlag={refreshFlag} />
                </div>
        },
    ];

    return (
        <Spin spinning={loading}>
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
            {!isShowHistory && (
                <Tabs className={styles.todoHome} activeKey={activeKey} onChange={(val) => setActiveKey(val)} items={tabs} />
            )}
        </Spin>
    );
};

export default HomeTodo;
