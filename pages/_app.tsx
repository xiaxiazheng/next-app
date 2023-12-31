import { AppProps } from "next/app";
import "../styles/global.scss";
import AffixHome from "../components/common/affix/affix-home";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import { getSettings } from "../service/settings";

function App({ Component, pageProps }: any) {
    const [loading, setLoading] = useState<boolean>(false);

    const [flag, setFlag] = useState<number>();
    const refresh = () => {
        setFlag(Math.random());
    };

    const [settings, setSettings] = useState<any>({});
    useEffect(() => {
        getSettingsData();
    }, []);

    const getSettingsData = async () => {
        const res = await getSettings();
        setSettings(res.data);
    };

    return (
        <Spin spinning={loading} style={{ overflow: "hidden" }}>
            <Component {...pageProps} setRouterLoading={setLoading} refreshFlag={flag} settings={settings} />
            <AffixHome />
            <RouterDrawer setRouterLoading={setLoading} refresh={refresh} settings={settings}  />
        </Spin>
    );
}

export default App;
