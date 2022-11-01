import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./index.module.scss";
import { Button, Input, message, Space, Spin } from "antd";
import { AddNote, GetNoteList } from "../../service";
import useScrollToHook from "../../hooks/useScrollToHooks";
import MyDrawer from "../../components/my-drawer";

const { TextArea } = Input;
const placeholder = "-----------";

interface ICMD {}

const CMD: React.FC<ICMD> = (props) => {
    const [cmd, setCmd] = useState<string>("pwd");
    const [result, setResult] = useState<string>(placeholder);
    const [loading, setLoading] = useState<boolean>(false);

    const submit = async () => {
        if (!cmd) return;
        setLoading(true);

        const str = cmd
            .split("\n")
            .filter((item) => !(!item || /^#/.test(item)))
            .join("&&");

        pushResult(`-> ${str}`);

        try {
            ref?.current?.send(
                JSON.stringify({
                    event: "cmd",
                    data: str,
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const [list, setList] = useState<any>([]);
    const getScript = async () => {
        setLoading(true);

        const params: any = {
            pageNo: 1,
            pageSize: 100,
            category: "脚本",
            keyword: "",
        };
        const res = await GetNoteList(params);
        if (res) {
            setList(res?.data?.list || []);
        }
        setLoading(false);
    };
    useEffect(() => {
        getScript();
    }, []);

    const saveScript = async () => {
        const params = {
            category: "脚本",
            note: cmd,
        };
        const res = await AddNote(params);
        if (res) {
            message.success("保存脚本成功");
            getScript();
        } else {
            message.error("保存脚本失败");
        }
    };

    const pushResult = (str: string) => {
        setResult((prev) => `${prev}\n${str}`);
        // 滚动到底部
        scrollToBottom();
    };

    const ref = useRef<any>(null);

    const resultRef = useRef<any>(null);
    const { scrollToBottom } = useScrollToHook(resultRef);

    // 链接 websocket
    const connectWS = () => {
        const websocket = new WebSocket("wss://www.xiaxiazheng.cn/websocket");
        ref.current = websocket;
        websocket.onopen = function () {
            pushResult(`websocket open`);
            setIsConnect(true);
        };
        websocket.onclose = function () {
            pushResult(`websocket close`);
            setIsConnect(false);
        };
        websocket.onmessage = function (e) {
            pushResult(
                `${JSON.parse(e.data)?.data?.replaceAll(`\\n"`, "").replaceAll(`"`, "").replaceAll("\\n", "\n") || ""}`
            );
        };
    };

    useEffect(() => {
        connectWS();
    }, []);

    const [visible, setVisible] = useState<boolean>(false);

    const [isConnect, setIsConnect] = useState<boolean>(false);

    return (
        <div className={styles.cmd}>
            <div>
            <Spin spinning={loading}>
                    <div className={styles.result} ref={resultRef}>
                        {result}
                    </div>
                </Spin>
                <div className={styles.operator}>
                    <Space size={10}>
                        <Button type="primary" onClick={() => submit()}>
                            执行
                        </Button>
                        <Button onClick={() => setResult(placeholder)}>清空</Button>
                    </Space>
                    <Space size={10}>
                        <Button onClick={() => connectWS()} danger={!isConnect}>
                            重连
                        </Button>
                        <Button onClick={() => saveScript()}>保存</Button>
                        <Button onClick={() => setVisible(true)} type="primary">
                            预设
                        </Button>
                    </Space>
                </div>
                <TextArea className={styles.input} value={cmd} onChange={(e) => setCmd(e.target.value)} rows={6} />
                {/* <div style={{ marginTop: 20 }}>结果：</div> */}
            </div>
            <MyDrawer title="预设脚本" visible={visible} onCancel={() => setVisible(false)}>
                <div className={styles.script}>
                    {list?.map((item: any) => {
                        return (
                            <div
                                className={styles.scriptItem}
                                key={item.note_id}
                                onClick={() => {
                                    setCmd(item.note);
                                    setVisible(false);
                                }}
                            >
                                {item.note}
                            </div>
                        );
                    })}
                </div>
            </MyDrawer>
        </div>
    );
};

export default CMD;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
