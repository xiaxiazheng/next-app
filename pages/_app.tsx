import { AppProps } from "next/app";
import "../styles/global.scss";
import AffixHome from "../components/common/affix/affix-home";
import { useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";

function App({ Component, pageProps }: any) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Spin spinning={loading} style={{ overflow: "hidden" }}>
            <Component {...pageProps} setRouterLoading={setLoading} />
            <AffixHome />
            <RouterDrawer setRouterLoading={setLoading} />
        </Spin>
    );
}

export default App;
