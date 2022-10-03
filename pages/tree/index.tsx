import Header from "../../components/header";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { GetNoteList, GetNoteCategory, getAllTreeList, getNodeCont, modifyNodeContItem } from "../../service";
import { useEffect, useState } from "react";
import { Input, Button, Pagination, Radio, Space, message, Tree, Collapse } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";
import { NoteType } from "../../components/note/types";
import Category from "../../components/todo/category";
import MyDrawer from "../../components/my-drawer";
import PreviewImages from "../../components/preview-images";
import UploadImageFile from "../../components/upload-image-file";
import { handleUrl, handleKeyword } from "../../components/note/utils";
import AffixEdit from "../../components/affix/affix-edit";
import PreviewFiles from "../../components/preview-files";
import MyModal from "../../components/my-modal";

const { TextArea } = Input;

const { Search } = Input;

const Note = () => {
    const router = useRouter();

    const [treeList, setTreeList] = useState<any[]>([]);
    const getTreeData = async () => {
        const res = await getAllTreeList();
        if (res.data) {
            setTreeList(res.data);
        }
    };

    useEffect(() => {
        getTreeData();
    }, []);

    const [showDrawer, setShowDrawer] = useState<boolean>(true);
    const [treeItem, setTreeItem] = useState<any>();
    const [contList, setContList] = useState<any[]>();
    const [contItem, setContItem] = useState<any>();
    const [title, setTitle] = useState<string>();
    const [content, setContent] = useState<string>();
    useEffect(() => {
        if (contItem) {
            setTitle(contItem.title);
            setContent(contItem.originCont);
        }
    }, [contItem]);

    // 获取树当前节点具体内容数据
    const getTreeCont = async (id: string) => {
        // 获取数据
        let res = await getNodeCont(id || treeItem.id);
        if (res.data) {
            res.data.forEach((item: any) => {
                item.originCont = item.cont;
                item.cont = item.cont.replace(/</g, "&lt;"); // html标签的<转成实体字符,让所有的html标签失效
                item.cont = item.cont.replace(/&lt;pre/g, "<pre"); // 把pre标签转回来
                item.cont = item.cont.replace(/pre>\n/g, "pre>"); // 把pre后面的空格去掉
                item.cont = item.cont.replace(/&lt;\/pre>/g, "</pre>"); // 把pre结束标签转回来
                item.cont = item.cont.replace(/ {2}/g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
                item.cont = item.cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成br标签
            });
            setContList(res.data);
        }
    };

    const saveCont = async () => {
        const params: any = {
            cont_id: contItem.cont_id,
            title,
            cont: content,
        };
        await modifyNodeContItem(params);
        message.success("修改成功");
        getTreeCont(treeItem.id);
        setContItem(undefined);
    };

    return (
        <>
            <Header title={"tree"} />
            <main className={styles.tree}>
                <h2 className={styles.h2}>
                    <span>{treeItem?.label}</span>
                    {/* <span>
                        <Button
                            style={{ width: 50 }}
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => handleAdd()}
                        />
                    </span> */}
                </h2>
                <div className={styles.content}>
                    <div className={styles.list}>
                        {contList?.map((item) => {
                            return (
                                <div
                                    key={`${item.cont_id}`}
                                    className={styles.listItem}
                                    onClick={() => {
                                        setContItem(item);
                                    }}
                                >
                                    <div className={styles.title}>{item.title}</div>
                                    <div
                                        className={styles.cont}
                                        dangerouslySetInnerHTML={{
                                            __html: item.cont,
                                        }}
                                    />
                                    <div className={styles.imgFileList}>
                                        <PreviewImages imagesList={item.imgList} style={{ margin: 0 }} />
                                        <PreviewFiles filesList={item.fileList} style={{ margin: 0 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Button
                    className={styles.showTree}
                    type="primary"
                    danger
                    shape="circle"
                    size="large"
                    icon={<ApartmentOutlined />}
                    onClick={() => setShowDrawer(true)}
                />
                <MyDrawer visible={showDrawer} onCancel={() => setShowDrawer(false)} placement="bottom">
                    <Collapse>
                        {treeList.map((tree) => {
                            return (
                                <Collapse.Panel header={tree.label} key={tree.id}>
                                    {tree.children.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                style={{
                                                    padding: "5px 0 0 20px",
                                                }}
                                                onClick={() => {
                                                    setTreeItem(item);
                                                    getTreeCont(item.id);
                                                    setShowDrawer(false);
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        );
                                    })}
                                </Collapse.Panel>
                            );
                        })}
                    </Collapse>
                </MyDrawer>
                <MyModal
                    visible={!!contItem}
                    onCancel={() => setContItem(undefined)}
                    footer={() => (
                        <Space size={16}>
                            <Button onClick={() => setContItem(undefined)} danger>
                                取消
                            </Button>
                            <Button onClick={() => saveCont()} type="primary">
                                保存
                            </Button>
                        </Space>
                    )}
                    style={{ width: "100vw", maxWidth: "100vw" }}
                >
                    <div className={styles.modalContent}>
                        <Space size={10} direction={"vertical"} style={{ width: "100%" }}>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            <TextArea value={content} onChange={(e) => setContent(e.target.value)} rows={15} />
                        </Space>
                    </div>
                </MyModal>
            </main>
        </>
    );
};

export default Note;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
