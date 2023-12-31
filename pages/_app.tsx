import { AppProps } from "next/app";
import "../styles/global.scss";
import AffixHome from "../components/common/affix/affix-home";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import useSettings from "../hooks/useSettings";

function App({ Component, pageProps }: any) {
    const [loading, setLoading] = useState<boolean>(false);

    const [flag, setFlag] = useState<number>();
    const refresh = () => {
        setFlag(Math.random());
    };

    const settings = useSettings();

    return (
        <Spin spinning={loading} style={{ overflow: "hidden" }}>
            <Component {...pageProps} setRouterLoading={setLoading} refreshFlag={flag}/>
            <AffixHome />
            <RouterDrawer setRouterLoading={setLoading} refresh={refresh} />
        </Spin>
    );
}

export default App;
