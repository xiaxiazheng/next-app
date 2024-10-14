import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { message, Tabs } from "antd";
import { useRouter } from "next/router";
import MusicPlayerWrapper from "../components/music-player-wrapper";
import HomeTodo from "../components/home-todo";
import TodoNote from "../components/todo-note";
import HomeTranslate from "../components/home-translate";
// import HomeTips from "../components/common/home-tips";

const TabPane = Tabs.TabPane;

interface IProps {
    refreshFlag: number;
}

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

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <Tabs className={styles.tabs} activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
                    <TabPane tab="todo" key="todo" className={styles.content}>
                        <HomeTodo refreshFlag={refreshFlag} />
                    </TabPane>
                    <TabPane tab="todo圈" key="note" className={styles.content}>
                        <TodoNote />
                    </TabPane>
                    <TabPane tab="music" key="music" className={styles.content}>
                        <MusicPlayerWrapper />
                    </TabPane>
                    <TabPane tab="translate" key="translate" className={styles.content}>
                        <HomeTranslate isActive={activeKey === 'translate'} />
                    </TabPane>
                </Tabs>
            </main>
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
