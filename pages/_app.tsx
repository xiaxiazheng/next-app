import { AppProps } from "next/app";
import "../styles/global.scss";
import { useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import Affix from "../components/common/affix";
import { useRouter } from "next/router";
import AddTodoHoc from "../components/todo/add-todo-hoc";

function App({ Component, pageProps }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [flag, setFlag] = useState<number>();
    const refresh = () => {
        setFlag(Math.random());
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);

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
            <AddTodoHoc
                onClose={() => refresh()}
                renderChildren={({onClick}) => {
                    return (
                        <Affix
                            type="add"
                            bottomIndex={isShowHome ? 3 : 2}
                            onClick={() => onClick()}
                        />
                    )
                }} />
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
