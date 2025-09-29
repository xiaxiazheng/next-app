import { useEffect, useState } from "react";
import Header from "../../common/header";
import styles from "./index.module.scss";
import { getTodoHabit, TodoStatus } from "@xiaxiazheng/blog-libs";
import { Button, Space, Spin } from "antd";
import { TodoItemType } from "@xiaxiazheng/blog-libs";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSettingsContext } from "@xiaxiazheng/blog-libs";
import TodoTreeList from "../todo-tree-list";
import TodoListCategoryChild from "./todo-list-category-child";
import DrawerWrapper from "../../common/drawer-wrapper";

dayjs.locale("zh-cn");

interface IProps {
    refreshFlag: number;
    keyword?: string
}

/** 知识目录的组件 */
const TodoListCategory: React.FC<IProps> = (props) => {
    const { refreshFlag, keyword = '' } = props;

    const [todoList, setTodoList] = useState<TodoItemType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const settings = useSettingsContext();

    const getData = async () => {
        setLoading(true);
        const params = {
            status: TodoStatus.todo,
            keyword
        };
        const res = await getTodoHabit(params);
        if (res) {
            const list = res.data.list;
            setTodoList(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    const [categoryTodo, setCategoryTodo] = useState<TodoItemType>();
    const [showChildDrawer, setShowChildDrawer] = useState<boolean>(false);

    return (
        <Spin spinning={loading}>
            <Header title={settings?.todoNameMap?.isCategory} />
            <main className={styles.pool}>
                <h2 className={styles.h2}>
                    <span style={{ fontSize: 16 }}>
                        {settings?.todoNameMap?.isCategory} ({todoList?.length || 0})
                    </span>
                    <Space size={8}>
                        {/* 刷新列表 */}
                        <Button
                            style={{ width: 50 }}
                            icon={<SyncOutlined />}
                            onClick={() => getData()}
                            type="default"
                        />
                    </Space>
                </h2>
                {/* 待办 todo 列表 */}
                <TodoTreeList
                    list={todoList}
                    onRefresh={getData}
                    showDetailDrawer={false}
                    onClick={(item) => {
                        setCategoryTodo(item);
                        setShowChildDrawer(true);
                    }}
                />
                {/* category child List */}
                <DrawerWrapper
                    title={`查看 category "${categoryTodo?.name}"下的 todo`}
                    open={showChildDrawer}
                    onClose={() => setShowChildDrawer(false)}
                >
                    <TodoListCategoryChild
                        categoryTodo={categoryTodo}
                        refreshFlag={refreshFlag}
                    />
                </DrawerWrapper>
            </main>
        </Spin>
    );
};

export default TodoListCategory;

