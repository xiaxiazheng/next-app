import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { EditTodoItem } from "../../../service";
import { Button, message, Space } from "antd";
import { VerticalAlignTopOutlined, SyncOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import MyModal from "../../common/my-modal";
import { formatArrayToTimeMap, getWeek } from "../../todo/utils";
import { TodoItemType } from "../../todo/types";
import TodoItemList from "../todo-item-list";

interface IProps {
    list: any[];
    getData: Function;
    title: string;
    isReverse?: boolean;
    btn?: any;
}

const TodoDayList = (props: IProps) => {
    const { list, getData, title, isReverse = false, btn } = props;

    const [todoMap, setTodoMap] = useState<{ [k in string]: TodoItemType[] }>({});
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (list) {
            setTodoMap(formatArrayToTimeMap(list));
            setTotal(list.length);
        }
    }, [list]);

    const today = dayjs().format("YYYY-MM-DD");

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

    const [isSortTime, setIsSortTime] = useState<boolean>(false);
    const getShowList = (list: TodoItemType[]) => {
        return !isSortTime
            ? list.sort((a, b) => (a.doing === "1" ? -1 : 0))
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
                    {btn}
                </Space>
            </h2>
            <div className={styles.list}>
                {(isReverse ? Object.keys(todoMap).sort() : Object.keys(todoMap).sort().reverse()).map((time) => (
                    <div key={time}>
                        {/* 日期 */}
                        <div
                            className={`${styles.time} ${
                                time === today ? styles.today : time < today ? styles.previously : styles.future
                            }`}
                        >
                            <span>
                                {time} ({getWeek(time)}){todoMap[time]?.length > 5 ? ` ${todoMap[time]?.length}` : null}
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
                            <TodoItemList list={getShowList(todoMap[time])} onRefresh={getData} />
                        </div>
                    </div>
                ))}
            </div>
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
        </>
    );
};

export default TodoDayList;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
