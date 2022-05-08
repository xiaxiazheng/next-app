import Header from "../components/header";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { message } from "antd";
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
} from "@ant-design/icons";

const Home = () => {
    const [isMe, setIsMe] = useState<boolean>();
    useEffect(() => {
        const username = localStorage.getItem("username");
        const isMe = username === "zyb" ? true : false;
        setIsMe(isMe);
    }, []);

    const routes = [
        {
            name: "登录",
            path: "login",
            icon: <LoginOutlined />,
        },
        {
            name: "待办池",
            path: "todo-list-pool",
            icon: <ExperimentOutlined />,
        },
        {
            name: "我的已办",
            path: "todo-list-done",
            icon: <TrophyOutlined />,
        },
        {
            name: "长期任务",
            path: "todo-list-pool-long",
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
            name: isMe ? "抽便签机" : "抽法条机",
            path: "note-random",
            icon: <RedditOutlined />,
        },
        {
            name: isMe ? "便签" : "法条",
            path: "note",
            icon: <FileTextOutlined />,
        },
        {
            name: isMe ? "新增便签" : "新增法条",
            path: "note-add",
            icon: <PlusOutlined />,
        },
        {
            name: "我的日志",
            path: "blog",
            icon: <BookOutlined />,
        },
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
            name: "随机日志",
            path: "blog-random",
            icon: <CoffeeOutlined />,
        },
        // {
        //     name: "原生 audio",
        //     path: "native-audio",
        //     icon: <CustomerServiceOutlined />,
        // },
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
    ];

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, []);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main>
                <div className={styles.index}>
                    {routes.map((item) => {
                        return (
                            <div
                                className={styles.route_item}
                                key={item.path}
                                onClick={() => {
                                    router.push(`/${item.path}`);
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
