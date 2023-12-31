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
    AppleFilled,
    FieldTimeOutlined,
} from "@ant-design/icons";
import TodoFormDrawer from "../../todo/todo-form-drawer";
import useTouchRightToLeft from "../../../hooks/useTouchRightToLeft";
import DrawerWrapper from "../drawer-wrapper";
import styles from "./index.module.scss";
import { TodoStatus } from "../../../service";
import { Button, Space } from "antd";
import TodoDetailDrawer from "../../todo/todo-detail-drawer";
import { TodoItemType } from "../../todo/types";
import useSettings from "../../../hooks/useSettings";

interface IProps {
    setRouterLoading: Function;
    refresh: () => void;
}

const RouterDrawer: React.FC<IProps> = (props) => {
    const { setRouterLoading, refresh } = props;

    const [isMe, setIsMe] = useState<boolean>();
    useEffect(() => {
        const username = localStorage.getItem("username");
        setIsMe(username === "zyb" ? true : false);
    }, []);

    const settings = useSettings();

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
                    name: "todo list",
                    path: "/",
                    icon: <OrderedListOutlined />,
                },
                {
                    name: settings?.todoNameMap?.["done"],
                    path: "todo-list-search",
                    icon: <TrophyOutlined />,
                },
                {
                    name: settings?.todoNameMap?.["pool"],
                    path: "todo-list-pool",
                    icon: <ExperimentOutlined />,
                },
                {
                    name: settings?.todoNameMap?.["habit"],
                    path: "todo-list-habit",
                    icon: <CheckSquareOutlined />,
                },
                {
                    name: "新建 todo",
                    path: "todo-add",
                    icon: <PlusOutlined />,
                },
                {
                    name: "todo note",
                    path: "todo-note",
                    icon: <FileTextOutlined />,
                },
                {
                    name: settings?.todoNameMap?.["target"],
                    path: "todo-list-target",
                    icon: <AimOutlined />,
                },
                {
                    name: settings?.todoNameMap?.["bookMark"],
                    path: "todo-list-bookmark",
                    icon: <StarFilled />,
                },
                {
                    name: settings?.todoNameMap?.["footprint"],
                    path: "todo-list-footprint",
                    icon: <HistoryOutlined />,
                },
                {
                    name: "往年今日",
                    path: "today-before-years",
                    icon: <FieldTimeOutlined />,
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
                    name: settings?.todoNameMap?.["note"],
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
    const activePath = router.pathname;

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);
    // 从左往右
    const tips1 = useTouchRightToLeft(
        {
            spanX: 150,
            isReverse: true,
            onChange: () => {
                !showAddTodo && setShowDrawer(true);
            },
        },
        [showAddTodo]
    );
    // 从右往左，打开添加 todo
    const tips2 = useTouchRightToLeft(
        {
            spanX: 150,
            onChange: () => {
                !showDrawer && setShowAddTodo(true);
            },
        },
        [showDrawer]
    );

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

    const [isWork, setIsWork] = useState("");
    useEffect(() => {
        setIsWork(localStorage.getItem("WorkOrLife") || "");
    }, []);
    useEffect(() => {
        if (isWork && isWork !== localStorage.getItem("WorkOrLife")) {
            localStorage.setItem("WorkOrLife", isWork);
            refresh();
            setShowDrawer(false);
        }
    }, [isWork]);

    const [newTodo, setNewTodo] = useState<TodoItemType>();
    const [visible2, setVisible2] = useState<boolean>(false);

    const handleCloseAdd = () => {
        const map = {
            [TodoStatus.todo]: "/",
            [TodoStatus.done]: "/todo-list-search",
            [TodoStatus.pool]: "/todo-list-pool",
        };
        setShowAddTodo(false);
        if (router.route === map[newTodo.status]) {
            refresh();
            setNewTodo(undefined);
        } else {
            router.push(map[newTodo.status]);
        }
    };

    return (
        <>
            <DrawerWrapper open={showDrawer} onClose={() => setShowDrawer(false)} placement="left" width="80vw">
                <Space size={10} style={{ paddingTop: "20px" }}>
                    <Button
                        className={styles.btn}
                        type="text"
                        onClick={() => setIsWork(isWork === "1" ? "" : "1")}
                        icon={<AppleFilled />}
                        style={
                            isWork === "1"
                                ? {
                                      borderColor: "#00d4d8",
                                      background: "#00d4d8",
                                  }
                                : { borderColor: "#00d4d8", color: "#00d4d8" }
                        }
                    >
                        Work
                    </Button>
                    <Button
                        className={styles.btn}
                        type="text"
                        onClick={() => setIsWork(isWork === "0" ? "" : "0")}
                        icon={<CoffeeOutlined />}
                        style={
                            isWork === "0"
                                ? {
                                      borderColor: "#00d4d8",
                                      background: "#00d4d8",
                                  }
                                : { borderColor: "#00d4d8", color: "#00d4d8" }
                        }
                    >
                        Life
                    </Button>
                </Space>
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
                    setNewTodo(val);
                    setVisible2(true);
                    setShowAddTodo(false);
                }}
            />
            {newTodo && (
                <TodoDetailDrawer
                    activeTodo={newTodo}
                    setActiveTodo={setNewTodo}
                    visible={visible2}
                    setVisible={setVisible2}
                    keyword={""}
                    onRefresh={refresh}
                    onClose={() => {
                        handleCloseAdd();
                    }}
                />
            )}
            {!showDrawer && !showAddTodo && (
                <>
                    {tips1}
                    {tips2}
                </>
            )}
        </>
    );
};

export default RouterDrawer;
