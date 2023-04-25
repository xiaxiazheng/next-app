import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, message, Spin } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getTodo } from "../service";
import TodoDayList from "../components/todo/todo-day-list";
import HomeTips from "../components/common/home-tips";

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

    const [todoList, setTodoList] = useState([]);

    const [loading, setLoading] = useState<boolean>(false);

    const getData = async () => {
        setLoading(true);
        const res = await getTodo();
        if (res) {
            setTodoList(res.data.list);
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [refreshFlag]);

    return (
        <div>
            <Header title="XIAXIAZheng" />
            <main className={styles.todo}>
                <Spin spinning={loading}>
                    <TodoDayList
                        list={todoList}
                        getData={getData}
                        title="todo"
                        isReverse={true}
                        btn={<Button style={{ width: 50 }} type="primary" onClick={() => router.push("/todo-list-done")} icon={<TrophyOutlined />} />}
                    />
                </Spin>
                <HomeTips />
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
