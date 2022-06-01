import Header from "../../components/header";
import styles from "./index.module.scss";
import { GetMediaList } from "../../service";
import { useEffect, useState } from "react";
import PreviewImages from "../../components/preview-images";
import PreviewFiles, { FileType } from "../../components/preview-files";
import UploadImageFile from "../../components/upload-image-file";
import { addFolder, getFolder } from "../../service/folder";
import { FolderType } from "../../components/cloud/type";
import { FolderOutlined } from "@ant-design/icons";
import { getFileListByOtherId } from "../../service/file";
import { getImageListByOtherId, ImageType } from "../../service/image";
import AffixBack from "../../components/affix/affix-back";
import AffixFooter from "../../components/affix/affix-footer";
import AffixAdd from "../../components/affix/affix-add";
import { Spin, message } from "antd";

const MusicPlayer = () => {
    const [parent_id, setParentId] = useState<string>("root");

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([getFolderList(parent_id), getImageList(parent_id), getFileList(parent_id)]).finally(() => {
            setLoading(false);
        });
        // getFolderList(parent_id);
        // getImageList(parent_id);
        // getFileList(parent_id);
    }, [parent_id]);

    // 文件夹列表
    const [folderList, setFolderList] = useState<FolderType[]>([]);
    // 图片列表
    const [imageList, setImageList] = useState<ImageType[]>([]);
    // 文件列表
    const [fileList, setFileList] = useState<FileType[]>([]);

    // 获取文件夹列表
    const getFolderList = async (parent_id: string) => {
        setFolderList([]);
        const username = localStorage.getItem("username");
        const res = await getFolder(parent_id, username);
        if (res) {
            setFolderList(res.data.sort((a, b) => new Date(b.cTime).getTime() - new Date(a.cTime).getTime()));
        }
    };

    // 获取图片列表
    const getImageList = async (parent_id: string) => {
        setImageList([]);
        const username = localStorage.getItem("username");
        const res = await getImageListByOtherId(parent_id, username);
        console.log(res);
        if (res) {
            setImageList(res as ImageType[]);
        }
    };

    // 获取文件列表
    const getFileList = async (parent_id: string) => {
        setFileList([]);
        const username = localStorage.getItem("username");
        const res = await getFileListByOtherId(parent_id, username);
        if (res) {
            setFileList(res as FileType[]);
        }
    };

    const addAFolder = async () => {
        const params = {
            name: "新建文件夹",
            parent_id,
        };
        const res = await addFolder(params);
        if (res) {
            message.success("新增文件夹成功");
            getFolderList(parent_id);
        } else {
            message.error("新增文件夹失败");
        }
    };

    return (
        <>
            <Header title="云盘" />
            <main>
                <Spin spinning={loading}>
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
                    {parent_id !== "root" ? (
                        <AffixFooter type="fixed">
                            <AffixBack
                                onClick={() => {
                                    setParentId("root");
                                }}
                            />
                        </AffixFooter>
                    ) : (
                        <AffixFooter type="fixed">
                            <AffixAdd
                                onClick={() => {
                                    addAFolder();
                                }}
                            />
                        </AffixFooter>
                    )}
                </Spin>
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
