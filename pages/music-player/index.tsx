import Header from "../../components/common/header";
import styles from "./index.module.scss";
import { GetMediaList } from "../../service";
import { useEffect, useState } from "react";
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

const MusicPlayer = () => {
    const [list, setList] = useState<MusicListType[]>([]);

    const getData = async () => {
        const res: any = await GetMediaList();
        const resData = await res.json();
        const data: MusicType[] = resData.data;

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

    return (
        <>
            <Header title="音乐播放器" />
            <main>
                <div className={styles.musicPlayer}>
                    <MusicPlayerComp list={list} />
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
