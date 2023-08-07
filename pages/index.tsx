import Header from "../components/common/header";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, message, Spin } from "antd";
import { useRouter } from "next/router";
import { getTodo } from "../service";
import TodoDayList from "../components/todo/todo-day-list";
// import HomeTips from "../components/common/home-tips";

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

    const [keyword, setKeyword] = useState<string>("");
    const search = () => {
        router.push(`/todo-list-done?keyword=${keyword}`);
    };

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
                        search={
                            <Input.Search
                                className={styles.search}
                                placeholder="输入搜索已完成 todo"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                enterButton
                                allowClear
                                onSearch={() => {
                                    search();
                                }}
                            />
                        }
                    />
                </Spin>
                <div className={styles.beforeToday} onClick={() => { router.push('/today-before-years')}}>看看往年今天?</div>
                {/* <HomeTips /> */}
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
