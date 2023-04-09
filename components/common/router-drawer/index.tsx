import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    VideoCameraOutlined,
    ClockCircleOutlined,
    CheckSquareOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import TodoFormDrawer from "../../todo/todo-form-drawer";
import { TodoStatus } from "../../../service";
import useTouchRightToLeft from "../../../hooks/useTouchRightToLeft";
import DrawerWrapper from "../drawer-wrapper";
import styles from "./index.module.scss";

interface IProps {
    setRouterLoading: Function;
}

const RouterDrawer: React.FC<IProps> = (props) => {
    const { setRouterLoading } = props;

    const [isMe, setIsMe] = useState<boolean>();
    useEffect(() => {
        const username = localStorage.getItem("username");
        setIsMe(username === "zyb" ? true : false);
    }, []);

    const routes = [
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
                    name: "七牛云视频",
                    path: "video",
                    icon: <VideoCameraOutlined />,
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
                {
                    name: "云盘",
                    path: "cloud",
                    icon: <CloudOutlined />,
                },
                {
                    name: "番茄时钟",
                    path: "tomato-clock",
                    icon: <ClockCircleOutlined />,
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
                    name: "打卡",
                    path: "todo-list-punch-the-clock",
                    icon: <CheckSquareOutlined />,
                },
                {
                    name: "已完成",
                    path: "todo-list-done",
                    icon: <TrophyOutlined />,
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
                    name: "todo list",
                    path: "/",
                    icon: <OrderedListOutlined />,
                },
                {
                    name: "足迹",
                    path: "todo-list-footprint",
                    icon: <HistoryOutlined />,
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
    ];

    const router = useRouter();

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const tips1 = useTouchRightToLeft({
        isReverse: true,
        onChange: () => setShowDrawer(true),
    });

    const activePath = router.pathname;
    console.log(`activePath: `, activePath);
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
    const tips2 = useTouchRightToLeft({
        onChange: () => setShowAddTodo(true),
    });

    const handleClick = async (path: string) => {
        setShowDrawer(false);
        if (path === "todo-add") {
            setShowAddTodo(true);
        } else {
            setRouterLoading(true);
            await router.push(`/${path}`);
            setRouterLoading(false);
        }
    };

    return (
        <>
            <DrawerWrapper open={showDrawer} onClose={() => setShowDrawer(false)} placement="left" width="80vw">
                {routes.map((category) => {
                    return (
                        <div key={category.title}>
                            <h3 className={styles.title}>{category.title}</h3>
                            <div className={styles.index}>
                                {category.children.map((item) => {
                                    return (
                                        <div
                                            className={`${styles.route_item} ${
                                                activePath === item.path || activePath === `/${item.path}`
                                                    ? styles.active
                                                    : ""
                                            }`}
                                            key={item.path}
                                            onClick={() => handleClick(item.path)}
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
            </DrawerWrapper>
            <TodoFormDrawer
                placement="bottom"
                operatorType="add"
                open={showAddTodo}
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
            {tips1}
            {tips2}
        </>
    );
};

export default RouterDrawer;
