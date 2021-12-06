import Header from "../../components/header";
import styles from "./index.module.scss";
import { Button, Input, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import { YouDaoTranslate, switchTranslateMark } from "../../service";

const { TextArea } = Input;

const Translate = () => {
    const router = useRouter();

    const [keyword, setKeyword] = useState<string>();
    const [translate, setTranslate] = useState<any>();

    const handleSearch = async () => {
        const str = keyword?.trim();
        if (!str) {
            message.warning('请输入要翻译的内容');
            return
        }
        const res = await YouDaoTranslate(str);
        if (res) {
            setTranslate({
                ...res,
                result: JSON.parse(res.result)
            });
        } else {
            setTranslate(false);
        }
    };

    // 加入 or 移出单词本
    const switchMark = async () => {
        const newMark = translate.isMark === 1 ? 0 : 1;
        const res = await switchTranslateMark(translate.translate_id, newMark);
        if (res) {
            setTranslate({
                ...translate,
                isMark: newMark
            })
        }
    }

    return (
        <>
            <Header title={"翻译"} />
            <main>
                <h2 className={styles.h2}>
                    <span>翻译</span>
                </h2>
                <TextArea value={keyword} onChange={(e) => setKeyword(e.target.value)} rows={10} />
                <div className={styles.search}>
                    {translate && <Button onClick={() => switchMark()}>{translate.isMark === 0 ? '加到单词本' : '移出单词本'}</Button>}
                    <Button onClick={() => handleSearch()} type="primary">
                        查询
                    </Button>
                </div>
                <div className={`${styles.result} ScrollBar`}>
                    {translate?.result && <div className={styles.label}>翻译：</div>}
                    {translate?.result?.translation?.map((item) => {
                        return <div key={item}>{item}</div>;
                    })}
                    {translate?.result?.basic?.phonetic && (
                        <div>
                            <span className={styles.label}>音标：</span>[{translate?.result?.basic?.phonetic}]
                        </div>
                    )}
                    {translate?.result?.basic?.explains && (
                        <>
                            <div className={styles.label}>解释：</div>
                            {translate?.result?.basic?.explains?.map((item) => {
                                return <div key={item}>{item}</div>;
                            })}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default Translate;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
