import React from "react";
import PreviewImages from "../../preview-images";
import UploadImage from "../../upload-image";
import MyModal from "../../my-modal";
import { TodoType } from "../types";
import styles from "./index.module.scss";
import { handleDesc } from "../utils";

interface IProps {
    activeTodo: TodoType;
    visible: boolean;
    setVisible: Function;
    refresh: Function;
}

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const DescriptionModal: React.FC<IProps> = (props) => {
    const { activeTodo, visible, setVisible, refresh } = props;

    return (
        <MyModal
            title={<span className={styles.modalName}>{activeTodo?.name}</span>}
            visible={visible}
            onCancel={() => setVisible(false)}
            showFooter={false}
        >
            {activeTodo?.description && handleDesc(activeTodo.description)}
            {activeTodo?.imgList && (
                <div style={{ marginTop: 10 }}>
                    <UploadImage type="todo" otherId={activeTodo.todo_id} refreshImgList={refresh} />
                    <PreviewImages imagesList={activeTodo.imgList} />
                </div>
            )}
        </MyModal>
    );
};

export default DescriptionModal;
