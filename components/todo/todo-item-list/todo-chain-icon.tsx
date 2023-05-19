import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TodoItemType } from "../types";
import { SwapOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";

export const TodoChainIcon = ({ item }: { item: TodoItemType }) => {
    const isHasChild = item?.child_todo_list_length !== 0;

    // 在 todo 链路的展示中，前置的就不看了（因为已经找全了）
    const isUp = item?.other_id;
    // 非后续的任务，如果少于一条也不看了，因为也已经找全了；后续任务有后续的还是得看的
    const isDown = isHasChild;

    if (!isUp && !isDown) {
        return null;
    }
    let Comp: any;

    if (isUp && isDown) {
        Comp = SwapOutlined;
    } else if (isUp) {
        Comp = SwapLeftOutlined;
    } else {
        Comp = SwapRightOutlined;
    }

    return <Comp className={styles.icon} style={{ color: "#1890ff" }} />;
};

export default TodoChainIcon;
