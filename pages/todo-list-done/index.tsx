import Header from "../../components/header";
import styles from "./index.module.scss";
import { getTodoDone, GetTodoCategory } from "../../service";
import { useEffect, useState } from "react";
import { TodoItemType } from "../../components/todo/types";
import dayjs from "dayjs";
import { Pagination, Input, Button, Spin, Space, Radio } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { formatArrayToTimeMap, getWeek } from "../../components/todo/utils";
import { CalendarOutlined, ApartmentOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import TodoItemList from "../../components/todo/todo-item-list";
import DrawerWrapper from "../../components/drawer-wrapper";
import TodoFormDrawer from "../../components/todo/todo-form-drawer";

const { Search } = Input;

const TodoDone = () => {
    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});
    const [total, setTotal] = useState(0);

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const params = {
            keyword,
            pageNo,
            category: activeCategory === "所有" ? "" : activeCategory,
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
        getCategory();
    }, [pageNo]);

    const today = dayjs().format("YYYY-MM-DD");

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const getShowList = (list) => {
        return !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = async () => {
        const res: any = await GetTodoCategory();
        const resData = await res.json();
        setCategory(resData.data);
    };
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory]);

    return (
        <Spin spinning={loading}>
            <Header title="已完成 todo" />
            <main className={styles.done}>
                <h2 className={styles.h2}>
                    <span>已完成 todo ({total})</span>
                    <Space size={8}>
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
                                <TodoItemList
                                    list={getShowList(todoMap[time])}
                                    onRefresh={getData}
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
                <DrawerWrapper visible={showDrawer} onClose={() => setShowDrawer(false)} placement="bottom" height="40vh">
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
