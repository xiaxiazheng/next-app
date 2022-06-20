import { AppProps } from "next/app";
import "../styles/global.scss";
import AffixHome from "../components/affix/affix-home";
import { useState } from "react";
import { Spin } from "antd";

function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Spin spinning={loading}>
            <Component {...pageProps} setRouterLoading={setLoading} />
            <AffixHome />
        </Spin>
    );
}

export default App;
