import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetMediaList } from "../../service";
import { useEffect, useState } from "react";
import PreviewImages from "../../components/preview-images";
import PreviewFiles, { FileType } from "../../components/preview-files";
import UploadImageFile from "../../components/upload-image-file";
import { getFolder } from "../../service/folder";
import { FolderType } from "../../components/cloud/type";
import { FolderOutlined } from "@ant-design/icons";
import { FType, getFileListByOtherId } from "../../service/file";
import { getImageListByOtherId, ImageType } from "../../service/image";
import AffixBack from "../../components/affix/affix-back";
import AffixFooter from "../../components/affix/affix-footer";

const MusicPlayer = () => {
    const [parent_id, setParentId] = useState<string>("root");

    useEffect(() => {
        getFolderList(parent_id);
        getImageList(parent_id);
        getFileList(parent_id);
    }, [parent_id]);

    // 文件夹列表
    const [folderList, setFolderList] = useState<FolderType[]>([]);
    // 图片列表
    const [imageList, setImageList] = useState<ImageType[]>([]);
    // 文件列表
    const [fileList, setFileList] = useState<FileType[]>([]);

    // 获取文件夹列表
    const getFolderList = async (parent_id: string) => {
        const username = localStorage.getItem("username");
        const res = await getFolder(parent_id, username);
        if (res) {
            setFolderList(res.data);
        }
    };

    // 获取图片列表
    const getImageList = async (parent_id: string) => {
        const username = localStorage.getItem("username");
        const res = await getImageListByOtherId(parent_id, username);
        console.log(res);
        if (res) {
            let resList = [...(res as ImageType[])];
            // 如果 parent_id 为空串，会把 other_id 为空的所有图片返回回来，需要自己手动筛选掉 type 不为 cloud 的
            // if (parent_id === "") {
            //     resList = resList.filter((item) => item.type === "cloud");
            // }
            setImageList(resList);
        }
    };

    // 获取文件列表
    const getFileList = async (parent_id: string) => {
        const username = localStorage.getItem("username");
        const res = await getFileListByOtherId(parent_id, username);
        if (res) {
            // const list: FType[] = [];
            let resList = [...(res as FileType[])];
            // 如果 parent_id 为空串，会把 other_id 为空的所有图片返回回来，需要自己手动筛选掉 type 不为 cloud 的
            // if (parent_id === "") {
            //     resList = resList.filter((item) => item.type === "cloud");
            // }
            // console.log(list);
            setFileList(resList);
        }
    };

    return (
        <>
            <Header title="云盘" />
            <main>
                <div className={styles.cloud}>
                    {folderList &&
                        folderList.map((item) => (
                            <div
                                key={item.folder_id}
                                className={styles.folder}
                                onClick={() => setParentId(item.folder_id)}
                            >
                                <FolderOutlined className={styles.icon} />
                                {item.name}
                            </div>
                        ))}
                    <PreviewImages imagesList={imageList} />
                    <PreviewFiles filesList={fileList} />
                    <UploadImageFile
                        type="cloud"
                        otherId={parent_id}
                        refreshImgList={() => {
                            getImageList(parent_id);
                            getFileList(parent_id);
                        }}
                    />
                </div>
                {parent_id !== "root" && (
                    <AffixFooter type="fixed">
                        <AffixBack
                            onClick={() => {
                                setParentId("root");
                            }}
                        />
                    </AffixFooter>
                )}
            </main>
        </>
    );
};

export default MusicPlayer;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
