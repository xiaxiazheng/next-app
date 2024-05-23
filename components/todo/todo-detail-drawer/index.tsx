import React, { useEffect, useState } from "react";
import PreviewImages from "../../common/preview-images";
import UploadImageFile from "../../common/upload-image-file";
import { OperatorType, TodoItemType } from "../types";
import styles from "./index.module.scss";
import { renderDescription, setFootPrintList } from "../utils";
import { Button, message, Space } from "antd";
import { DoneTodoItem, getTodoById, TodoStatus } from "../../../service";
import DrawerWrapper from "../../common/drawer-wrapper";
import TodoFormDrawer from "../todo-form-drawer";
import ChainDrawer from "../chain-drawer";
import TodoItemTitle from "../todo-item-list/todo-item-title";
import TodoChainIcon, { hasChainIcon } from "../todo-item-list/todo-chain-icon";

interface IProps {
    activeTodo: TodoItemType;
    setActiveTodo: (item: TodoItemType) => void; // 用于刷新 activeTodo
    visible: boolean;
    setVisible: Function;
    onRefresh: Function; // 触发刷新外部列表
    onClose?: Function; // 关闭弹窗时触发
    keyword?: string;
}

export const splitStr = "<#####>";

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const TodoDetailDrawer: React.FC<IProps> = (props) => {
    const { activeTodo, setActiveTodo, visible, setVisible, onRefresh, onClose, keyword } = props;

    useEffect(() => {
        if (activeTodo) {
            setFootPrintList(activeTodo?.todo_id);
        }
    }, [activeTodo]);

    const [loading, setLoading] = useState<boolean>(false);
    const handleDone = async () => {
        setLoading(true);
        const params = {
            todo_id: activeTodo.todo_id,
        };

        const res = await DoneTodoItem(params);
        if (res) {
            message.success(res.message);
            handleClose();
            onRefresh();
        }
        setLoading(false);
    };

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [operatorType, setOperatorType] = useState<OperatorType>("edit");

    const [showChain, setShowChain] = useState<boolean>(false);

    const [activeTodo2, setActiveTodo2] = useState<TodoItemType>();
    const [visible2, setVisible2] = useState<boolean>(false);

    const GetTodoById = async (todo_id: string) => {
        return await getTodoById(todo_id);
    };

    const onSubmit = async (val: TodoItemType) => {
        if (operatorType !== "edit") {
            // 如果不是编辑，说明是新增，需要在 activeTodo2 的详情弹窗展示新增的
            const res = await GetTodoById(val.todo_id);
            setActiveTodo2(res.data);
            setVisible2(true);
        } else {
            // 如果是编辑，就要更新当前这个 activeTodo
            setActiveTodo({ ...activeTodo, ...val });
        }
        onRefresh();
        setShowEdit(false);
    };

    const handleUpload = async () => {
        const res = await GetTodoById(activeTodo.todo_id);
        setActiveTodo(res.data);
    };

    // 判断是否应该优先添加子节点
    const shouldAddChild = (todo: TodoItemType) => {
        if (todo?.isTarget === "1") {
            return true;
        }
        return false;
    };

    return (
        <>
            <DrawerWrapper
                title={activeTodo && <TodoItemTitle item={activeTodo} keyword={keyword} showTime={true} />}
                open={visible}
                onClose={handleClose}
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
                        <Space
                            className={styles.operator}
                            size={10}
                            style={{
                                paddingTop: "10px",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setOperatorType("edit");
                                    setShowEdit(true);
                                }}
                            >
                                编辑
                            </Button>
                            <Button
                                type={!shouldAddChild(activeTodo) ? "primary" : "default"}
                                onClick={() => {
                                    setOperatorType("copy");
                                    setShowEdit(true);
                                }}
                            >
                                {activeTodo?.other_id ? "添加同级进度" : "复制"}
                            </Button>
                            <Button
                                type={shouldAddChild(activeTodo) ? "primary" : "default"}
                                onClick={() => {
                                    setOperatorType("progress");
                                    setShowEdit(true);
                                }}
                            >
                                添加后续
                            </Button>
                            {hasChainIcon(activeTodo).hasChain && (
                                <Button
                                    onClick={() => {
                                        setShowChain(true);
                                    }}
                                >
                                    chain <TodoChainIcon item={activeTodo} />
                                </Button>
                            )}
                            {String(activeTodo?.status) === String(TodoStatus.todo) && (
                                <Button type="primary" onClick={() => handleDone()} danger loading={loading}>
                                    完成Todo
                                </Button>
                            )}
                        </Space>
                    </div>
                }
            >
                <div style={{ fontSize: 14 }}>
                    {activeTodo?.description && renderDescription(activeTodo.description, keyword)}
                </div>
                {activeTodo?.todo_id && (
                    <div style={{ marginTop: 10 }}>
                        <UploadImageFile type="todo" otherId={activeTodo.todo_id} refreshImgList={handleUpload} />
                        {activeTodo?.imgList && <PreviewImages imagesList={activeTodo.imgList} />}
                    </div>
                )}
            </DrawerWrapper>
            <TodoFormDrawer
                open={showEdit}
                todo_id={activeTodo?.todo_id}
                onClose={() => setShowEdit(false)}
                operatorType={operatorType}
                onSubmit={onSubmit}
            />
            <ChainDrawer open={showChain} onClose={() => setShowChain(false)} todo_id={activeTodo?.todo_id} />
            {activeTodo && (
                <TodoDetailDrawer
                    activeTodo={activeTodo2}
                    setActiveTodo={setActiveTodo2}
                    visible={visible2}
                    setVisible={setVisible2}
                    keyword={keyword}
                    onRefresh={onRefresh}
                />
            )}
        </>
    );
};

export default TodoDetailDrawer;
