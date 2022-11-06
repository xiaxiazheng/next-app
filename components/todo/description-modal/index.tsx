import React, { useState } from "react";
import PreviewImages from "../../preview-images";
import UploadImageFile from "../../upload-image-file";
import MyModal from "../../my-modal";
import { TodoItemType } from "../types";
import styles from "./index.module.scss";
import { handleDesc } from "../utils";
import { Button, message, Space } from "antd";
import { DoneTodoItem } from "../../../service";
import { useRouter } from "next/router";

interface IProps {
    isTodo?: boolean;
    activeTodo: TodoItemType;
    visible: boolean;
    setVisible: Function;
    refresh: Function;
}

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const DescriptionModal: React.FC<IProps> = (props) => {
    const { isTodo = false, activeTodo, visible, setVisible, refresh } = props;

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const handleDone = async () => {
        setLoading(true);
        const params = {
            todo_id: activeTodo.todo_id,
        };

        const res = await DoneTodoItem(params);
        if (res) {
            message.success(res.message);
            setVisible(false);
            refresh();
        }
        setLoading(false);
    };

    return (
        <MyModal
            title={<span className={styles.modalName}>{activeTodo?.name}</span>}
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={() => (
                <Space className={styles.operator} size={10}>
                    <Button type="primary" onClick={() => router.push(`/todo-copy/${activeTodo?.todo_id}`)}>
                        复制
                    </Button>
                    <Button type="primary" onClick={() => router.push(`/todo-edit/${activeTodo?.todo_id}`)}>
                        编辑
                    </Button>
                    {isTodo && (
                        <Button type="primary" onClick={() => handleDone()} danger loading={loading}>
                            完成Todo
                        </Button>
                    )}
                </Space>
            )}
        >
            <div style={{ fontSize: 14 }}>{activeTodo?.description && handleDesc(activeTodo.description)}</div>
            {activeTodo?.imgList && (
                <div style={{ marginTop: 10 }}>
                    <UploadImageFile type="todo" otherId={activeTodo.todo_id} refreshImgList={refresh} />
                    <PreviewImages imagesList={activeTodo.imgList} />
                </div>
            )}
        </MyModal>
    );
};

export default DescriptionModal;
