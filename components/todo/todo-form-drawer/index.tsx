import { useRouter } from "next/router";
import styles from "./index.module.scss";
import EditTodo from "../todo-form";
import { useEffect, useState } from "react";
import { AddTodoItem, EditTodoItem, GetTodoById, TodoStatus } from "../../../service";
import { Button, DrawerProps, Form, message, Spin } from "antd";
import DrawerWrapper from "../../drawer-wrapper";
import { OperatorType, TodoItemType } from "../types";

interface IProps extends DrawerProps {
    todo_id: string;
    operatorType: OperatorType;
    onFinish?: () => void;
}

const TodoFormDrawer: React.FC<IProps> = (props) => {
    const { todo_id, visible, operatorType, onFinish: handleFinish } = props;

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

    const onFinish = async (val) => {
        setLoading(true);
        const res =
            data && !isCopy
                ? await EditTodoItem({
                      ...val,
                      todo_id: data.todo_id,
                  })
                : await AddTodoItem(val);
        if (res) {
            message.success(`${data ? "编辑" : isCopy ? "复制" : "新建"} Todo 成功`);
        }
        setLoading(false);
        handleFinish?.();
    };
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    return (
        <DrawerWrapper
            className={styles.TodoFormDrawer}
            title={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{operatorType === "copy" ? "复制" : "编辑"} todo</span>
                    <span
                        style={isEdit ? { color: "#f5222d" } : { color: "#40a9ff" }}
                        onClick={() => onFinish(form.getFieldsValue())}
                    >
                        done
                    </span>
                </div>
            }
            {...props}
        >
            <Spin spinning={loading}>
                <EditTodo
                    form={form}
                    status={TodoStatus.todo}
                    todo={data}
                    isCopy={isCopy}
                    onFieldsChange={() => {
                        setIsEdit(true);
                    }}
                />
            </Spin>
        </DrawerWrapper>
    );
};

export default TodoFormDrawer;
