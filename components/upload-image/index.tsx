import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Upload, message, Progress } from "antd";
import { staticUrl } from "../../service";
import { PlusOutlined } from "@ant-design/icons";
import MyModal from "../my-modal";

interface Props {
    type: "main" | "cloud" | "treecont" | "blog" | "mao" | "note" | "todo";
    otherId: string;
    refreshImgList: Function;
}

export const handleSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
};

const UploadImage: React.FC<Props> = (props) => {
    const { type, otherId, refreshImgList } = props;

    const [username, setUsername] = useState<string>();
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    const [name, setName] = useState<string>();
    const [percent, setPercent] = useState<number>();
    const [size, setSize] = useState<number>();

    const handleChange = (info: any) => {
        // 上传中
        if (info.file.status === "uploading") {
            setPercent(info.file.percent);
        }
        // 上传成功触发
        if (info.file.status === "done") {
            message.success("上传图片成功");
            setName(undefined);
            refreshImgList();
        }
        if (info.file.status === "error") {
            message.error("上传图片失败");
        }
    };

    const beforeUpload = (info: any) => {
        setName(info.name);
        setPercent(0);
        setSize(info.size);

        return true; // 为 false 就不会上传
    };

    return (
        <div className={styles.upload_wrapper} onClick={(e) => e.stopPropagation()}>
            <Upload
                className={styles.upload}
                name={type}
                showUploadList={false}
                action={`${staticUrl}/api/${type}_upload`}
                data={{
                    other_id: otherId || "",
                    username,
                }}
                beforeUpload={beforeUpload}
                listType="picture-card"
                onChange={handleChange}
            >
                <PlusOutlined className={styles.addIcon} />
                点击上传图片
            </Upload>
            <MyModal visible={!!name} showFooter={false} title={"上传图片"}>
                <div className={styles.progress}>
                    <div className={styles.name}>{name}</div>
                    <div>{handleSize(size || 0)}</div>
                    <div>进度：{(percent || 0).toFixed(1)}%</div>
                    <Progress
                        strokeColor={{
                            from: "#108ee9",
                            to: "#87d068",
                        }}
                        percent={percent}
                        status="active"
                    />
                </div>
            </MyModal>
        </div>
    );
};

export default UploadImage;
