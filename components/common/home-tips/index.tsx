import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { GetTodo, getTodoTarget } from "../../../service";
import { TodoItemType } from "../../todo/types";
import dayjs from "dayjs";
import { useRouter } from "next/router";

interface MsgType {
    type: "todo-list" | "todo-list-punch-the-clock";
    message: string;
}

const HomeTips: React.FC = (props) => {
    const router = useRouter();
    const [msgList, setMsgList] = useState<MsgType[]>([]);

    const getTodoTips = async (): Promise<MsgType> => {
        const res = await GetTodo();
        const list = res && res.data.filter((item) => item.time === dayjs().format("YYYY-MM-DD")) || [];
        return {
            type: "todo-list",
            message: list.length !== 0 ? `今日还有 ${list.length} 条 todo 没完成，快去看看` : "",
        };
    };

    const getPunchTheClockTips = async (): Promise<MsgType> => {
        const res = await getTodoTarget();
        let list: TodoItemType[] = [];
        if (res) {
            // 这个判断的功能还不完善，晚点再弄
            list = res.data.list
                .filter((item) => item.timeRange)
                .filter((item) => item.time === dayjs().format("YYYY-MM-DD"));
        }

        return {
            type: "todo-list-punch-the-clock",
            message: res && list.length !== 0 ? `今日还有 ${list.length} 条任务没有打卡` : "",
        };
    };

    useEffect(() => {
        Promise.all([getTodoTips(), getPunchTheClockTips()]).then((res) => {
            console.log(res);
            setMsgList(res.filter((item) => item.message !== ""));
        });
    }, []);

    if (msgList.length === 0) return null;

    return (
        <div className={`${styles.HomeTips} ScrollBar`}>
            {msgList.map((item) => {
                return (
                    <div key={item.type} onClick={() => router.push(item.type)}>
                        {item.message}
                    </div>
                );
            })}
        </div>
    );
};

export default HomeTips;
