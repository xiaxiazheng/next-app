import React, { useState } from "react";
import PreviewImages from "../../common/preview-images";
import UploadImageFile from "../../common/upload-image-file";
import { OperatorType, TodoItemType } from "../types";
import styles from "./index.module.scss";
import { renderDescription } from "../utils";
import { Button, message, Space } from "antd";
import { DoneTodoItem, TodoStatus } from "../../../service";
import DrawerWrapper from "../../common/drawer-wrapper";
import TodoFormDrawer from "../todo-form-drawer";
import ChainDrawer from "../chain-drawer";
import TodoItemTitle from "../todo-item-list/todo-item-title";
import TodoChainIcon from "../todo-item-list/todo-chain-icon";

interface IProps {
    activeTodo: TodoItemType;
    visible: boolean;
    setVisible: Function;
    onFinish: Function;
    keyword?: string;
}

export const splitStr = "<#####>";

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const TodoDetailDrawer: React.FC<IProps> = (props) => {
    const { activeTodo, visible, setVisible, onFinish, keyword } = props;

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

    return (
        <>
            <DrawerWrapper
                title={activeTodo && <TodoItemTitle item={activeTodo} keyword={keyword} />}
                open={visible}
                onClose={() => setVisible(false)}
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            paddingBottom: "20px",
                            borderTop: "1px solid white",
                        }}
                    >
                        <Space style={{ flex: 1, paddingTop: "10px" }}>
                            {activeTodo?.status === String(TodoStatus.todo) && (
                                <Button type="primary" onClick={() => handleDone()} danger loading={loading}>
                                    完成Todo
                                </Button>
                            )}
                        </Space>
                        <Space
                            className={styles.operator}
                            size={10}
                            style={{
                                paddingTop: "10px",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setShowChain(true);
                                }}
                            >
                                chain <TodoChainIcon item={activeTodo} />
                            </Button>
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
                        </Space>
                    </div>
                }
            >
                <div style={{ fontSize: 14 }}>
                    {activeTodo?.description && renderDescription(activeTodo.description, keyword)}
                </div>
                {activeTodo?.imgList && (
                    <div style={{ marginTop: 10 }}>
                        <UploadImageFile type="todo" otherId={activeTodo.todo_id} refreshImgList={onFinish} />
                        <PreviewImages imagesList={activeTodo.imgList} />
                    </div>
                )}
            </DrawerWrapper>
            <TodoFormDrawer
                open={showEdit}
                todo_id={activeTodo?.todo_id}
                onClose={() => setShowEdit(false)}
                operatorType={operatorType}
                onSubmit={() => {
                    onFinish();
                    setShowEdit(false);
                }}
            />
            <ChainDrawer open={showChain} onClose={() => setShowChain(false)} todo_id={activeTodo?.todo_id} />
        </>
    );
};

export default TodoDetailDrawer;
