import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTranslateList } from "../../service";

interface WordType {
    keyword: string;
    translate_id: string;
    result: any;
    time: string;
    isMark: number;
}

const WordBook = () => {
    const [list, setList] = useState<WordType[]>([]);
    const [active, setActive] = useState<string>();

    const [keyword, setKeyword] = useState<string>("");
    const [pageNo, setPageNo] = useState<number>(1);
    const pageSize = 100;

    const getData = async () => {
        const res = await getTranslateList(keyword, pageNo, pageSize);
        setList(
            res.data.list.map((item) => {
                return {
                    ...item,
                    result: JSON.parse(item.result),
                };
            })
        );
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Header title={"单词本"} />
            <main>
                <h2 className={styles.h2}>
                    <span>单词本</span>
                    {active && <Button>移除</Button>}
                </h2>
                <div className={styles.wordList}>
                    {list.map((item) => {
                        const isActive = active === item.translate_id;
                        return (
                            <div
                                key={item.translate_id}
                                className={`${styles.word} ${isActive && styles.active}`}
                                onClick={() => setActive(active === item.translate_id ? undefined : item.translate_id)}
                            >
                                <div>{item.keyword} {!isActive && item.result?.basic?.phonetic && `[${item.result?.basic?.phonetic}]`}</div>
                                {isActive && (
                                    <>
                                        <div>
                                            {item.result && <div className={styles.label}>翻译：</div>}
                                            {item.result?.translation?.map((item) => {
                                                return <div key={item}>{item}</div>;
                                            })}
                                            {item.result?.basic?.phonetic && (
                                                <div>
                                                    <span className={styles.label}>音标：</span>[
                                                    {item.result?.basic?.phonetic}]
                                                </div>
                                            )}
                                            {item.result?.basic?.explains && (
                                                <>
                                                    <div className={styles.label}>解释：</div>
                                                    {item.result?.basic?.explains?.map((item) => {
                                                        return <div key={item}>{item}</div>;
                                                    })}
                                                </>
                                            )}
                                        </div>
                                        <div>{item.time}</div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </>
    );
};

export default WordBook;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
