import React, { useState } from "react";
import PreviewImages from "../../preview-images";
import UploadImageFile from "../../upload-image-file";
import { OperatorType, TodoItemType } from "../types";
import styles from "./index.module.scss";
import { handleDesc } from "../utils";
import { Button, message, Space } from "antd";
import { DoneTodoItem, TodoStatus } from "../../../service";
import DrawerWrapper from "../../drawer-wrapper";
import TodoFormDrawer from "../todo-form-drawer";
import ChainDrawer from "../chain-drawer";
import { SwapOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";

interface IProps {
    activeTodo: TodoItemType;
    visible: boolean;
    setVisible: Function;
    onFinish: Function;
}

export const splitStr = "<#####>";
export const renderDescription = (str: string, keyword: string = "") => {
    return (
        <div className={styles.descList}>
            {str.split(splitStr).map((i, index) => (
                <div className={styles.desc} key={index}>
                    {handleDesc(i, keyword)}
                </div>
            ))}
        </div>
    );
};

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const DescriptionModal: React.FC<IProps> = (props) => {
    const { activeTodo, visible, setVisible, onFinish } = props;

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
            onFinish();
        }
        setLoading(false);
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [operatorType, setOperatorType] = useState<OperatorType>("edit");

    const [showChain, setShowChain] = useState<boolean>(false);

    const ChainButton = () => {
        const item = activeTodo;

        const isHasChild = item?.child_todo_list_length !== 0;

        // 在 todo 链路的展示中，前置的就不看了（因为已经找全了）
        const isUp = item?.other_id;
        // 非后续的任务，如果少于一条也不看了，因为也已经找全了；后续任务有后续的还是得看的
        const isDown = isHasChild;

        if (!isUp && !isDown) {
            return null;
        }
        let Comp: any;

        if (isUp && isDown) {
            Comp = SwapOutlined;
        } else if (isUp) {
            Comp = SwapLeftOutlined;
        } else {
            Comp = SwapRightOutlined;
        }

        return (
            <Button
                onClick={() => {
                    setShowChain(true);
                }}
            >
                chain <Comp />
            </Button>
        );
    };

    return (
        <>
            <DrawerWrapper
                title={<span className={styles.modalName}>{activeTodo?.name}</span>}
                visible={visible}
                onClose={() => setVisible(false)}
                footer={
                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                        <ChainButton />
                        <Space className={styles.operator} size={10}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOperatorType("progress");
                                    setShowEdit(true);
                                }}
                            >
                                添加进度
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOperatorType("copy");
                                    setShowEdit(true);
                                }}
                            >
                                复制
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOperatorType("edit");
                                    setShowEdit(true);
                                }}
                            >
                                编辑
                            </Button>
                            {/* {activeTodo?.status === String(TodoStatus.todo) && (
                                <Button type="primary" onClick={() => handleDone()} danger loading={loading}>
                                    完成Todo
                                </Button>
                            )} */}
                        </Space>
                    </span>
                }
            >
                <div style={{ fontSize: 14 }}>
                    {activeTodo?.description && renderDescription(activeTodo.description)}
                </div>
                {activeTodo?.imgList && (
                    <div style={{ marginTop: 10 }}>
                        <UploadImageFile type="todo" otherId={activeTodo.todo_id} refreshImgList={onFinish} />
                        <PreviewImages imagesList={activeTodo.imgList} />
                    </div>
                )}
            </DrawerWrapper>
            <TodoFormDrawer
                visible={showEdit}
                todo_id={activeTodo?.todo_id}
                onClose={() => setShowEdit(false)}
                operatorType={operatorType}
                onSubmit={() => {
                    onFinish();
                    setShowEdit(false);
                }}
            />
            <ChainDrawer visible={showChain} onClose={() => setShowChain(false)} todo_id={activeTodo?.todo_id} />
        </>
    );
};

export default DescriptionModal;
