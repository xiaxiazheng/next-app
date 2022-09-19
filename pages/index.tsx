import Header from "../components/header";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { message, Spin } from "antd";
import {
    LoginOutlined,
    CustomerServiceOutlined,
    RedditOutlined,
    BookOutlined,
    OrderedListOutlined,
    AlertOutlined,
    ExperimentOutlined,
    TrophyOutlined,
    FileTextOutlined,
    CoffeeOutlined,
    TranslationOutlined,
    PlusOutlined,
    CloudOutlined,
    GithubOutlined,
} from "@ant-design/icons";

const Home = (props) => {
    const { setRouterLoading } = props;

    const [isPP, setIsPP] = useState<boolean>();
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isPP = username === "hyp" ? true : false;
        setIsPP(isPP);
    }, []);

    const routes = [
        {
            name: "登录",
            path: "login",
            icon: <LoginOutlined />,
        },
        {
            name: "翻译",
            path: "translate",
            icon: <TranslationOutlined />,
        },
        {
            name: "单词本",
            path: "word-book",
            icon: <TranslationOutlined />,
        },
        {
            name: "我的已办",
            path: "todo-list-done",
            icon: <TrophyOutlined />,
        },
        {
            name: "长期方向",
            path: "todo-list-pool-long",
            icon: <ExperimentOutlined />,
        },
        {
            name: "短期目标",
            path: "todo-list-pool-short",
            icon: <ExperimentOutlined />,
        },
        {
            name: "待办池",
            path: "todo-list-pool",
            icon: <ExperimentOutlined />,
        },
        {
            name: "todo list",
            path: "todo-list",
            icon: <OrderedListOutlined />,
        },
        {
            name: "新增 todo",
            path: "todo-add",
            icon: <PlusOutlined />,
        },
        {
            name: !isPP ? "抽便签机" : "抽法条机",
            path: "note-random",
            icon: <RedditOutlined />,
        },
        {
            name: "随机日志",
            path: "blog-random",
            icon: <CoffeeOutlined />,
        },
        {
            name: "我的日志",
            path: "blog",
            icon: <BookOutlined />,
        },
        {
            name: !isPP ? "便签" : "法条",
            path: "note",
            icon: <FileTextOutlined />,
        },
        {
            name: !isPP ? "新增便签" : "新增法条",
            path: "note-add",
            icon: <PlusOutlined />,
        },
        // {
        //     name: "原生 audio",
        //     path: "native-audio",
        //     icon: <CustomerServiceOutlined />,
        // },
        {
            name: "音乐播放器",
            path: "music-player",
            icon: <CustomerServiceOutlined />,
        },
        {
            name: "云盘",
            path: "cloud",
            icon: <CloudOutlined />,
        },
        {
            name: "猫",
            path: "mao",
            icon: <GithubOutlined />,
        },
    ];

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, []);

    const [active, setActive] = useState<string>();

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main>
                <div className={styles.index}>
                    {routes.map((item) => {
                        return (
                            <div
                                className={`${styles.route_item} ${active === item.path ? styles.active : ""}`}
                                key={item.path}
                                onClick={async () => {
                                    setRouterLoading(true);
                                    setActive(item.path);
                                    await router.push(`/${item.path}`);
                                    setRouterLoading(false);
                                }}
                            >
                                <div className={styles.icon}>{item.icon}</div>
                                <div>{item.name || item.path}</div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Home;
