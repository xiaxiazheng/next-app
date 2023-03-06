import dayjs from 'dayjs';
import { TodoItemType } from '../types';

interface TimeRange {
    startTime: string;
    range: number;
    target: number;
}

// 计算时间相关
export const handleTimeRange = (timeRange: string) => {
    const { startTime, range, target } = timeRangeParse(timeRange);
    return {
        startTime,
        endTime: dayjs(startTime)
            .add(Number(range - 1), "d")
            .format("YYYY-MM-DD"),
        range,
        target,
    };
};

// 判断今天是否已打卡
export const handleIsTodayPunchTheClock = (item: TodoItemType): boolean => {
    if (!item?.timeRange) return false;

    // 先判断今天是否在任务范围内
    const { startTime, endTime } = handleTimeRange(item.timeRange);
    const isHasToday = dayjs(startTime).isAfter(dayjs()) && dayjs(endTime).isBefore(dayjs());
    // 如果在再判断子任务中包不包含今天的打卡时间
    return (
        (isHasToday && item?.child_todo_list.map((item) => item.time).includes(dayjs().format("YYYY-MM-DD"))) || false
    );
};

export const timeRangeStringify = ({ startTime, range, target }: TimeRange): string => {
    return JSON.stringify({ startTime, range, target });
};

export const timeRangeParse = (val: string): TimeRange => {
    return JSON.parse(val);
};