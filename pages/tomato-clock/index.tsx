import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { Button, Input, message, Space } from "antd";
import { useEffect, useState } from "react";
import useCountDown from "../../hooks/useCountDown";
import { calculateTime, playAudio } from "../../components/tomato-clock/utils";

const initialTime = 25;

const renderTime = (time: number) => {
    const t = calculateTime(time);
    return (
        <span className={styles.renderTime}>
            <span>
                {t.hour < 10 && "0"}
                {t.hour}
            </span>
            <span>:</span>
            <span>
                {t.minute < 10 && "0"}
                {t.minute}
            </span>
            <span>:</span>
            <span>
                {t.second < 10 && "0"}
                {t.second}
            </span>
        </span>
    );
};

const TomatoClock = () => {
    const [during, setDuring] = useState<number>(initialTime);

    const [isStart, setIsStart] = useState<boolean>(false);
    const [isCounting, setIsCounting] = useState<boolean>(false);

    const [timeLeft, { start, pause, resume, reset }] = useCountDown(during * 60 * 1000);

    const [target, setTarget] = useState<string>("");

    useEffect(() => {
        // 倒计时结束
        if (isStart && timeLeft === 0) {
            playAudio();
            message.success("倒计时结束啦~")
            setIsStart(false);
            setIsCounting(false);
        }
    }, [timeLeft]);

    return (
        <>
            <Header title={"番茄时钟"} />
            <main>
                <div className={styles.content}>
                    {!isCounting && (
                        <Space direction="vertical" className={styles.config}>
                            <Input
                                prefix="倒计时时长："
                                suffix="(分钟)"
                                type="number"
                                value={during}
                                onChange={(e) => setDuring(Number(e.target.value))}
                            />
                            <Space className={styles.operator}>
                                <Button type="primary" onClick={() => setDuring(25)}>
                                    25
                                </Button>
                                <Button type="primary" onClick={() => setDuring(60)}>
                                    60
                                </Button>
                                <Button type="primary" onClick={() => setDuring(120)}>
                                    120
                                </Button>
                            </Space>
                            <Input prefix="一句话目标：" value={target} onChange={(e) => setTarget(e.target.value)} />
                        </Space>
                    )}
                    {target && <div className={styles.target}>{target}</div>}
                    <div>{renderTime(timeLeft || during * 60 * 1000)}</div>
                    <Space className={styles.operator}>
                        {!isStart && !isCounting && (
                            <Button
                                onClick={() => {
                                    start();
                                    setIsStart(true);
                                    setIsCounting(true);
                                }}
                                size="large"
                                type="primary"
                            >
                                开始
                            </Button>
                        )}
                        {isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    pause();
                                    setIsStart(false);
                                    setIsCounting(true);
                                }}
                                style={{ opacity: 0.5 }}
                            >
                                暂停
                            </Button>
                        )}
                        {!isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    resume();
                                    setIsStart(true);
                                    setIsCounting(true);
                                }}
                                type="primary"
                            >
                                恢复
                            </Button>
                        )}
                        {!isStart && isCounting && (
                            <Button
                                onClick={() => {
                                    reset();
                                    setIsStart(false);
                                    setIsCounting(false);
                                }}
                                danger
                            >
                                重置
                            </Button>
                        )}
                    </Space>
                </div>
            </main>
        </>
    );
};

export default TomatoClock;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
