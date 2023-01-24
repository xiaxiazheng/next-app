import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { GetTodoById, TodoStatus } from "../../../service";
import { Button, Input, Space } from "antd";
import {
    PlusOutlined,
    QuestionCircleOutlined,
    FileImageOutlined,
    SyncOutlined,
    AimOutlined,
    BookOutlined,
    StarFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Category from "../../../components/todo/category";
import { TodoItemType } from "../../../components/todo/types";
import DescriptionModal from "../../../components/todo/description-modal";
import { CalendarOutlined } from "@ant-design/icons";

interface IProps {
    list: TodoItemType[];
    handleClick: (item: TodoItemType) => void;
}

const TodoItem: React.FC<IProps> = (props) => {
    const { list, handleClick } = props;

    return (
        <>
            {list.map((item) => (
                <div key={item.todo_id} style={{ marginBottom: 8 }}>
                    <Category color={item.color} category={item.category} style={{ verticalAlign: "-1px" }} />
                    {/* 目标 */}
                    {item.isTarget === "1" && <AimOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />}
                    {/* 存档 */}
                    {item.isNote === "1" && <BookOutlined style={{ marginRight: 5, color: "#ffeb3b" }} />}
                    {/* 书签 */}
                    {item.isBookMark === "1" && <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />}
                    <span
                        onClick={() => {
                            handleClick(item);
                        }}
                    >
                        <span
                            style={
                                item.status === String(TodoStatus.todo) && item.doing === "1"
                                    ? { color: "#ffeb3b" }
                                    : {}
                            }
                        >
                            {item.name}
                        </span>
                        {item.description && <QuestionCircleOutlined className={styles.icon} />}
                        {item.imgList.length !== 0 && <FileImageOutlined className={styles.icon} />}
                    </span>
                </div>
            ))}
        </>
    );
};

export default TodoItem;
