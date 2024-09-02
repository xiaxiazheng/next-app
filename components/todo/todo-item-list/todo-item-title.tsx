import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TodoStatus } from "../../../service";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    AimOutlined,
    FireFilled,
    BookOutlined,
    StarFilled,
    AppleFilled,
    ThunderboltFilled,
} from "@ant-design/icons";
import Category from "../category";
import { TodoItemType } from "../types";
import { getTodoTimeDetail, handleHighlight, judgeIsLastModify } from "../utils";
import TodoChainIcon from "./todo-chain-icon";
import { handleIsTodayPunchTheClock } from "../todo-form-habit/utils";
import TodoHabitIcon from "../todo-habit-drawer/todo-habit-icon";

interface IProps {
    item: TodoItemType;
    onClick?: (item: TodoItemType) => void;
    keyword: string;
    showTime?: boolean;
}

const judgeIsPunchTheClock = (item: TodoItemType) => {
    if (item.isHabit !== "1") return {};

    if (handleIsTodayPunchTheClock(item)) {
        return { color: "#6bb167" };
    } else {
        return { color: "#c15b5b" };
    }
};

const TodoItemTitle: React.FC<IProps> = (props) => {
    const { item, onClick, keyword, showTime = false } = props;

    if (!item) return null;

    return (
        <div style={{ marginBottom: 8 }}>
            <Category color={item.color} category={item.category} style={{ verticalAlign: "-1px" }} />
            {/* 公司 */}
            {item.isWork === "1" && <AppleFilled style={{ marginRight: 5, color: "#00d4d8" }} />}
            {/* 加急 */}
            {item.doing === "1" && (
                <ThunderboltFilled style={{ marginRight: 5, color: "red", verticalAlign: "middle" }} />
            )}
            {/* 目标 */}
            {item.isTarget === "1" && <AimOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />}
            {/* 待跟进 */}
            {item.isFollowUp === "1" && <FireFilled style={{ marginRight: 5, color: "#ffeb3b" }} />}
            {/* 存档 */}
            {item.isNote === "1" && <BookOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />}
            {/* 书签 */}
            {item.isBookMark === "1" && <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />}
            <TodoHabitIcon item={item} />
            <span
                onClick={() => onClick && onClick(item)}
                style={{ ...judgeIsLastModify(item.todo_id), ...judgeIsPunchTheClock(item) }}
            >
                {String(item.status) === String(TodoStatus.done) && item.isBookMark !== "1" ? (
                    <s>
                        {handleHighlight(item.name, keyword)} {showTime && `(${getTodoTimeDetail(item.time)})`}
                    </s>
                ) : (
                    <span>
                        {handleHighlight(item.name, keyword)} {showTime && `(${getTodoTimeDetail(item.time)})`}
                    </span>
                )}
                {item.description && <QuestionCircleOutlined className={styles.icon} />}
                {item?.imgList && item.imgList?.length !== 0 && <FileImageOutlined className={styles.icon} />}
                <TodoChainIcon item={item} />
            </span>
        </div>
    );
};

export default TodoItemTitle;
