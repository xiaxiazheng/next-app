import Header from "../components/common/header";
import { useEffect } from "react";
import styles from "./index.module.scss";
import { message } from "antd";
import { useRouter } from "next/router";
import TodoTabs from "../components/pages/todo-tabs";
import TouchEventComp from "../utils/TouchEventComp";

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

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <TodoTabs refreshFlag={refreshFlag} />
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
