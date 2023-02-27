import { useRouter } from "next/router";
import styles from "./index.module.scss";
import TodoForm from "../todo-form";
import { useEffect, useState } from "react";
import { AddTodoItem, EditTodoItem, GetTodoById, TodoStatus } from "../../../service";
import { DrawerProps, Form, message, Spin } from "antd";
import DrawerWrapper from "../../drawer-wrapper";
import { operatorMap, OperatorType, TodoItemType } from "../types";
import TodoFormPunchTheClock from "../todo-form-punch-the-clock";
import dayjs from "dayjs";

interface IProps extends DrawerProps {
    todo_id?: string;
    operatorType: OperatorType;
    onSubmit?: (val: any) => void;
    isPunchTheClock?: boolean; // 是否是打卡任务
}

const TodoFormDrawer: React.FC<IProps> = (props) => {
    const { todo_id, visible, operatorType, onSubmit, isPunchTheClock } = props;

    const [data, setData] = useState<TodoItemType>();
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await GetTodoById(todo_id);
        setData(res.data);
        setLoading(false);
    };

    useEffect(() => {
        todo_id && visible && getData();
    }, [visible]);

    const isCopy = operatorType === "copy";

    const handleSave = async () => {
        await form.validateFields();

        let val = form.getFieldsValue();
        // 如果是打卡任务
        if (isPunchTheClock) {
            const { startTime, range, ...rest } = val;
            const timeRange = JSON.stringify([
                startTime,
                range
            ]);
            if (data) {
                // 编辑
                val = {
                    ...data,
                    ...rest,
                    timeRange,
                };
            } else {
                // 新增
                val = {
                    doing: "0",
                    isBookMark: "0",
                    isNote: "0",
                    isTarget: "1",
                    other_id: "",
                    status: 0,
                    time: dayjs().format("YYYY-MM-DD"),
                    ...rest,
                    timeRange,
                };
            }
        }

        setLoading(true);
        const res =
            data && !isCopy
                ? await EditTodoItem({
                      ...val,
                      todo_id: data.todo_id,
                  })
                : await AddTodoItem(val);
        if (res) {
            message.success(`${operatorMap[operatorType]} Todo 成功`);
        }
        setLoading(false);
        onSubmit?.(val);
    };
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    return (
        <DrawerWrapper
            className={styles.TodoFormDrawer}
            title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{operatorMap[operatorType]} todo</span>
                    <span style={isEdit ? { color: "#f5222d" } : { color: "#40a9ff" }} onClick={() => handleSave()}>
                        save
                    </span>
                </div>
            }
            {...props}
        >
            <Spin spinning={loading}>
                {isPunchTheClock ? (
                    <TodoFormPunchTheClock
                        form={form}
                        todo={data}
                        onFieldsChange={() => {
                            setIsEdit(true);
                        }}
                    />
                ) : (
                    <TodoForm
                        form={form}
                        status={TodoStatus.todo}
                        todo={data}
                        operatorType={operatorType}
                        onFieldsChange={() => {
                            setIsEdit(true);
                        }}
                    />
                )}
            </Spin>
        </DrawerWrapper>
    );
};

export default TodoFormDrawer;
