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
    ExperimentOutlined,
    TrophyOutlined,
    FileTextOutlined,
    CoffeeOutlined,
    TranslationOutlined,
    PlusOutlined,
    CloudOutlined,
    GithubOutlined,
    CodepenOutlined,
    ClusterOutlined,
    StarFilled,
    AimOutlined,
} from "@ant-design/icons";
import TodoFormDrawer from "../components/todo/todo-form-drawer";
import { TodoStatus } from "../service";

const Home = (props) => {
    const { setRouterLoading } = props;

    const [isMe, setIsMe] = useState<boolean>();
    const [isPP, setIsPP] = useState<boolean>();
    useEffect(() => {
        const username = localStorage.getItem("username");
        setIsMe(username === "zyb" ? true : false);
        setIsPP(username === "hyp" ? true : false);
    }, []);

    const routes = [
        {
            title: "note",
            children: [
                {
                    name: "随机 note",
                    path: "note-random",
                    icon: <RedditOutlined />,
                },
                {
                    name: "note",
                    path: "note",
                    icon: <FileTextOutlined />,
                },
                {
                    name: "新增 note",
                    path: "note-add",
                    icon: <PlusOutlined />,
                },
            ],
        },
        {
            title: "others",
            children: [
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
                {
                    name: "树",
                    path: "tree",
                    icon: <ClusterOutlined />,
                },
            ].concat(
                isMe
                    ? [
                          {
                              name: "CMD",
                              path: "cmd",
                              icon: <CodepenOutlined />,
                          },
                      ]
                    : []
            ),
        },
        {
            title: "todo",
            children: [
                {
                    name: "目标",
                    path: "todo-list-target",
                    icon: <AimOutlined />,
                },
                {
                    name: "书签",
                    path: "todo-list-bookmark",
                    icon: <StarFilled />,
                },
                {
                    name: "已完成",
                    path: "todo-list-done",
                    icon: <TrophyOutlined />,
                },
                {
                    name: "todo list",
                    path: "todo-list",
                    icon: <OrderedListOutlined />,
                },
                {
                    name: "todo note",
                    path: "todo-note",
                    icon: <FileTextOutlined />,
                },
                {
                    name: "待办池",
                    path: "todo-list-pool",
                    icon: <ExperimentOutlined />,
                },
                {
                    name: "新建 todo",
                    path: "todo-add",
                    icon: <PlusOutlined />,
                },
            ],
        },
        {
            title: "blog",
            children: [
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
            ],
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

    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main>
                <div className={styles.main}>
                    {routes.map((category) => {
                        return (
                            <div key={category.title}>
                                <h3 className={styles.title}>{category.title}</h3>
                                <div className={styles.index}>
                                    {category.children.map((item) => {
                                        return (
                                            <div
                                                className={`${styles.route_item} ${
                                                    active === item.path ? styles.active : ""
                                                }`}
                                                key={item.path}
                                                onClick={async () => {
                                                    if (item.path === "todo-add") {
                                                        setShowAddTodo(true);
                                                    } else {
                                                        setRouterLoading(true);
                                                        setActive(item.path);
                                                        await router.push(`/${item.path}`);
                                                        setRouterLoading(false);
                                                    }
                                                }}
                                            >
                                                <div className={styles.icon}>{item.icon}</div>
                                                <div>{item.name || item.path}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <TodoFormDrawer
                    operatorType="add"
                    visible={showAddTodo}
                    onClose={() => setShowAddTodo(false)}
                    onSubmit={(val) => {
                        const map = {
                            [TodoStatus.todo]: "/todo-list",
                            [TodoStatus.done]: "/todo-list-done",
                            [TodoStatus.pool]: "/todo-list-pool",
                        };
                        router.push(map[val.status]);
                        setShowAddTodo(false);
                    }}
                />
            </main>
        </div>
    );
};

export default Home;
