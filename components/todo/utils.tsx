import { TodoItemType } from "./types";
import dayjs from 'dayjs';
import styles from './utils.module.scss';
import { splitStr } from "./input-list";

export const renderDescription = (str: string) => {
    return (
        <div className={styles.descList}>
            {str.split(splitStr).map((i, index) => (
                <div className={styles.desc} key={index}>
                    {handleDesc(i)}
                </div>
            ))}
        </div>
    );
};

// 处理详细描述，把链接抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleDesc = (str: string) => {
    const re = /http[s]?:\/\/[^\s]*/g;
    let match;
    const urlList: string[] = [];
    let s = str;
    while ((match = re.exec(str)) !== null) {
        const url = match[0];
        urlList.push(url);
        s = s.replace(url, "<url_flag>");
    }

    return urlList.length === 0 ? (
        str
    ) : (
        <span>
            {s.split("<url_flag>").map((item, index) => {
                return (
                    <span key={index}>
                        {item}
                        {urlList[index] && (
                            <a style={{ color: "#1890ff" }} href={urlList[index]} target="_blank" rel="noreferrer">
                                {urlList[index]}
                            </a>
                        )}
                    </span>
                );
            })}
        </span>
    );
};

// 将数组按照 time 抽成 map
export const formatArrayToTimeMap = (list: TodoItemType[]) => {
    return list.reduce((prev, cur) => {
        prev[cur.time] = typeof prev[cur.time] === "undefined" ? [cur] : prev[cur.time].concat(cur);
        return prev;
    }, {});
};

const weekList = ["日", "一", "二", "三", "四", "五", "六"];
export const getWeek = (time: string) => {
    return `周${weekList[dayjs(time).day()]}`;
};

