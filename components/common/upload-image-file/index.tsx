import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Upload, message, Progress, UploadFile } from "antd";
import { staticUrl } from "../../../service";
import { PlusOutlined } from "@ant-design/icons";
import MyModal from "../my-modal";

interface Props {
    type: "main" | "cloud" | "treecont" | "blog" | "mao" | "note" | "todo";
    otherId: string;
    refreshImgList: Function;
    style?: any;
}

export const handleSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
};

const UploadImageFile: React.FC<Props> = (props) => {
    const { type, otherId, refreshImgList, style } = props;

    const [username, setUsername] = useState<string>();
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    const [uploadFileList, setUploadFileList] = useState<UploadFile<any>[]>([]);

    const handleChange = (info: any) => {
        setUploadFileList(info.fileList);
        if (info.fileList.every((item: UploadFile<any>) => item.status === "done" || item.status === "error")) {
            refreshImgList();
        }
        // 上传成功触发
        if (info.file.status === "done") {
            message.success("上传图片成功");
        }
        // 上传失败触发
        if (info.file.status === "error") {
            message.error("上传图片失败");
            refreshImgList();
        }
    };

    const beforeUpload = (info: any) => {
        return true; // 为 false 就不会上传
    };

    const getUploadingList = (list: UploadFile<any>[]) => {
        return list.filter((item) => item.status !== "done" && item.status !== "error");
    };

    return (
        <div className={styles.upload_wrapper} onClick={(e) => e.stopPropagation()} style={style}>
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
                multiple
            >
                <PlusOutlined className={styles.addIcon} />
                点击上传图片/文件
            </Upload>
            <MyModal visible={getUploadingList(uploadFileList).length !== 0} showFooter={false} title={"上传图片/文件"}>
                {getUploadingList(uploadFileList).map((item, index) => {
                    return (
                        <div className={styles.progress} key={index}>
                            <div className={styles.name}>{item.originFileObj.name}</div>
                            <div>{handleSize(item.size || 0)}</div>
                            <div>进度：{(item.percent || 0).toFixed(1)}%</div>
                            <Progress
                                className={styles.progressBar}
                                strokeColor={{
                                    from: "#108ee9",
                                    to: "#87d068",
                                }}
                                percent={Number((item.percent || 0).toFixed(1))}
                                status="active"
                            />
                        </div>
                    );
                })}
            </MyModal>
        </div>
    );
};

export default UploadImageFile;
