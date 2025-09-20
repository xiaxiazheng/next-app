import { TodoItemType } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import styles from "./utils.module.scss";
import { splitStr } from "./todo-form/input-list";
import { MarkdownShow } from "@xiaxiazheng/blog-libs";

export const renderDescription = (str: string, keyword: string = "") => {
    return (
        <div className={styles.descList}>
            {str.split(splitStr).map((i, index) => (
                <div className={styles.desc} key={index}>
                    {handleDescriptionHighlight(i, keyword)}
                </div>
            ))}
        </div>
    );
};

export const handleDescriptionHighlight = (string: string, keyword: string = "") => {
    if (!string) return "";
    return <MarkdownShow blogcont={string} keyword={keyword} />;
};

// 把 http/https 的 url 抠出来，思路是保留每一个断点的 url 并填充占位符，最后统一处理
export const handleUrlHighlight = (str: string, keyword: string = "") => {
    const re = /http[s]?:\/\/[^\s|,|，|:|：]*/g;
    let match;
    const urlList: string[] = [];
    let s = str;
    while ((match = re.exec(str)) !== null) {
        const url = match[0];
        urlList.push(url);
        s = s.replace(url, "<url_flag>");
    }

    return urlList.length === 0 ? (
        handleKeywordHighlight(str, keyword)
    ) : (
        <span>
            {s.split("<url_flag>").map((item, index) => {
                return (
                    <span key={index}>
                        {handleKeywordHighlight(item, keyword)}
                        {urlList[index] && (
                            <a style={{ color: "#40a9ff" }} href={urlList[index]} target="_blank" rel="noreferrer">
                                {handleKeywordHighlight(urlList[index], keyword)}
                            </a>
                        )}
                    </span>
                );
            })}
        </span>
    );
};

const colorList = ["yellow", "#32e332", "#40a9ff", "red"];

// 根据关键字高亮
export const handleKeywordHighlight = (str: string, originKeyword: string = "") => {
    const keyword = originKeyword.trim(); // 去掉左右的空格
    if (!keyword || keyword === "") {
        return str;
    }

    // 用空格分隔关键字
    const keys = keyword.split(" ").filter((item) => !!item);

    // demo 代码：
    // var str = "31331231";
    // var a1 = 31,
    //     a2 = 23;
    // var reg = new RegExp(`(${a2})|(${a1})`, "gim");
    // str.split(reg);

    try {
        const key = keys.map((item) => `(${item})`).join("|");
        const reg = new RegExp(key, "gim");
        const list = str.split(reg).filter((item) => typeof item !== "undefined" && item !== "");

        const map = keys.reduce((prev, cur, index) => {
            prev[cur.toLowerCase()] = index;
            return prev;
        }, {} as any);

        return list.map((item, index) => {
            if (typeof map[item.toLowerCase()] !== "undefined") {
                return (
                    <span
                        key={index}
                        style={{
                            color: "#908080",
                            background: colorList?.[map[item.toLowerCase()]] || "yellow",
                            margin: "0 3px",
                            padding: "0 3px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                        }}
                    >
                        {item}
                    </span>
                );
            } else {
                return <span key={index}>{item}</span>;
            }
        });
    } catch (e) {
        return str;
    }
};

// 将数组按照 time 抽成 map
export const formatArrayToTimeMap = (list: TodoItemType[]) => {
    return list.reduce((prev, cur) => {
        prev[cur.time] = typeof prev[cur.time] === "undefined" ? [cur] : prev[cur.time].concat(cur);
        return prev;
    }, {});
};

// 日期 + xx天前/后 + 周几
export const getTodoTimeDetail = (time: string) => {
    return `${time}, ${getRangeFormToday(time)}, ${getWeek(time)}`;
};

const weekList = ["日", "一", "二", "三", "四", "五", "六"];
export const getWeek = (time: string) => {
    return `周${weekList[dayjs(time).day()]}`;
};

export const getDayjs = (day: dayjs.Dayjs | string) => {
    if (typeof day === "string") {
        day = dayjs(day);
    }
    const year = day.get("year");
    const month = day.get("month") + 1;
    const date = day.get("date");
    return dayjs(`${year}-${month}-${date}`);
};

export const getRangeFormToday = (time: string | undefined) => {
    if (!time) return "";
    const day = getDayjs(time).diff(getDayjs(dayjs()), "d");
    if (day === 0) return "今天";
    if (day === -1) return "昨天";
    if (day === -2) return "前天";
    if (day === 1) return "明天";
    if (day === 2) return "后天";
    return `${Math.abs(day)} 天${day < 0 ? "前" : "后"}`;
};

// 用于获取单日的 todo 列表的排序
export const getShowList = (list: TodoItemType[], params: { isSortTime: boolean; keyword?: string }) => {
    const { isSortTime, keyword } = params;
    let l = [];
    if (!isSortTime) {
        const sortStatus = (list) => { // 未完成放前面
            return list.filter((item) => item.status !== "1").concat(list.filter((item) => item.status === "1"));
        }
        const sortDoing = (list) => { // doing 放那面
            return list.filter((item) => item.doing === "1").concat(list.filter((item) => item.doing !== "1")); // 这里不用 sort 因为用 sort 会打乱顺序
        }
        // 未完成放前面优先级 > doing 放前面
        l =  sortStatus(sortDoing(list));
    } else {
        l = [...list].sort(
            // sort 会改变原数组
            (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
        );
    }

    return !keyword
        ? l
        : l.filter((item) => item.name.indexOf(keyword) !== -1 || item.description.indexOf(keyword) !== -1);
};

interface FootprintType {
    todo_id: string;
    edit_time: string;
}
const key = "todo_footprint_id_list";
const maxLength = 5;

export const getFootPrintList = (): FootprintType[] => {
    const str = localStorage.getItem(key);
    return str ? JSON.parse(str) : [];
};

export const setFootPrintList = (todo_id: string) => {
    const list = getFootPrintList();
    const l = [
        {
            todo_id,
            edit_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
    ]
        .concat(list.filter((item) => item.todo_id !== todo_id))
        .slice(0, maxLength);
    localStorage.setItem(key, JSON.stringify(l));
};

// 判断是否是最后几次操作的 todo
const latestColorList = ["rgba(175, 226, 177, 0.45)", "rgba(175, 226, 177, 0.2)", "rgba(175, 226, 177, 0.1)"];
export const judgeIsLastModify = (todo_id: string) => {
    const index = getFootPrintList()
        .slice(0, 3)
        .map((item) => item.todo_id)
        .indexOf(todo_id);
    return index !== -1 ? { backgroundColor: latestColorList[index], display: "inline" } : {};
};

export const getExtraDayjs = (day: dayjs.Dayjs | string) => {
    if (typeof day === "string") {
        day = dayjs(day).set('hour', 0).set('minute', 0).set('second', 0).set("millisecond", 0);
    }
    return day.set('hour', 0).set('minute', 0).set('second', 0).set("millisecond", 0);
};

export const getToday = () => {
    return getExtraDayjs(dayjs());
};