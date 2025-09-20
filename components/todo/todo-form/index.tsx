import { useState, useEffect, useRef } from "react";
import { Form, Radio, FormInstance, FormProps, Space, Button } from "antd";
import styles from "./index.module.scss";
import dayjs from "dayjs";
import { getTodoCategory, TodoStatus } from "../../../service";
import { colorTitle } from "../constant";
import { OperatorType } from "../types";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import InputList, { splitStr } from "./input-list";
import NameTextArea from "./name-textarea";
import SwitchComp from "./switch";
import SelectBeforeTodo from "./select-before-todo";
import {
    UpCircleOutlined,
    DownCircleOutlined,
} from "@ant-design/icons";
import TimePicker from "./time-picker";
import useSettings from "../../../hooks/useSettings";
import TodoIcon from "../todo-icon";

const minCategory = 6;

const CategoryOptions = ({ value, onChange, category }: any) => {
    const [showAll, setShowAll] = useState<boolean>(false);

    const settings = useSettings();

    useEffect(() => {
        if (
            category.length !== 0 &&
            !category
                ?.slice(0, minCategory)
                .map((item) => item.category)
                .includes(value)
        ) {
            setShowAll(true);
        } else {
            setShowAll(false);
        }
    }, [value, category]);

    return (
        <>
            <Radio.Group buttonStyle="solid" value={value} onChange={onChange}>
                {(showAll ? category : category?.slice(0, settings?.todoCategoryDefaultShow || minCategory))?.map(
                    (item) => (
                        <Radio.Button key={item.category} value={item.category}>
                            {item.category} ({item.count})
                        </Radio.Button>
                    )
                )}
                {!showAll && (
                    <span className={styles.showAll}>
                        <Button type="text" onClick={() => setShowAll((prev) => !prev)}>
                            show all Category{showAll ? <UpCircleOutlined /> : <DownCircleOutlined />}
                        </Button>
                    </span>
                )}
            </Radio.Group>
        </>
    );
};

interface Props extends FormProps {
    status: TodoStatus;
    todo?: TodoItemType;
    form?: FormInstance;
    operatorType: OperatorType;
}

const TodoForm: React.FC<Props> = (props) => {
    const { status, todo, operatorType, form, onFieldsChange, ...rest } = props;

    const settings = useSettings();

    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res: any = await getTodoCategory();
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
                    status: TodoStatus.todo,
                    time: dayjs().format("YYYY-MM-DD"),
                    other_id: todo.todo_id,
                    doing: '0',
                    isFollowUp: '0',
                    isTarget: '0',
                    isNote: '0',
                    isBookMark: '0',
                    isDoing: '0',
                    color: String(settings?.todoDefaultColor) || '4',
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

    // 处理预设选项集
    const handlePreset = (item: Record<string, string>) => {
        form.setFieldsValue(item);
        // @ts-ignore
        onFieldsChange?.();
    }

    return (
        <main className={styles.edit_todo}>
            <Form form={form} layout={"vertical"} onFieldsChange={onFieldsChange} {...rest}>
                <Form.Item name="name" label="名称" style={{ width: "100%" }} rules={[{ required: true }]}>
                    <NameTextArea handleDelete={() => form.setFieldValue("name", "")} />
                </Form.Item>
                <Form.Item name="description" label="详细描述">
                    <InputList handleParse={(text: string) => {
                        const oldText = form.getFieldValue("description");
                        if (!!oldText) {
                            form.setFieldValue("description", text + splitStr + oldText);
                        } else {
                            form.setFieldValue("description", text);
                        }
                    }} />
                </Form.Item>
                <Form.Item label="预设选项">
                    <Space>
                        {settings?.todoPreset?.map((item, index) => {
                            return <Button style={{ borderColor: settings?.todoColorMap?.[item.color] }} key={index} onClick={() => handlePreset(item)}>
                                <span style={{ color: settings?.todoColorMap?.[item.color] }}>{`${item?.category}`}</span>
                                {item?.isWork && <TodoIcon
                                    iconType={item?.isWork === "1" ? "work" : "life"}
                                    style={{ color: "#00d4d8" }}
                                />}
                                {item?.isNote === "1" && <TodoIcon
                                    iconType="note"
                                    style={{
                                        color: "#ffeb3b"
                                    }}
                                />}
                            </Button>
                        })}
                    </Space>
                </Form.Item>
                <Form.Item
                    name="color"
                    label={colorTitle}
                    rules={[{ required: true }]}
                    initialValue={String(settings?.todoDefaultColor || "4")}
                >
                    <Radio.Group buttonStyle="solid">
                        {Object.keys(settings?.todoColorMap || {}).map((item) => (
                            <Radio.Button
                                key={item}
                                value={item}
                                style={{ color: settings?.todoColorMap?.[item] }}
                                className={`${styles.color} ${item === "0" ? styles.zero : ""}${item === "1" ? styles.one : ""
                                    }${item === "2" ? styles.two : ""}${item === "3" ? styles.three : ""}${item === "4" ? styles.four : ""
                                    }${item === "-1" ? styles.minusOne : ""}`}
                            >
                                {settings?.todoColorNameMap?.[item]}
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
                    <TimePicker time={todo?.time} />
                </Form.Item>
                <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={status}>
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value={0}>待办</Radio.Button>
                        <Radio.Button value={1}>已完成</Radio.Button>
                        <Radio.Button value={2}>待办池</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"个人"}>
                    <CategoryOptions category={category} />
                </Form.Item>
                <Form.Item label="特殊状态" style={{ marginBottom: 0 }}>
                    <Space size={6} style={{ flexWrap: "wrap" }}>
                        <Form.Item
                            name="isWork"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span style={{ color: "#00d4d8" }}>
                                    <TodoIcon iconType="work" /> 工作
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item
                            name="doing"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span>
                                    <TodoIcon iconType="urgent" style={{ color: "red" }} /> {settings?.todoNameMap?.urgent}
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item
                            name="isTarget"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span>
                                    <TodoIcon iconType="target" style={{ color: "#ffeb3b" }} /> {settings?.todoNameMap?.target}
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item
                            name="isBookMark"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span>
                                    <TodoIcon iconType="bookMark" style={{ color: "#ffeb3b" }} /> {settings?.todoNameMap?.bookMark}
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item
                            name="isNote"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span>
                                    <TodoIcon iconType="note" style={{ color: "#ffeb3b" }} /> {settings?.todoNameMap?.note}
                                </span>
                            </SwitchComp>
                        </Form.Item>
                        <Form.Item
                            name="isFollowUp"
                            rules={[{ required: true }]}
                            initialValue={"0"}
                            style={{ marginBottom: 3 }}
                        >
                            <SwitchComp>
                                <span>
                                    <TodoIcon
                                        iconType="followUp"
                                        style={{
                                            marginRight: 5,
                                            color: "#ffeb3b",
                                        }}
                                    />{" "}
                                    {settings?.todoNameMap?.followUp}
                                </span>
                            </SwitchComp>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item name="other_id" label="前置 todo">
                    <SelectBeforeTodo activeTodo={todo} />
                </Form.Item>
            </Form>
        </main>
    );
};

export default TodoForm;
