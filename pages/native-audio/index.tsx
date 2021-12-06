import Header from "../../components/header";
import Link from "next/link";
import styles from "./index.module.scss";
import { GetMediaList } from "../../service";
import { useEffect, useState } from "react";
import { Button } from "antd";
import MusicPlayerComp from "../../components/music-player";

const obj = {
    key: "杨宗纬 - 我离开我自己 (Live).flac",
    mimeType: "audio/flac",
};

type MusicType = typeof obj;

export interface MusicListType extends MusicType {
    name: string;
    url: string;
}

const cdnUrl = "http://cdn.xiaxiazheng.cn";
const hCdnUrl = "http://hcdn.xiaxiazheng.cn";

let p = null;

const MusicPlayer = () => {
    const [list, setList] = useState<MusicListType[]>([]);

    const getData = async () => {
        const res: any = await GetMediaList();
        const resdata = await res.json();
        const data: MusicType[] = resdata.data;

        const username = localStorage.getItem("username");
        const url = username === "zyb" ? cdnUrl : hCdnUrl;
        setList(
            data
                .filter((item) => item.mimeType.indexOf("audio") !== -1)
                .map((item: MusicType) => {
                    return {
                        name: item.key,
                        url: `${url}/${item.key}`,
                        key: item.key,
                        mimeType: item.mimeType,
                    };
                })
        );
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        // 扩展API加载完毕后调用onPlusReady回调函数
        document.addEventListener("plusready", onPlusReady, false);
    }, []);

    // 扩展API加载完毕，现在可以正常调用扩展API
    function onPlusReady() {
    }

    function startRecord() {
        if ((window as any).plus?.audio == undefined) {
            alert("Device not ready!");
        }
        p = (window as any).plus?.audio.createPlayer(list[0].url);
        p.play(
            function () {
                alert("Audio play success!");
            },
            function (e) {
                alert("Audio play error: " + e.message);
            }
        );
    }
    function stopRecord() {
        p.stop();
    }

    return (
        <>
            <Header title="音乐播放器" />
            <main>
                <div className={styles.musicPlayer}>
                    <Button onClick={() => startRecord()}>start</Button>
                    <Button onClick={() => stopRecord()}>stop</Button>
                </div>
            </main>
        </>
    );
};

export default MusicPlayer;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
