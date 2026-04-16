'use client';
// import { AppProps } from "next/app";
// import "../styles/global.scss";
import { FC, ReactNode, useState, createContext, useContext } from "react";
import { Spin } from "antd";
import RouterDrawer from "../components/common/router-drawer";
import Affix from "../components/common/affix";
import AffixVoice from "../components/common/affix/affix-voice";
import { useRouter, usePathname } from "next/navigation";

import AddTodoHoc from "../components/todo/add-todo-hoc";
import { SettingsProvider } from "@xiaxiazheng/blog-libs";

interface RefreshContextType {
    refreshFlag: number;
    refresh: () => void;
}

const RefreshContext = createContext<RefreshContextType>({ refreshFlag: 0, refresh: () => {} });

export const useRefreshContext = () => useContext(RefreshContext);

const LayoutWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const Provider: any = SettingsProvider;

    const [loading, setLoading] = useState<boolean>(false);
    const [refreshFlag, setRefreshFlag] = useState<number>(0);
    const refresh = () => {
        setRefreshFlag(Math.random());
    };

    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    const isMusic = usePathname() === '/music';
    const isShowHome = !isMusic && usePathname() !== "/" && usePathname() !== '/todo-note';
    return (
        <Provider>
            <Spin spinning={loading} style={{ overflow: "hidden" }}>
                <RefreshContext.Provider value={{ refreshFlag, refresh }}>
                    {/* <Component {...pageProps} setRouterLoading={setLoading} refreshFlag={flag} /> */}
                    {children}
                </RefreshContext.Provider>
                {isShowHome && <Affix type="home" bottomIndex={1} />}
                <Affix
                    type="category"
                    bottomIndex={isShowHome ? 2 : 1}
                    onClick={() => {
                        setShowDrawer(true);
                    }}
                />
                {!isMusic && <AddTodoHoc
                    onClose={() => refresh()}
                    renderChildren={({ onClick }) => {
                        return (
                            <Affix
                                type="add"
                                bottomIndex={isShowHome ? 3 : 2}
                                onClick={() => onClick()}
                            />
                        )
                    }} />
                }
                <AffixVoice />
                <RouterDrawer
                    setRouterLoading={setLoading}
                    refresh={refresh}
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                />
            </Spin>
        </Provider>
    )
}

export default LayoutWrapper;