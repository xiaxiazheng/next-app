import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { staticUrl } from "../../service";
import MyModal from "../my-modal";
import { Button, message, Space } from "antd";

export interface FileType {
    cTime: string;
    filename: string;
    originalname: string;
    file_id: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
    fileUrl?: string;
}

export const handleSize = (size: number) => {
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
};

interface Props {
    filesList: FileType[];
}

const PreviewFiles: React.FC<Props> = (props) => {
    const { filesList } = props;

    const [list, setList] = useState<FileType[]>([]);

    useEffect(() => {
        if (filesList) {
            handleFileData(filesList);
        }
    }, [filesList]);

    const handleFileData = (filesList: FileType[]) => {
        const fileList: FileType[] = filesList.map((file) => {
            // 文件地址
            const fileUrl = `${staticUrl}/file/${file.type}/${file.filename}`;

            return {
                ...file,
                fileUrl,
            };
        });
        setList(fileList);
    };

    // 下载文件
    const handleDownload = async (fileUrl: string) => {
        const a: any = document.createElement("a");
        a.style.display = "none";
        a.download = true;
        a.href = fileUrl;

        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const [active, setActive] = useState<FileType>();
    const [isShow, setIsShow] = useState<boolean>(false);

    // 复制文件的 url
    const copyFileUrl = (fileUrl: string) => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", fileUrl);
        input.select();
        document.execCommand("copy");
        message.success("复制文件路径成功", 1);
        document.body.removeChild(input);
    };

    return (
        <>
            {list.map((file) => (
                <div
                    key={file.file_id}
                    className={styles.fileBox}
                    onClick={() => {
                        setActive(file);
                        setIsShow(true);
                    }}
                >
                    <div className={styles.name}>{file.originalname}</div>
                </div>
            ))}
            <MyModal visible={isShow} onCancel={() => setIsShow(false)} showFooter={false}>
                <Space size={10} direction="vertical">
                    <div className={styles.name}>{active?.originalname}</div>
                    <div className={styles.size}>大小：{handleSize(Number(active?.size || 0))}</div>
                    <div className={styles.time}>创建时间：{active?.cTime}</div>
                    <Space size={8}>
                        <Button onClick={() => handleDownload(active?.fileUrl)}>下载文件</Button>
                        <Button onClick={() => copyFileUrl(active?.fileUrl)}>复制文件路径</Button>
                    </Space>
                </Space>
            </MyModal>
        </>
    );
};

export default PreviewFiles;
