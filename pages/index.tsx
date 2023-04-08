import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { message } from "antd";
// import HomeTips from "../components/common/home-tips";
import { useRouter } from "next/router";
import { getTodo } from "../service";
import TodoDayList from "../components/todo/todo-day-list";

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            message.warning("请先登录");
        }
    }, []);

    const [todoList, setTodoList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodo();
        if (res) {
            setTodoList(res.data.list.filter((item) => item.isTarget !== "1"));
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.todo}>
                <TodoDayList list={todoList} getData={getData} title="todo" isReverse={true} />
            </main>
        </div>
    );
};

export default Home;
