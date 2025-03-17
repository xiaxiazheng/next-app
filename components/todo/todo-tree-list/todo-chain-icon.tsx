import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TodoItemType } from "../types";
import { SwapOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";

export const hasChainIcon = (item: TodoItemType) => {
    const isHasChild = item?.child_todo_list_length && item?.child_todo_list_length !== 0;
    const isUp = !!item?.other_id;
    const isDown = !!isHasChild;

    return {
        isUp,
        isDown,
        hasChain: isUp || isDown,
    };
};

export const TodoChainIcon = ({ item }: { item: TodoItemType }) => {
    const { isDown, isUp } = hasChainIcon(item);

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
