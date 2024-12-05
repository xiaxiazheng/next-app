import Header from "../components/common/header";
import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./index.module.scss";
import { message, Tabs } from "antd";
import { useRouter } from "next/router";
import MusicPlayerWrapper from "../components/music-player-wrapper";
import HomeTodo from "../components/home-todo";
import TodoNote from "../components/todo-note";
import HomeTranslate from "../components/home-translate";
import useTouchEvent from "../hooks/useTouchEvent";
import TouchEventComp from "../utils/TouchEventComp";
import type { TabsProps } from 'antd';
// import HomeTips from "../components/common/home-tips";

interface IProps {
    refreshFlag: number;
}

const tabList = ["todo", "note", "music", "translate"];

const Home: React.FC<IProps> = ({ refreshFlag }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, []);

    const [activeKey, setActiveKey] = useState<string>("todo");

    const id = useRef<any>(null);
    const id2 = useRef<any>(null);
    const touchEvent = useTouchEvent();
    useEffect(() => {
        id.current = "切换 tab, ->" + Math.random().toFixed(6);
        id2.current = "切换 tab, <-" + Math.random().toFixed(6);
    }, []);

    useEffect(() => {
        touchEvent?.popList("left", id.current);
        touchEvent?.pushList("left", {
            id: id.current,
            handleMoveEnd: () => {
                if (activeKey) {
                    const i = tabList.findIndex((item) => item === activeKey);
                    if (i !== tabList.length - 1) {
                        setActiveKey(tabList[i + 1]);
                    } else {
                        setActiveKey(tabList[0]);
                    }
                }
            },
            tipsText: "切换 tab, ->",
        });
        touchEvent?.popList("right", id.current);
        touchEvent?.pushList("right", {
            id: id2.current,
            handleMoveEnd: () => {
                if (activeKey) {
                    const i = tabList.findIndex(item => item === activeKey);
                    if (i !== 0) {
                        setActiveKey(tabList[i - 1]);
                    } else {
                        setActiveKey(tabList[tabList.length - 1]);
                    }
                }
            },
            tipsText: "切换 tab, <-",
        });
    }, [activeKey]);

    const tabs: TabsProps['items'] = [
        {
            key: 'todo',
            label: 'todo',
            children: <div className={styles.content}><HomeTodo refreshFlag={refreshFlag} /></div>
        },
        {
            key: 'todo圈',
            label: 'todo圈',
            children: <div className={styles.content}><TodoNote /></div>
        }, {
            key: 'music',
            label: 'music',
            children: <div className={styles.content}><MusicPlayerWrapper /></div>
        }, {
            key: 'translate',
            label: 'translate',
            children: <div className={styles.content}><HomeTranslate isActive={activeKey === "translate"} /></div>
        },
    ]

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <Tabs className={styles.tabs} activeKey={activeKey} onChange={(val) => setActiveKey(val)} items={tabs} />
            </main>
            <TouchEventComp />
        </div>
    );
};

export default Home;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
