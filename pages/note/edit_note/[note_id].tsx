import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Form, message, Input, Button, Radio } from "antd";
import styles from "./index.module.scss";
import { EditNote, GetNoteById, GetNoteCategory } from "../../../service";
import AffixBack from "../../../components/affix/affix-back";

const { TextArea } = Input;

const EditNoteComp = () => {
    const router = useRouter();

    const { note_id } = router.query;

    const [title, setTitle] = useState<string>("");
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isMe = username === "zyb" ? true : false;
        const title = isMe ? "编辑便签" : "编辑法条";
        setTitle(title);
    }, []);

    const [form] = Form.useForm();

    const [category, setCategory] = useState<any[]>([]);
    const getCategory = async () => {
        const res: any = await GetNoteCategory();
        const resData = await res.json();
        setCategory(resData.data);
    };
    useEffect(() => {
        getCategory();

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const getData = async () => {
        const res = await GetNoteById(note_id);
        if (res) {
            form.setFieldsValue({
                note: res.data.note,
                category: res.data.category
            });
        }
    };
    useEffect(() => {
        note_id && getData();
    }, [note_id]);

    const onFinish = async (val) => {
        const res = await EditNote({
            ...val,
            note_id,
        });
        if (res) {
            message.success(`${title}成功`);
            router.push("/note");
        }
    };

    const handleSaveProgress = async () => {
        const formData = form.getFieldsValue();
        const res = await EditNote({
            ...formData,
            note_id,
        });
        if (res) {
            message.success(`保存进度成功`);
        }
    };

    /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
    const [isKeyDown, setIsKeyDown] = useState(false);
    useEffect(() => {
        if (isKeyDown) {
            handleSaveProgress();
            setIsKeyDown(false);
        }
    }, [isKeyDown]);

    // 键盘事件
    const onKeyDown = (e: any) => {
        // 加上了 mac 的 command 按键的 metaKey 的兼容
        if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            setIsKeyDown(true);
        }
    };

    return (
        <main className={styles.edit_note}>
            <h2 className={styles.h2}>
                <span>{title}</span>
                <Button type="primary" onClick={() => handleSaveProgress()}>
                    保存进度
                </Button>
            </h2>
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
                <Form.Item name="note" label="内容" rules={[{ required: true }]}>
                    <TextArea className={styles.textarea} placeholder="请输入内容" autoFocus={true} />
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"其他"}>
                    <Radio.Group>
                        {category?.map((item) => (
                            <Radio key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                                {item.category}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <AffixBack />
        </main>
    );
};

export default EditNoteComp;
