import React, { useEffect, useState } from "react";
import PreviewImages from "../../common/preview-images";
import UploadImageFile from "../../common/upload-image-file";
import { TodoItemType } from "../types";
import styles from "./index.module.scss";
import { renderDescription, setFootPrintList } from "../utils";
import { Button, message, Space } from "antd";
import { DoneTodoItem, getTodoById, TodoStatus } from "../../../service";
import DrawerWrapper from "../../common/drawer-wrapper";
import TodoFormDrawer from "../todo-form-drawer";
import ChainDrawer from "../chain-drawer";
import TodoItemTitle from "../todo-tree-list/todo-item-title";
import TodoChainIcon, { hasChainIcon } from "../todo-tree-list/todo-chain-icon";
import AddTodoHoc from "../add-todo-hoc";

interface IProps {
    activeTodo: TodoItemType;
    visible: boolean;
    onRefresh: (item?: TodoItemType) => void; // 触发刷新外部列表
    onClose: Function; // 关闭弹窗时触发
    keyword?: string;
}

export const splitStr = "<#####>";

// 点开查看 todo 的详情，有 description 和该 todo 上挂的图片
const TodoDetailDrawer: React.FC<IProps> = (props) => {
    const { activeTodo, visible, onRefresh, onClose, keyword } = props;

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
            onRefresh(res.data);
        }
        setLoading(false);
    };

    const handleClose = () => {
        onClose();
    };

    const [showEdit, setShowEdit] = useState<boolean>(false);

    const [showChain, setShowChain] = useState<boolean>(false);

    const GetTodoById = async (todo_id: string) => {
        return await getTodoById(todo_id);
    };

    const onSubmit = async (val: TodoItemType) => {
        const newTodo = { ...activeTodo, ...val };
        onRefresh(newTodo);
        setShowEdit(false);
    };

    const handleUpload = async () => {
        const res = await GetTodoById(activeTodo.todo_id);
        onRefresh(res.data);
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
                height={'90vh'}
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
                                    setShowEdit(true);
                                }}
                            >
                                编辑
                            </Button>
                            <AddTodoHoc
                                operatorType="copy"
                                todo_id={activeTodo?.todo_id}
                                renderChildren={({ onClick }) => {
                                    return (
                                        <Button
                                            type={!shouldAddChild(activeTodo) ? "primary" : "default"}
                                            onClick={() => {
                                                onClick();
                                            }}
                                        >
                                            {activeTodo?.other_id ? "添加同级进度" : "复制"}
                                        </Button>
                                    )
                                }} />
                            <AddTodoHoc
                                operatorType="progress"
                                todo_id={activeTodo?.todo_id}
                                onClose={onRefresh}
                                renderChildren={({ onClick }) => {
                                    return (
                                        <Button
                                            type={shouldAddChild(activeTodo) ? "primary" : "default"}
                                            onClick={() => {
                                                onClick()
                                            }}
                                        >
                                            添加后续
                                        </Button>
                                    )
                                }} />
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
                operatorType={'edit'}
                onSubmit={onSubmit}
            />
            <ChainDrawer open={showChain} onClose={() => setShowChain(false)} todo_id={activeTodo?.todo_id} />
        </>
    );
};

export default TodoDetailDrawer;
