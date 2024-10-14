import Header from "../../components/common/header";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { getTodoList, getTodoCategory } from "../../service";
import { useEffect, useRef, useState } from "react";
import { Input, Button, Pagination, Radio, Space, message, Drawer, Spin } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";
import Category from "../../components/todo/category";
import PreviewImages from "../../components/common/preview-images";
import UploadImageFile from "../../components/common/upload-image-file";
import PreviewFiles from "../../components/common/preview-files";
import { OperatorType, TodoItemType } from "../../components/todo/types";
import { getTodoTimeDetail, renderDescription } from "../../components/todo/utils";
import DrawerWrapper from "../../components/common/drawer-wrapper";
import TodoFormDrawer from "../../components/todo/todo-form-drawer";
import Loading from "../loading";
import TodoItemTitle from "../todo/todo-item-list/todo-item-title";

const { Search } = Input;

const title = "todo note";

const Item = (props: {
    item: TodoItemType;
    isActive: boolean;
    showTitle?: boolean;
    getData: Function;
    maxImgCount?: number;
    descriptionClassName?: string;
}) => {
    const { item, isActive, showTitle = true, getData, maxImgCount = -1, descriptionClassName } = props;
    return (
        <>
            <div className={`${styles.note_cont} ${isActive ? styles.active : ""}`}>
                {showTitle && <TodoItemTitle item={item} showTime={false} keyword="" />}
                {item.description !== "" && <div className={descriptionClassName}>{renderDescription(item.description)}</div>}
            </div>
            <div className={styles.imgFileList}>
                <PreviewImages
                    imagesList={maxImgCount !== -1 ? item.imgList.slice(0, maxImgCount) : item.imgList}
                    style={{ margin: 0 }}
                />
                <PreviewFiles filesList={item.fileList} style={{ margin: 0 }} />
                {isActive && (
                    <UploadImageFile
                        type="todo"
                        otherId={item.todo_id}
                        refreshImgList={() => getData()}
                        style={{ margin: 0 }}
                    />
                )}
                {maxImgCount !== -1 && item.imgList.length > maxImgCount && (
                    <div style={{ opacity: 0.7 }}>还有 {item.imgList.length - maxImgCount} 张图</div>
                )}
            </div>
        </>
    );
};

const TodoNote = () => {
    useEffect(() => {
        getCategory();
    }, []);

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<TodoItemType[]>([]);
    const [sortBy, setSortBy] = useState<"mTime" | "time">("time");

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const params = {
            pageNo,
            pageSize,
            keyword: keyword || "",
            isNote: "1",
            sortBy:
                sortBy === "time"
                    ? [
                          ["time", "DESC"],
                          ["cTime", "DESC"],
                      ]
                    : [["mTime", "DESC"]],
        };
        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }
        const res = await getTodoList(params);
        if (res) {
            const data = res.data;
            setList(data.list);
            setTotal(data.total);
            handleScrollToTop();
        }
        setLoading(false);
    };

    const handleClick = (item: TodoItemType) => {
        active?.todo_id === item.todo_id ? setActive(undefined) : setActive(item);
    };

    useEffect(() => {
        getData();
    }, [pageNo, sortBy]);

    const [active, setActive] = useState<TodoItemType>();

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = async () => {
        const res: any = await getTodoCategory({ isNote: "1" });
        const resData = await res.json();
        setCategory(resData.data);
    };
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory]);

    // 复制内容
    const copyContent = (content: string) => {
        const input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = content;
        input.select();
        document.execCommand("copy");
        message.success("已复制到粘贴板");
        document.body.removeChild(input);
    };

    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [operatorType, setOperatorType] = useState<OperatorType>("add-note");

    const ref = useRef<any>(null);
    const handleScrollToTop = () => {
        ref?.current?.scroll({
            left: 0,
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title} ({total})
                </span>
                <Space size={5}>
                    <Button type="primary" onClick={() => setSortBy((prev) => (prev === "time" ? "mTime" : "time"))}>
                        {sortBy === "mTime" ? "按修改倒序" : "按 time 倒序"}
                    </Button>
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
            <div className={styles.content} ref={ref}>
                <div className={styles.list}>
                    {list.map((item) => {
                        return (
                            <div key={item.todo_id} onClick={() => handleClick(item)}>
                                <div className={styles.item_time}>{getTodoTimeDetail(item.time)}</div>
                                <div className={styles.list_item}>
                                    <Item item={item} isActive={false} getData={getData} maxImgCount={2} descriptionClassName={styles.renderDescription} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {loading && <Loading />}
            </div>
            <Pagination
                className={styles.pagination}
                pageSize={pageSize}
                current={pageNo}
                total={total}
                size="small"
                onChange={(val) => setPageNo(val)}
            />
            <Button
                className={styles.category}
                type="primary"
                danger
                shape="circle"
                size="large"
                icon={<ApartmentOutlined />}
                onClick={() => setShowDrawer(true)}
            />
            {/* 类别抽屉 */}
            <DrawerWrapper open={showDrawer} height="50vh" onClose={() => setShowDrawer(false)} placement="bottom">
                <div style={{ marginBottom: 10 }}>分类：</div>
                <Radio.Group
                    className={styles.content}
                    value={activeCategory}
                    onChange={(e) => {
                        setActiveCategory(e.target.value);
                        setShowDrawer(false);
                    }}
                >
                    <Radio key="所有" value="所有" style={{ marginBottom: 10 }}>
                        所有 ({category?.reduce((prev: number, cur: any) => prev + Number(cur.count), 0)})
                    </Radio>
                    {category?.map((item) => (
                        <Radio key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                            {item.category} ({item.count})
                        </Radio>
                    ))}
                </Radio.Group>
            </DrawerWrapper>
            {/* 详情抽屉 */}
            <DrawerWrapper
                className={styles.drawerWrapper}
                open={!!active}
                onClose={() => setActive(undefined)}
                placement="bottom"
                title={
                    <TodoItemTitle
                        item={list.find((item) => item.todo_id === active?.todo_id)}
                        showTime={true}
                        keyword=""
                        wrapperStyle={{}}
                    />
                }
                footer={
                    <Space size={16} style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "10px" }}>
                        <Button onClick={() => copyContent(`${active?.name}\n${active?.description}`)} type="primary">
                            复制内容
                        </Button>
                        <Button
                            onClick={() => {
                                setOperatorType("edit");
                                setShowAdd(true);
                            }}
                            danger
                            type="primary"
                        >
                            编辑
                        </Button>
                    </Space>
                }
            >
                <div className={styles.modalContent}>
                    {list.find((item) => item.todo_id === active?.todo_id) && (
                        <Item
                            item={list.find((item) => item.todo_id === active?.todo_id)}
                            isActive={true}
                            showTitle={false}
                            getData={getData}
                        />
                    )}
                </div>
            </DrawerWrapper>
            <TodoFormDrawer
                open={showAdd}
                todo_id={active?.todo_id}
                onClose={() => {
                    setOperatorType("add-note");
                    setShowAdd(false);
                }}
                onSubmit={() => {
                    setOperatorType("add-note");
                    setShowAdd(false);
                }}
                operatorType={operatorType}
            />
        </>
    );
};

export default TodoNote;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
