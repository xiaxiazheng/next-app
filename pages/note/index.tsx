import Header from "../../components/header";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { GetNoteList, GetNoteCategory } from "../../service";
import { useEffect, useState } from "react";
import { Input, Button, Pagination, Radio } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";
import { NoteType } from "../../components/note/types";
import Category from "../../components/todo/category";
import MyDrawer from "../../components/my-drawer";
import PreviewImages from "../../components/preview-images";
import UploadImageFile from "../../components/upload-image-file";
import { handleUrl, handleKeyword } from "../../components/note/utils";
import AffixEdit from "../../components/affix/affix-edit";
import PreviewFiles from "../../components/preview-files";
import MyModal from "../../components/my-modal";

const { Search } = Input;

const Note = () => {
    const [title, setTitle] = useState<string>("");
    const [isMe, setIsMe] = useState<boolean>(false);
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isMe = username === "zyb" ? true : false;
        setIsMe(isMe);
        const title = isMe ? "便签" : "法条";
        setTitle(title);

        getCategory();
    }, []);

    const router = useRouter();

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<NoteType[]>([]);

    const getData = async () => {
        const params = {
            pageNo,
            pageSize,
            keyword: keyword || "",
        };
        if (activeCategory !== "所有") {
            params["category"] = activeCategory;
        }
        const res = await GetNoteList(params);
        if (res) {
            const data = res.data;
            setList(
                data?.list.map((item) => {
                    return {
                        ...item,
                        note: keyword && keyword !== "" ? handleKeyword(item.note, keyword) : handleUrl(item.note),
                    };
                })
            );
            setTotal(data.total);
        }
    };

    const handleClick = (item: NoteType) => {
        active?.note_id === item.note_id ? setActive(undefined) : setActive(item);
    };

    const handleAdd = () => {
        router.push("/note-add");
    };

    useEffect(() => {
        getData();
    }, [pageNo]);

    const [active, setActive] = useState<NoteType>();

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [category, setCategory] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("所有");
    const getCategory = async () => {
        const res: any = await GetNoteCategory();
        const resData = await res.json();
        setCategory(resData.data);
    };
    useEffect(() => {
        pageNo === 1 ? getData() : setPageNo(1);
    }, [activeCategory]);

    const Item = (props: { item: NoteType; isActive: boolean }) => {
        const { item, isActive } = props;
        if (!item) return null;
        return (
            <>
                <div className={`${styles.note_cont} ${isActive ? styles.active : ""}`}>
                    {isMe && <Category category={item.category} color="2" />}
                    <span dangerouslySetInnerHTML={{ __html: item.note }} />
                    {isActive && !isMe && (
                        <div>
                            <Category category={item.category} color="2" />
                        </div>
                    )}
                </div>
                <PreviewImages imagesList={item.imgList} />
                <PreviewFiles filesList={item.fileList} />
                {isActive && <UploadImageFile type="note" otherId={item.note_id} refreshImgList={() => getData()} />}
            </>
        );
    };

    return (
        <>
            <Header title={title} />
            <main className={styles.note}>
                <h2 className={styles.h2}>
                    <span>
                        {title} ({total})
                    </span>
                    <span>
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => handleAdd()}
                        />
                    </span>
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
                            const isActive = active?.note_id === item.note_id;
                            return (
                                <div
                                    key={item.note_id}
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
                <MyModal visible={!!active} onCancel={() => setActive(undefined)} showFooter={false}>
                    <div className={styles.modalContent}>
                        <Item item={active} isActive={true} />
                    </div>
                </MyModal>
                {active && <AffixEdit onClick={() => router.push(`/note/edit_note/${active.note_id}`)} />}
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
