import { useState, useEffect } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { GetTodoCategory, AddTodoItem, EditTodoItem, TodoStatus } from "../../../service";
import { colorMap, colorNameMap } from "../constant";
import { TodoType } from "../types";
import AffixBack from "../../affix/affix-back";
import AffixSubmit from "../../affix/affix-submit";
import AffixFooter from "../../affix/affix-footer";
import { useRouter } from "next/router";

const { TextArea } = Input;

const getRouterPath = (todo: TodoType) => {
    console.log("todo", todo);

    if (String(todo.status) === "0") {
        return "/todo-list";
    } else if (String(todo.status) === "1") {
        return "/todo-list-done";
    }
    if (String(todo.status) === "2") {
        if (String(todo.color) === "-1") {
            return "/todo-list-pool-long";
        }
        if (String(todo.color) === "-2") {
            return "/todo-list-pool-short";
        }
        return "/todo-list-pool";
    }

    return "/";
};

interface Props {
    status: TodoStatus;
    todo?: TodoType; // 通过有没有传这个来判断是否编辑
    isCopy?: boolean;
}

const EditTodo: React.FC<Props> = (props) => {
    const { status, todo, isCopy = false } = props;

    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = async (val) => {
        const res =
            todo && !isCopy
                ? await EditTodoItem({
                      ...val,
                      todo_id: todo.todo_id,
                  })
                : await AddTodoItem(val);
        if (res) {
            message.success(`${todo ? "编辑" : isCopy ? "复制" : "新建"} Todo 成功`);
            router.push(getRouterPath(todo || val));
        }
    };

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
            form.setFieldsValue({
                ...todo,
                status: Number(todo.status),
            });
        }
    }, [todo]);

    return (
        <main className={styles.edit_todo}>
            <Form form={form} layout={"vertical"} labelCol={{ span: 4 }} wrapperCol={{ span: 4 }} onFinish={onFinish}>
                <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                    <Input placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成" autoFocus={true} />
                </Form.Item>
                <Form.Item name="description" label="详细描述">
                    <TextArea placeholder="补充以及具体描述" autoSize={{ minRows: 4, maxRows: 6 }} />
                </Form.Item>
                <Form.Item name="doing" label="星标" rules={[{ required: true }]} initialValue={"0"}>
                    <Radio.Group>
                        <Radio key={"1"} value={"1"}>
                            是
                        </Radio>
                        <Radio key={"1"} value={"1"}>
                            否
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="color" label="轻重" rules={[{ required: true }]} initialValue={"0"}>
                    <Radio.Group>
                        {["0", "1", "2", "3", "-1", "-2"].map((item) => (
                            <Radio key={item} value={item} style={{ color: colorMap[item] }}>
                                {colorNameMap[item]}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"个人"}>
                    <Radio.Group>
                        {category?.map((item) => (
                            <Radio key={item.category} value={item.category} style={{ marginBottom: 5 }}>
                                {item.category} ({item.count})
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="time"
                    label="时间"
                    rules={[{ required: true }]}
                    initialValue={dayjs().format("YYYY-MM-DD")}
                >
                    <Radio.Group>
                        <Radio value={dayjs().format("YYYY-MM-DD")}>Today</Radio>
                        <Radio value={dayjs().add(1, "day").format("YYYY-MM-DD")}>Tomorrow</Radio>
                        <Radio value={dayjs().subtract(1, "day").format("YYYY-MM-DD")}>Yesterday</Radio>
                        {todo && <Radio value={todo.time}>{todo.time}</Radio>}
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={status}>
                    <Radio.Group>
                        <Radio value={0}>待办</Radio>
                        <Radio value={1}>已完成</Radio>
                        <Radio value={2}>待办池</Radio>
                    </Radio.Group>
                </Form.Item>
                <AffixFooter>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <AffixSubmit />
                    </Form.Item>
                    <AffixBack backUrl={status === 2 ? "/todo-list-pool" : "/todo-list"} />
                </AffixFooter>
            </Form>
        </main>
    );
};

export default EditTodo;
