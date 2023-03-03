import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Form, message, Input, Button, Radio } from "antd";
import styles from "./index.module.scss";
import { AddNote, GetNoteCategory } from "../../service";
import AffixBack from "../../components/common/affix/affix-back";
import AffixSubmit from "../../components/common/affix/affix-submit";
import AffixSaveProgress from "../../components/common/affix/affix-save-progress";
import AffixFooter from "../../components/common/affix/affix-footer";

const { TextArea } = Input;

const AddNoteComp = () => {
    const [title, setTitle] = useState<string>("");
    useEffect(() => {
        // const username = localStorage.getItem("username");
        // const isPP = username === "hyp" ? true : false;
        const title = "新增 note";
        setTitle(title);
    }, []);

    const [form] = Form.useForm();
    const router = useRouter();

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

    const onFinish = async (val) => {
        const res = await AddNote(val);
        if (res) {
            message.success(`${title}成功`);
            router.push("/note");
        }
    };

    const handleSaveAndEdit = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue();
            const res = await AddNote(formData);
            if (res) {
                message.success(`${title}成功`);
                router.push(`/note/edit_note/${res.data.newNote.note_id}`);
            }
        } catch (err) {
            message.warning("请检查表单输入");
        }
    };

    /** 判断是否用 ctrl + s 保存修改，直接在 onKeyDown 运行 saveEditLog() 的话只会用初始值去发请求（addEventListener）绑的太死 */
    const [isKeyDown, setIsKeyDown] = useState(false);
    useEffect(() => {
        if (isKeyDown) {
            handleSaveAndEdit();
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

    const [isEdit, setIsEdit] = useState<boolean>(false);

    return (
        <main className={styles.add_note}>
            <h2 className={styles.h2}>
                <span>{title}</span>
            </h2>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFieldsChange={() => setIsEdit(true)}
                onFinish={onFinish}
            >
                <Form.Item name="note" label="内容" rules={[{ required: true }]}>
                    <TextArea className={styles.textarea} placeholder="请输入内容" autoFocus={true} />
                </Form.Item>
                <Form.Item name="category" label="类别" rules={[{ required: true }]} initialValue={"其他"}>
                    <Radio.Group>
                        {category?.map((item) => (
                            <Radio.Button key={item.category} value={item.category}>
                                {item.category} ({item.count})
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <AffixFooter>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <AffixSubmit danger={isEdit} />
                    </Form.Item>
                    <AffixBack backUrl={"/note"} />
                    <AffixSaveProgress
                        danger={isEdit}
                        onClick={() => {
                            handleSaveAndEdit();
                            setIsEdit(false);
                        }}
                    />
                </AffixFooter>
            </Form>
        </main>
    );
};

export default AddNoteComp;
