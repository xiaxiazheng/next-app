import Header from "../../components/header";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { GetNoteList, GetNoteCategory, getTodoDone, getTodoList, GetTodoCategory } from "../../service";
import { useEffect, useState } from "react";
import { Input, Button, Pagination, Radio, Space, message } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";
import { NoteType } from "../../components/note/types";
import Category from "../../components/todo/category";
import MyDrawer from "../../components/my-drawer";
import PreviewImages from "../../components/preview-images";
import UploadImageFile from "../../components/upload-image-file";
import { handleUrl, handleKeyword } from "../../components/note/utils";
import PreviewFiles from "../../components/preview-files";
import MyModal from "../../components/my-modal";
import { TodoItemType } from "../../components/todo/types";

const { Search } = Input;

const title = "todo note";

const Note = () => {
    useEffect(() => {
        getCategory();
    }, []);

    const router = useRouter();

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<TodoItemType[]>([]);
    const [sortBy, setSortBy] = useState<"mTime" | "cTime">("mTime");

    const getData = async () => {
        const params = {
            pageNo,
            pageSize,
            keyword: keyword || "",
            isNote: "1",
            sortBy: [[sortBy, "DESC"]],
        };
        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }
        const res = await getTodoList(params);
        if (res) {
            const data = res.data;
            setList(
                data.list
                // 处理高亮
                // data?.list.map((item: TodoItemType) => {
                //     return {
                //         ...item,
                //         name: keyword && keyword !== "" ? handleKeyword(item.name, keyword) : item.name,
                //         description:
                //             keyword && keyword !== ""
                //                 ? handleKeyword(item.description, keyword)
                //                 : handleUrl(item.description),
                //     };
                // })
            );
            setTotal(data.total);
        }
    };

    const handleClick = (item: TodoItemType) => {
        active?.todo_id === item.todo_id ? setActive(undefined) : setActive(item);
    };

    const handleAdd = () => {
        router.push("/todo-add");
    };

    useEffect(() => {
        getData();
    }, [pageNo, sortBy]);

    const [active, setActive] = useState<TodoItemType>();

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = async () => {
        const res: any = await GetTodoCategory({ isNote: "1" });
        const resData = await res.json();
        setCategory(resData.data);
    };
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory]);

    const Item = (props: { item: TodoItemType; isActive: boolean }) => {
        const { item, isActive } = props;
        if (!item) return null;
        return (
            <>
                <div className={`${styles.note_cont} ${isActive ? styles.active : ""}`}>
                    <div>
                        {<Category style={{ verticalAlign: 1 }} category={item.category} color={item.color} />}
                        {item.name}
                    </div>
                    <div>{item.description}</div>
                </div>
                <div className={styles.imgFileList}>
                    <PreviewImages imagesList={item.imgList} style={{ margin: 0 }} />
                    <PreviewFiles filesList={item.fileList} style={{ margin: 0 }} />
                    {isActive && (
                        <UploadImageFile
                            type="todo"
                            otherId={item.todo_id}
                            refreshImgList={() => getData()}
                            style={{ margin: 0 }}
                        />
                    )}
                </div>
            </>
        );
    };

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

    return (
        <>
            <Header title={title} />
            <main className={styles.note}>
                <h2 className={styles.h2}>
                    <span>
                        {title} ({total})
                    </span>
                    <Space size={5}>
                        <Button
                            type="primary"
                            onClick={() => setSortBy((prev) => (prev === "cTime" ? "mTime" : "cTime"))}
                        >
                            {sortBy}
                        </Button>
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => handleAdd()}
                        />
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
                <div className={styles.content}>
                    <div className={styles.list}>
                        {list.map((item) => {
                            const isActive = active?.todo_id === item.todo_id;
                            return (
                                <div
                                    key={item.todo_id}
                                    className={`${styles.list_item} ${isActive ? styles.active : ""}`}
                                    onClick={() => handleClick(item)}
                                >
                                    <Item item={item} isActive={false} />
                                </div>
                            );
                        })}
                    </div>
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
                <MyDrawer visible={showDrawer} onCancel={() => setShowDrawer(false)} placement="bottom">
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
                </MyDrawer>
                <MyModal
                    visible={!!active}
                    onCancel={() => setActive(undefined)}
                    footer={() => (
                        <Space size={16}>
                            <Button
                                onClick={() => copyContent(`${active?.name}\n${active?.description}`)}
                                type="primary"
                            >
                                复制内容
                            </Button>
                            <Button onClick={() => router.push(`/todo-edit/${active.todo_id}`)} danger type="primary">
                                编辑
                            </Button>
                        </Space>
                    )}
                    style={{ width: "100vw", maxWidth: "100vw" }}
                >
                    <div className={styles.modalContent}>
                        <Item item={list.find((item) => item.todo_id === active?.todo_id)} isActive={true} />
                    </div>
                </MyModal>
            </main>
        </>
    );
};

export default Note;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
