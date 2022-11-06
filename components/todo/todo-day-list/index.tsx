import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { EditTodoItem, GetTodoById, TodoStatus } from "../../../service";
import { Button, Collapse, message, Space } from "antd";
import {
    PlusOutlined,
    QuestionCircleOutlined,
    VerticalAlignTopOutlined,
    FileImageOutlined,
    SyncOutlined,
    GoldOutlined,
    StarFilled,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import MyModal from "../../my-modal";
import { formatArrayToTimeMap, getWeek } from "../../todo/utils";
import { TodoItemType } from "../../todo/types";
import Category from "../../todo/category";
import DescriptionModal from "../../todo/description-modal";

interface IProps {
    list: any[];
    getData: Function;
    title: string;
}

const Todo = (props: IProps) => {
    const { list, getData, title } = props;

    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});
    const [total, setTotal] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (list) {
            setTodoMap(formatArrayToTimeMap(list));
            setTotal(list.length);
        }
    }, [list]);

    const today = dayjs().format("YYYY-MM-DD");

    const handleAdd = () => {
        router.push("/todo-add");
    };

    const [activeTodo, setActiveTodo] = useState<TodoItemType>();

    const getTodoById = async (todo_id: string) => {
        const res = await GetTodoById(todo_id);
        setActiveTodo(res.data);
        getData();
    };

    const [showDesc, setShowDesc] = useState<boolean>(false);

    // 把过期任务的日期调整成今天
    const [showChangeExpire, setShowChangeExpire] = useState<boolean>(false);
    const [changeExpireList, setChangeExpireList] = useState<TodoItemType[]>();
    const handleChangeExpire = (todoList: TodoItemType[]) => {
        setChangeExpireList(todoList);
        setShowChangeExpire(true);
    };
    const changeExpireToToday = async () => {
        const promiseList = changeExpireList.map((item) => {
            return EditTodoItem({
                ...item,
                time: dayjs().format("YYYY-MM-DD"),
            });
        });
        const res = await Promise.all(promiseList);
        if (res) {
            message.success(`Todo 日期调整成功`);
            getData();
            setShowChangeExpire(false);
        }
    };

    // 渲染单条 todo
    const getTodoItem = (item: TodoItemType) => {
        const Component = (props) =>
            item.status !== String(TodoStatus.done) ? <span>{props.children}</span> : <s>{props.children}</s>;

        return (
            <Component>
                {item.doing === "1" && <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} />}
                <Category
                    color={item.color}
                    category={item.category}
                    style={{
                        verticalAlign: "-1px",
                    }}
                />
                <span
                    onClick={(e) => {
                        setActiveTodo(item);
                        setShowDesc(true);
                        e.stopPropagation();
                    }}
                >
                    <span>{item.name}</span>
                    {item.description && <QuestionCircleOutlined className={styles.icon} />}
                    {item.imgList.length !== 0 && <FileImageOutlined className={styles.icon} />}
                </span>
            </Component>
        );
    };

    const [showAllProgress, setShowAllProgress] = useState<boolean>(false);

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const getShowList = (list: TodoItemType[]) => {
        return !isSortTime
            ? list
            : [...list].sort(
                  // sort 会改变原数组
                  (a, b) => (b?.mTime ? new Date(b.mTime).getTime() : 0) - (a?.mTime ? new Date(a.mTime).getTime() : 0)
              );
    };

    return (
        <>
            <h2 className={styles.h2}>
                <span>
                    {title}({total})
                </span>
                <Space size={8}>
                    {/* 排序方式 */}
                    <Button
                        style={{ width: 50 }}
                        icon={<CalendarOutlined />}
                        onClick={() => setIsSortTime((prev) => !prev)}
                        type={isSortTime ? "primary" : "default"}
                    />
                    {/* 刷新列表 */}
                    <Button style={{ width: 50 }} icon={<SyncOutlined />} onClick={() => getData()} type="default" />
                    {/* 新增待办 */}
                    <Button style={{ width: 50 }} icon={<PlusOutlined />} onClick={() => handleAdd()} type="primary" />
                </Space>
            </h2>
            <div className={styles.list}>
                {Object.keys(todoMap)
                    .sort()
                    .reverse()
                    .map((time) => (
                        <div key={time}>
                            {/* 日期 */}
                            <div
                                className={`${styles.time} ${
                                    time === today ? styles.today : time < today ? styles.previously : styles.future
                                }`}
                            >
                                <span>
                                    {time} ({getWeek(time)})
                                    {todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
                                </span>
                                {time < today && (
                                    <Button
                                        size="small"
                                        title="调整日期"
                                        icon={<VerticalAlignTopOutlined />}
                                        onClick={() => handleChangeExpire(todoMap[time])}
                                        type="primary"
                                    />
                                )}
                            </div>
                            {/* 当日 todo */}
                            <div className={styles.one_day}>
                                {(() => {
                                    const list: TodoItemType[] = todoMap[time];
                                    const map = list.reduce((prev, cur) => {
                                        prev[cur.todo_id] = true;
                                        return prev;
                                    }, {});

                                    return getShowList(todoMap[time])
                                        .filter((item) => !(item?.other_id && map[item?.other_id]))
                                        .map((item: TodoItemType) => {
                                            const childListNow =
                                                item?.child_todo_list?.filter((item) => map[item.todo_id]) || [];

                                            return childListNow.length !== 0 ? (
                                                <Collapse key={item.todo_id} defaultActiveKey={[item.todo_id]}>
                                                    <Collapse.Panel
                                                        key={item.todo_id}
                                                        header={
                                                            <span>
                                                                {getTodoItem(item)}
                                                                <Button
                                                                    type="primary"
                                                                    style={{ marginLeft: 10 }}
                                                                    icon={<GoldOutlined />}
                                                                    onClick={(e) => {
                                                                        setActiveTodo(item);
                                                                        setShowAllProgress(true);
                                                                        e.stopPropagation();
                                                                    }}
                                                                />
                                                            </span>
                                                        }
                                                    >
                                                        {childListNow.map((child) => (
                                                            <div key={child.todo_id}>{getTodoItem(child)}</div>
                                                        ))}
                                                    </Collapse.Panel>
                                                </Collapse>
                                            ) : (
                                                <div key={item.todo_id}>{getTodoItem(item)}</div>
                                            );
                                        });
                                })()}
                            </div>
                        </div>
                    ))}
            </div>
            {/* 详情弹窗 */}
            <DescriptionModal
                isTodo={true}
                visible={showDesc}
                setVisible={setShowDesc}
                activeTodo={activeTodo}
                refresh={() => getTodoById(activeTodo.todo_id)}
            />
            {/* 批量调整过期 todo 日期的弹窗 */}
            <MyModal
                visible={showChangeExpire}
                title={"调整日期"}
                onOk={() => changeExpireToToday()}
                onCancel={() => {
                    setShowChangeExpire(false);
                }}
            >
                是否将 {changeExpireList?.[0].time} 的 Todo 日期调整成今天
            </MyModal>
            {/* 查看总进度 */}
            <MyModal
                visible={showAllProgress}
                title={"总进度"}
                showFooter={false}
                onCancel={() => setShowAllProgress(false)}
            >
                {activeTodo && (
                    <Collapse key={activeTodo.todo_id} defaultActiveKey={[activeTodo.todo_id]}>
                        <Collapse.Panel key={activeTodo.todo_id} header={getTodoItem(activeTodo)}>
                            {activeTodo.child_todo_list?.map((child) => (
                                <div key={child.todo_id}>{getTodoItem(child)}</div>
                            ))}
                        </Collapse.Panel>
                    </Collapse>
                )}
            </MyModal>
        </>
    );
};

export default Todo;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
