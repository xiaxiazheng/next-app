import Header from "../../components/header";
import styles from "./index.module.scss";
import { Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { GetNoteList, GetNoteById } from "../../service";
import { useEffect, useState } from "react";
import AffixRefresh from "../../components/affix/affix-refresh";
import { NoteType } from "../../components/note/types";
import { useRouter } from "next/router";
import Category from "../../components/todo/category";
import PreviewImages from "../../components/preview-images";
import { handleUrl } from "../../components/note/utils";
import PreviewFiles from "../../components/preview-files";

const NoteRandom = () => {
    const router = useRouter();

    const [pageNo, setPageNo] = useState<number>();
    const [title, setTitle] = useState<string>("");
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isPP = username === "hyp" ? true : false;
        const title = isPP ? "抽法条机" : "随机便签";
        setTitle(title);
    }, []);

    const [note, setNote] = useState<NoteType>();
    const [total, setTotal] = useState<number>();

    const getData = async () => {
        let count = total;
        if (!total) {
            // 先获取到 total
            const params = {
                pageNo: 1,
                pageSize: 1,
                keyword: "",
            };
            const res = await GetNoteList(params);
            if (res) {
                const data = res.data;
                count = data.total;
                setTotal(data.total);
            }
        }

        // 然后计算出 offset，随机选一篇
        const pageNo = Math.floor(count * Math.random()) + 1;
        setPageNo(pageNo);
        const params = {
            pageNo,
            pageSize: 1,
            keyword: "",
        };
        const res = await GetNoteList(params);
        if (res) {
            const data = res.data;
            // 最后获取该日志
            const res1 = await GetNoteById(data.list[0].note_id);
            if (res1) {
                const data = res1.data;
                setNote(data);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSwitch = () => {
        getData();
    };

    return (
        <>
            <Header title={title} />
            <main>
                <h2 className={styles.h2}>
                    <span>
                        {title} ({pageNo} / {total})
                    </span>
                    <span>
                        <Button
                            style={{ width: 50, marginRight: 10 }}
                            icon={<CopyOutlined />}
                            onClick={() => router.push(`/note/edit_note/${note?.note_id}`)}
                            type="primary"
                            danger
                        />
                    </span>
                </h2>
                <div className={`${styles.note_random} ScrollBar`}>
                    <span
                        className={styles.note_cont}
                        dangerouslySetInnerHTML={{ __html: handleUrl(note?.note || "") }}
                    ></span>
                    <div>
                        <Category color="2" category={note?.category} />
                    </div>
                    <PreviewImages imagesList={note?.imgList || []} />
                    <PreviewFiles filesList={note?.fileList || []} />
                </div>
                <AffixRefresh onClick={() => handleSwitch()} />
            </main>
        </>
    );
};

export default NoteRandom;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
