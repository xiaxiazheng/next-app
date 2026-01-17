'use client';
import Header from "../components/common/header";
import { useEffect } from "react";
import styles from "./page.module.css";
import { message } from "antd";
import { useRouter } from "next/navigation";
import TodoTabs from "./todo-tabs";
import TouchEventComp from "../utils/TouchEventComp";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, [router]);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.home}>
                <TodoTabs refreshFlag={0} />
            </main>
            <TouchEventComp />
        </div>
    );
}
