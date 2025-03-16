import { AppProps } from "next/app";
import "../styles/global.scss";
import { useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import Affix from "../components/common/affix";
import { TodoItemType } from "../components/todo/types";
import TodoFormDrawer from "../components/todo/todo-form-drawer";
import TodoDetailDrawer from "../components/todo/todo-detail-drawer";
import { useRouter } from "next/router";

function App({ Component, pageProps }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [flag, setFlag] = useState<number>();
    const refresh = () => {
        setFlag(Math.random());
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
    const [newTodo, setNewTodo] = useState<TodoItemType>();
    const [visible2, setVisible2] = useState<boolean>(false);
    const handleCloseAdd = () => {
        setShowAddTodo(false);
        refresh();
        setNewTodo(undefined);
    };

    const isShowHome = router.pathname !== "/" && router.pathname !== '/todo-note';

    return (
        <Spin spinning={loading} style={{ overflow: "hidden" }}>
            <Component {...pageProps} setRouterLoading={setLoading} refreshFlag={flag} />
            {isShowHome && <Affix type="home" bottomIndex={1} />}
            <Affix
                type="category"
                bottomIndex={isShowHome ? 2 : 1}
                onClick={() => {
                    setShowDrawer(true);
                }}
            />
            <Affix
                type="add"
                bottomIndex={isShowHome ? 3 : 2}
                onClick={() => {
                    setShowAddTodo(true);
                }}
            />
            <TodoFormDrawer
                placement="bottom"
                operatorType="add"
                open={showAddTodo}
                onClose={() => setShowAddTodo(false)}
                onSubmit={(val) => {
                    setNewTodo(val);
                    setVisible2(true);
                    setShowAddTodo(false);
                }}
            />
            {newTodo && (
                <TodoDetailDrawer
                    activeTodo={newTodo}
                    setActiveTodo={setNewTodo}
                    visible={visible2}
                    setVisible={setVisible2}
                    keyword={""}
                    onRefresh={refresh}
                    onClose={() => {
                        handleCloseAdd();
                    }}
                />
            )}
            <RouterDrawer
                setRouterLoading={setLoading}
                refresh={refresh}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
            />
        </Spin>
    );
}

export default App;
