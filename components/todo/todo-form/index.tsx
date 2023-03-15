import { useState, useEffect, useRef } from "react";
import { Form, Input, Radio, FormInstance, FormProps, Space } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { GetTodoCategory, TodoStatus } from "../../../service";
import { colorMap, colorNameMap } from "../constant";
import { OperatorType, TodoItemType } from "../types";
import InputList from "./input-list";
import SwitchComp from "./switch";
import SearchTodo from "./searchTodo";
import {
    AimOutlined,
    BookOutlined,
    StarFilled,
} from "@ant-design/icons";

interface Props extends FormProps {
    status: TodoStatus;
    todo?: TodoItemType;
    form?: FormInstance;
    operatorType: OperatorType;
}

const TodoForm: React.FC<Props> = (props) => {
    const { status, todo, operatorType, form, ...rest } = props;

    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res: any = await GetTodoCategory();
        const resData = await res.json();
        setCategory(resData.data);
    };

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        if (todo) {
            if (operatorType === "progress") {
                form.setFieldsValue({
                    ...todo,
                    status: Number(todo.status),
                    other_id: todo.todo_id,
                });
            } else if (operatorType === "add-note") {
                form.setFieldsValue({
                    ...todo,
                    status: Number(todo.status),
                    isNote: "1",
                });
            } else {
                form.setFieldsValue({
                    ...todo,
                    status: Number(todo.status),
                });
            }
        }
    }, [todo, operatorType]);

    return (
        <main className={styles.edit_todo}>
            <Form form={form} layout={"vertical"} labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} {...rest}>
                <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                    <Input.TextArea
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        allowClear
                        placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
                    />
                </Form.Item>
                <Form.Item name="description" label="详细描述">
                    <InputList />
                </Form.Item>
                <Form.Item name="color" label="轻重" rules={[{ required: true }]} initialValue={"0"}>
                    <Radio.Group buttonStyle="solid">
                        {["0", "1", "2", "3", "-1"].map((item) => (
                            <Radio.Button key={item} value={item} style={{ color: colorMap[item] }}>
                                {colorNameMap[item]}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="time"
                    label="时间"
                    rules={[{ required: true }]}
                    initialValue={dayjs().format("YYYY-MM-DD")}
                >
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value={dayjs().format("YYYY-MM-DD")}>Today</Radio.Button>
                        <Radio.Button value={dayjs().add(1, "day").format("YYYY-MM-DD")}>Tomorrow</Radio.Button>
                        <Radio.Button value={dayjs().subtract(1, "day").format("YYYY-MM-DD")}>Yesterday</Radio.Button>
                        {todo && <Radio.Button value={todo.time}>{todo.time}</Radio.Button>}
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={status}>
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value={0}>待办</Radio.Button>
                        <Radio.Button value={1}>已完成</Radio.Button>
                        <Radio.Button value={2}>待办池</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"个人"}>
                    <Radio.Group buttonStyle="solid">
                        {category?.map((item) => (
                            <Radio.Button key={item.category} value={item.category}>
                                {item.category} ({item.count})
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="特殊状态" style={{ marginBottom: 0 }}>
                    <Space>
                        <Form.Item name="doing" rules={[{ required: true }]} initialValue={"0"}>
                            <SwitchComp>
                                <span style={{ color: "#ffeb3b" }}>现在处理</span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item name="isTarget" rules={[{ required: true }]} initialValue={"0"}>
                            <SwitchComp>
                                <span>
                                    <AimOutlined style={{ color: "#ffeb3b" }} /> 目标
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item name="isBookMark" rules={[{ required: true }]} initialValue={"0"}>
                            <SwitchComp>
                                <span>
                                    <StarFilled style={{ marginRight: 5, color: "#ffeb3b" }} /> 书签
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item name="isNote" rules={[{ required: true }]} initialValue={"0"}>
                            <SwitchComp>
                                <span>
                                    <BookOutlined style={{ marginRight: 5, color: "#ffeb3b" }} /> 存档
                                </span>
                            </SwitchComp>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item name="other_id" label="前置 todo">
                    <SearchTodo activeTodo={todo} />
                </Form.Item>
            </Form>
        </main>
    );
};

export default TodoForm;
