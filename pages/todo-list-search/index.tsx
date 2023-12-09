import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { getTodoDone, getTodoCategory, TodoStatus } from "../../service";
import { useEffect, useReducer, useRef, useState } from "react";
import { TodoItemType } from "../../components/todo/types";
import dayjs from "dayjs";
import { Pagination, Input, Button, Spin, Space, Radio } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { formatArrayToTimeMap, getRangeFormToday, getShowList, getWeek } from "../../components/todo/utils";
import { CalendarOutlined, ApartmentOutlined, ClearOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import TodoItemList from "../../components/todo/todo-item-list";
import DrawerWrapper from "../../components/common/drawer-wrapper";
import { useRouter } from "next/router";
import { debounce } from "lodash";

const { Search } = Input;

interface IProps {
    refreshFlag: number;
}

const TodoDone: React.FC<IProps> = ({ refreshFlag }) => {
    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});
    const [total, setTotal] = useState(0);

    const keyword = useRef<string>("");
    const [, forceUpdate] = useReducer((prev) => {
        return prev + 1;
    }, 0);
    const [pageNo, setPageNo] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<string>("");

    const [todoType, setTodoType] = useState<"done" | "all">("done");

    const getData = debounce(async (key?: string) => {
        setLoading(true);
        const params: any = {
            keyword: key || keyword.current,
            pageNo,
            category: activeCategory === "所有" ? "" : activeCategory,
        };
        if (todoType === "done") {
            params["status"] = TodoStatus.done;
        }
        if (startTime !== "") {
            params["startTime"] = startTime;
            params["endTime"] = startTime;
        }
        const res = await getTodoDone(params);
        if (res) {
            setTotal(res.data.total);
            setTodoMap(formatArrayToTimeMap(res.data.list));
        }
        setLoading(false);
    }, 200);

    const router = useRouter();

    useEffect(() => {
        if (router?.query?.keyword) {
            keyword.current = router.query.keyword as string;
            setPastKeyword(router.query.keyword as string);
        }
    }, []);

    useEffect(() => {
        refreshFlag && getData();
        getCategory();
    }, [refreshFlag]);

    useEffect(() => {
        getData();
        getCategory();
    }, [pageNo]);

    const today = dayjs().format("YYYY-MM-DD");

    const [isSortTime, setIsSortTime] = useState<boolean>(false);

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = debounce(async () => {
        const res: any = await getTodoCategory();
        const resData = await res.json();
        setCategory(resData.data);
    }, 200);
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory, startTime, todoType]);

    // 传给子组件的 keyword
    const [pastKeyword, setPastKeyword] = useState<string>();

    return (
        <Spin spinning={loading}>
            <Header title="搜索结果" />
            <main className={styles.done}>
                <h2 className={styles.h2}>
                    <span>搜索结果 ({total})</span>
                    <Space size={8}>
                        {((pastKeyword && pastKeyword !== "") || startTime !== "") && (
                            <Button
                                style={{ width: 50 }}
                                icon={<ClearOutlined />}
                                onClick={() => {
                                    keyword.current = "";
                                    setPastKeyword("");
                                    forceUpdate();
                                    startTime === "" ? getData() : setStartTime("");
                                }}
                                type={"primary"}
                                danger
                            />
                        )}
                        {/* todo 状态 */}
                        <Button
                            onClick={() => setTodoType((prev) => (prev === "done" ? "all" : "done"))}
                            type={isSortTime ? "primary" : "default"}
                        >
                            {todoType}
                        </Button>
                        {/* 排序方式 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<CalendarOutlined />}
                            onClick={() => setIsSortTime((prev) => !prev)}
                            type={isSortTime ? "primary" : "default"}
                        />
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                    </Space>
                </h2>
                {/* 搜索框 */}
                <div>
                    <Search
                        className={styles.search}
                        placeholder="输入搜索"
                        value={keyword.current}
                        onChange={(e) => {
                            keyword.current = e.target.value;
                            forceUpdate();
                        }}
                        enterButton
                        allowClear
                        onSearch={() => {
                            pageNo === 1 ? getData() : setPageNo(1);
                            setPastKeyword(keyword.current);
                        }}
                    />
                </div>
                {startTime && (
                    <Space size={16} className={styles.timeControl}>
                        <Button
                            icon={<MinusOutlined />}
                            onClick={() => setStartTime(dayjs(startTime).subtract(1, "d").format("YYYY-MM-DD"))}
                        />
                        {startTime}
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => setStartTime(dayjs(startTime).add(1, "d").format("YYYY-MM-DD"))}
                        />
                    </Space>
                )}
                <div className={styles.list}>
                    {Object.keys(todoMap).map((time) => (
                        <div key={time}>
                            {/* 日期 */}
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? "" : styles.future
                                }`}
                                onClick={() => {
                                    const date = dayjs(time).format("YYYY-MM-DD");
                                    setStartTime(date);
                                    keyword.current = "";
                                }}
                            >
                                {time} ({getWeek(time)}，{getRangeFormToday(time)})&nbsp;
                                {todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
                            </div>
                            {/* 当日的 todo */}
                            <div className={styles.one_day}>
                                <TodoItemList
                                    list={getShowList(todoMap[time], { isSortTime })}
                                    onRefresh={getData}
                                    keyword={pastKeyword}
                                />
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
                <Button
                    className={styles.categoryBtn}
                    type="primary"
                    danger
                    shape="circle"
                    size="large"
                    icon={<ApartmentOutlined />}
                    onClick={() => setShowDrawer(true)}
                />
                {/* 分类弹窗 */}
                <DrawerWrapper open={showDrawer} onClose={() => setShowDrawer(false)} placement="bottom" height="40vh">
                    <div style={{ marginBottom: 10 }}>分类：</div>
                    <Radio.Group
                        className={styles.content}
                        value={activeCategory}
                        onChange={(e) => {
                            setActiveCategory(e.target.value);
                            setShowDrawer(false);
                        }}
                    >
                        <Radio.Button key="所有" value="所有" style={{ marginBottom: 10 }}>
                            所有
                        </Radio.Button>
                        {category?.map((item) => (
                            <Radio.Button key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                                {item.category}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </DrawerWrapper>
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
