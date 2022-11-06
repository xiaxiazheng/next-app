import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Form, message, Input, Button, Radio } from "antd";
import styles from "./index.module.scss";
import { EditNote, GetNoteById, GetNoteCategory } from "../../../service";
import AffixBack from "../../../components/affix/affix-back";
import AffixSubmit from "../../../components/affix/affix-submit";
import AffixSaveProgress from "../../../components/affix/affix-save-progress";
import PreviewImages from "../../../components/preview-images";
import UploadImageFile from "../../../components/upload-image-file";
import AffixFooter from "../../../components/affix/affix-footer";
import PreviewFiles, { FileType } from "../../../components/preview-files";
import { ImageType } from "../../../service/image";

const { TextArea } = Input;

const EditNoteComp = () => {
    const router = useRouter();

    const { note_id } = router.query as { note_id: string };

    // 图片列表
    const [imageList, setImageList] = useState<ImageType[]>([]);
    // 文件列表
    const [fileList, setFileList] = useState<FileType[]>([]);

    const [title, setTitle] = useState<string>("");
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isPP = username === "hyp" ? true : false;
        const title = !isPP ? "编辑便签" : "编辑法条";
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

    const getNoteData = async () => {
        const res = await GetNoteById(note_id);
        if (res) {
            form.setFieldsValue({
                note: res.data.note,
                category: res.data.category,
            });
            setImageList(res.data.imgList);
            setFileList(res.data.fileList);
        }
    };
    useEffect(() => {
        note_id && getNoteData();
    }, [note_id]);

    // 获取 note 的 image 和 file
    const getNoteImageFileData = async () => {
        const res = await GetNoteById(note_id);
        if (res) {
            setImageList(res.data.imgList);
            setFileList(res.data.fileList);
        }
    };

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

    const [isEdit, setIsEdit] = useState<boolean>(false);

    return (
        <main className={styles.edit_note}>
            <h2 className={styles.h2}>
                <span>{title}</span>
            </h2>
            <Form
                form={form}
                labelCol={{ span: 8 }}
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
                            <Radio key={item.category} value={item.category} style={{ marginBottom: 10 }}>
                                {item.category} ({item.count})
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <UploadImageFile type="note" otherId={note_id} refreshImgList={() => getNoteImageFileData()} />
                <PreviewImages imagesList={imageList} />
                <PreviewFiles filesList={fileList} />
                <AffixFooter style={{ marginTop: 20 }}>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <AffixSubmit danger={isEdit} />
                    </Form.Item>
                    <AffixBack backUrl={"/note"} />
                    <AffixSaveProgress
                        danger={isEdit}
                        onClick={() => {
                            handleSaveProgress();
                            setIsEdit(false);
                        }}
                    />
                </AffixFooter>
            </Form>
        </main>
    );
};

export default EditNoteComp;
