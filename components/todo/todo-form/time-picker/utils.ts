import dayjs from "dayjs";

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

export const getDayjs = (day: dayjs.Dayjs | string) => {
    if (typeof day === "string") {
        day = dayjs(day);
    }
    const year = day.get("year");
    const month = day.get("month") + 1;
    const date = day.get("date");
    return dayjs(`${year}-${month}-${date}`);
};
