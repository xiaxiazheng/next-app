import { useRouter } from "next/router";
import styles from "./index.module.scss";
import TodoForm from "../todo-form";
import { useEffect, useState } from "react";
import { AddTodoItem, EditTodoItem, GetTodoById, TodoStatus } from "../../../service";
import { DrawerProps, Form, message, Spin } from "antd";
import DrawerWrapper from "../../drawer-wrapper";
import { operatorMap, OperatorType, TodoItemType } from "../types";

interface IProps extends DrawerProps {
    todo_id?: string;
    operatorType: OperatorType;
    onSubmit?: (val: any) => void;
}

const TodoFormDrawer: React.FC<IProps> = (props) => {
    const { todo_id, visible, operatorType, onSubmit } = props;

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

    const handleDone = async () => {
        await form.validateFields();

        const val = form.getFieldsValue();
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
                    <span
                        style={isEdit ? { color: "#f5222d" } : { color: "#40a9ff" }}
                        onClick={() => handleDone()}
                    >
                        done
                    </span>
                </div>
            }
            {...props}
        >
            <Spin spinning={loading}>
                <TodoForm
                    form={form}
                    status={TodoStatus.todo}
                    todo={data}
                    operatorType={operatorType}
                    onFieldsChange={() => {
                        setIsEdit(true);
                    }}
                />
            </Spin>
        </DrawerWrapper>
    );
};

export default TodoFormDrawer;
