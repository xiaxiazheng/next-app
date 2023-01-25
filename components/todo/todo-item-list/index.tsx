import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { GetTodoById, TodoStatus } from "../../../service";
import {
    QuestionCircleOutlined,
    FileImageOutlined,
    AimOutlined,
    BookOutlined,
    StarFilled,
} from "@ant-design/icons";
import Category from "../category";
import { TodoItemType } from "../types";
import { SwapOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";
import DescriptionModal from "../description-drawer";

interface IProps {
    list: TodoItemType[];
    onRefresh: Function;
}

const TodoItemList: React.FC<IProps> = (props) => {
    const { list, onRefresh } = props;

    const Icon = ({ item }: { item: TodoItemType }) => {
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

    const [showDesc, setShowDesc] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        onRefresh();
    };

    return (
        <>
            {list
                .sort((a, b) => (a.doing === "1" ? -1 : 0))
                .map((item) => (
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
                                setActiveTodo(item);
                                setShowDesc(true);
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
                            <Icon item={item} />
                        </span>
                    </div>
                ))}
            {/* 详情弹窗 */}
            <DescriptionModal
                visible={showDesc}
                setVisible={setShowDesc}
                activeTodo={activeTodo}
                onFinish={() => getTodoById(activeTodo.todo_id)}
            />
        </>
    );
};

export default TodoItemList;
