import { useRouter } from "next/router";
import styles from "./index.module.scss";
import TodoForm from "../todo-form";
import { useEffect, useState } from "react";
import { AddTodoItem, EditTodoItem, getTodoById, TodoStatus, TodoItemType } from "@xiaxiazheng/blog-libs";
import { DrawerProps, Form, message, Spin } from "antd";
import DrawerWrapper from "../../common/drawer-wrapper";
import { operatorMap, OperatorType } from "../types";
import dayjs from "dayjs";

interface IProps extends DrawerProps {
    todo_id?: string;
    operatorType: OperatorType;
    onSubmit?: (val: any) => void;
}

const TodoFormDrawer: React.FC<IProps> = (props) => {
    const { todo_id, open, operatorType, onSubmit, onClose } = props;

    const [data, setData] = useState<TodoItemType>();
    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodoById(todo_id);
        setData(res.data);
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            todo_id && getData();
        } else {
            form.resetFields();
        }
    }, [open]);

    const handleSave = async () => {
        await form.validateFields();

        let val = form.getFieldsValue();
        if (data) {
            // 编辑
            val = {
                ...data,
                ...val
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
                ...val,
            };
        }

        setLoading(true);
        const res =
            data && operatorType === "edit"
                ? await EditTodoItem({
                      ...val,
                      todo_id: data.todo_id,
                  })
                : await AddTodoItem(val);
        if (res) {
            message.success(`${operatorMap[operatorType]} Todo 成功`);
            onSubmit?.(operatorType === "edit" ? val : res.data.newTodoItem);
            setIsEdit(false);
        } else {
            message.error(`${operatorMap[operatorType]} Todo 失败，请重试`);
        }
        setLoading(false);
    };
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isClose, setIsClose] = useState<boolean>(false);

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
            destroyOnClose
            {...props}
            onClose={(e) => {
                if (isEdit && !isClose) {
                    message.warning("还有编辑内容没保存，确定不要就再点一次");
                    setIsClose(true);
                } else {
                    setIsEdit(false);
                    setIsClose(false);
                    onClose(e);
                }
            }}
        >
            <Spin spinning={loading}>
                <TodoForm
                    form={form}
                    status={TodoStatus.todo}
                    todo={data}
                    operatorType={operatorType}
                    onFieldsChange={() => {
                        setIsEdit(true);
                        setIsClose(false);
                    }}
                />
            </Spin>
        </DrawerWrapper>
    );
};

export default TodoFormDrawer;
