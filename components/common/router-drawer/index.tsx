import React, { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    LoginOutlined,
    BookOutlined,
    OrderedListOutlined,
    ExperimentOutlined,
    CoffeeOutlined,
    PlusOutlined,
    CloudOutlined,
    GithubOutlined,
    CodepenOutlined,
    ClusterOutlined,
    StarFilled,
    AimOutlined,
    VideoCameraOutlined,
    HistoryOutlined,
    AppleFilled,
} from "@ant-design/icons";
import TodoFormDrawer from "../../todo/todo-form-drawer";
import DrawerWrapper from "../drawer-wrapper";
import styles from "./index.module.scss";
import { Button, Space } from "antd";
import TodoDetailDrawer from "../../todo/todo-detail-drawer";
import { TodoItemType } from "../../todo/types";
import useSettings from "../../../hooks/useSettings";
import useTouchEvent from "../../../hooks/useTouchEvent";

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
            title: "todo",
            children: [
                {
                    name: "todo list",
                    path: "/",
                    icon: <OrderedListOutlined />,
                },
                // {
                //     name: settings?.todoNameMap?.["done"],
                //     path: "todo-list-search",
                //     icon: <TrophyOutlined />,
                // },
                // {
                //     name: settings?.todoNameMap?.["habit"],
                //     path: "todo-list-habit",
                //     icon: <CheckSquareOutlined />,
                // },
                // {
                //     name: "todo note",
                //     path: "todo-note",
                //     icon: <FileTextOutlined />,
                // },
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
                    name: "我的日志",
                    path: "blog",
                    icon: <BookOutlined />,
                },
                {
                    name: "随机日志",
                    path: "blog-random",
                    icon: <CoffeeOutlined />,
                },
            ],
        },
        {
            title: "others",
            children: [
                // {
                //     name: "原生 audio",
                //     path: "native-audio",
                //     icon: <CustomerServiceOutlined />,
                // },
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
                // {
                //     name: "番茄时钟",
                //     path: "tomato-clock",
                //     icon: <ClockCircleOutlined />,
                // },
                {
                    name: "CMD",
                    path: "cmd",
                    icon: <CodepenOutlined />,
                },
                {
                    name: "登录",
                    path: "login",
                    icon: <LoginOutlined />,
                },
            ],
        },
    ];

    const router = useRouter();
    const activePath = router.pathname;

    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [showAddTodo, setShowAddTodo] = useState<boolean>(false);

    const id = useRef<any>(null);
    const id2 = useRef<any>(null);
    const touchEvent = useTouchEvent();

    useEffect(() => {
        id.current = "打开新增todo" + Math.random().toFixed(6);
        id2.current = "打开目录抽屉" + Math.random().toFixed(6);
        touchEvent?.pushList("top", {
            id: id.current,
            handleMoveEnd: () => {
                setShowAddTodo(true);
            },
            tipsText: "打开新增todo",
        });
        touchEvent?.pushList("bottom", {
            id: id2.current,
            handleMoveEnd: () => {
                setShowDrawer(true);
            },
            tipsText: "打开目录抽屉",
        });
    }, []);

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
        setShowAddTodo(false);
        refresh();
        setNewTodo(undefined);
    };

    return (
        <>
            <DrawerWrapper open={showDrawer} onClose={() => setShowDrawer(false)} placement="top" height="80vh">
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
        </>
    );
};

export default RouterDrawer;
