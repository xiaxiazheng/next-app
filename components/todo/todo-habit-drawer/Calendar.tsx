import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Calendar } from "antd";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getToday } from "../todo-form-habit/utils";

interface IProps {
    active: TodoItemType | undefined;
}

const HabitCalendar: React.FC<IProps> = (props) => {
    const { active } = props;

    const childDateList = active?.child_todo_list?.map((item) => item.time) || [];

    const isThisMonth = (date: dayjs.Dayjs) => {
        return value?.get("M") === date.get("M");
    };

    const [value, setValue] = useState<any>(dayjs());

    if (!active) return null;

    const startTime = active.time, endTime = getToday();
    const endTimeAddOne = dayjs(endTime).add(1, "day");

    return (
        <div className={styles.calendarWrapper}>
            <Calendar
                fullscreen={false}
                onChange={(val) => setValue(val)}
                disabledDate={(currentData) =>
                    active &&
                    (currentData.isBefore(startTime) ||
                        currentData.isAfter(endTimeAddOne))
                }
                dateFullCellRender={(date) => {
                    if (active) {
                        if (date.isAfter(startTime) && date.isBefore(dayjs())) {
                            const isDone = childDateList.includes(date.format("YYYY-MM-DD"));
                            const isToday = date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
                            return (
                                <div
                                    className={`${styles.cell}
                                  ${!isThisMonth(date) && styles.notThisMonth} 
                                  ${isDone ? styles.green : isToday ? styles.blue : styles.red}`}
                                >
                                    {date.get("D")}
                                </div>
                            );
                        }
                        if (date.isBefore(endTimeAddOne) && date.isAfter(dayjs())) {
                            return (
                                <div
                                    className={`${styles.cell} 
                                ${!isThisMonth(date) && styles.notThisMonth} ${styles.blueBorder}`}
                                >
                                    {date.get("D")}
                                </div>
                            );
                        }
                    }
                    return <div className={styles.cell}>{date.get("D")}</div>;
                }}
                headerRender={({ value, onChange }) => {
                    const year = value.year();
                    const month = value.month();
                    return (
                        <div style={{ padding: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div
                                    onClick={() => {
                                        const now = value.clone().month(month - 1);
                                        onChange(now);
                                    }}
                                >
                                    <LeftOutlined />
                                </div>
                                <div>
                                    {year}-{month + 1}
                                </div>
                                <div
                                    onClick={() => {
                                        const now = value.clone().month(month + 1);
                                        onChange(now);
                                    }}
                                >
                                    <RightOutlined />
                                </div>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default HabitCalendar;
