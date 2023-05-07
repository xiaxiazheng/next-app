import dayjs from "dayjs";
import { TodoItemType } from "../types";

interface TimeRange {
    startTime: string;
    target: number;
}

// 计算时间相关
export const handleTimeRange = (timeRange: string) => {
    const { startTime, target } = timeRangeParse(timeRange);
    return {
        startTime,
        endTime: dayjs().format("YYYY-MM-DD"),
        target,
    };
};

// 判断今天是否已打卡
export const handleIsTodayPunchTheClock = (item: TodoItemType): boolean => {
    if (!item?.timeRange) return false;

    // 先判断今天是否在任务范围内
    // const { startTime, endTime } = handleTimeRange(item.timeRange);

    // const isHasToday = dayjs(startTime).isBefore(dayjs()) && dayjs(endTime).isAfter(dayjs());
    // 如果在再判断子任务中包不包含今天的打卡时间
    // return (
    //     (isHasToday && item?.child_todo_list.map((item) => item.time).includes(dayjs().format("YYYY-MM-DD"))) || false
    // );

    // 没有截止时间了，所以不用判断是否在打卡任务范围内了
    return item?.child_todo_list.map((item) => item.time).includes(dayjs().format("YYYY-MM-DD"));
};

export const timeRangeStringify = ({ startTime, target }: TimeRange): string => {
    return JSON.stringify({ startTime, target });
};

export const timeRangeParse = (val: string): TimeRange => {
    return JSON.parse(val);
};
