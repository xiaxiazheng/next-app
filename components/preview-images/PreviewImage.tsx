/**
 * 控制单个图片的状态，主要还是为了状态自治
 * 还有实现了查看 & 下载原图
 */
import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { handleSize } from "../upload-image";
import { PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { handleOnloadImage } from "./utils";
import MinImg from "./MinImg";
import { ImgType } from "./";

interface IProps {
  image: ImgType;
}

const PreviewImage: React.FC<IProps> = (props) => {
    const { image } = props;

    // 这里各个 image 的状态必须自治，不能统一去修改传入的 list，不然由于副作用里的异步的原因，会导致每次最后的那次修改会覆盖前面的所有的修改
    const [img, setImg] = useState(image);
    const [loading, setLoading] = useState<boolean>(false);

    // 是否显示原图
    const [isShowOrigin, setIsShowOrigin] = useState(false);

    // 查看原图
    const handlePreviewOrigin = async (img_id: string, imageUrl: string, imgname: string) => {
        setLoading(true);
        const url = await handleOnloadImage(imageUrl, img_id, imgname);

        setImg({
            ...img,
            imageUrl: url,
        });
        setIsShowOrigin(true);
        setLoading(false);
    };

    // 下载原图
    const handleDownload = async (img_id: string, imageUrl: string, imgname: string) => {
        const url = await handleOnloadImage(imageUrl, img_id, imgname);

        const a = document.createElement("a");
        a.download = imgname;
        a.href = url;
        a.click();
    };

    return (
        <PhotoConsumer
            key={img.img_id}
            src={isShowOrigin ? img.imageUrl : img.imageMinUrl}
            intro={
                <div className={styles.imageInfo}>
                    <div>
                        <div>{img.imgname}</div>
                        <div>{handleSize(Number(img.size))}</div>
                        <div>{img.cTime}</div>
                    </div>
                    <div className={styles.infoIcons}>
                        {!isShowOrigin && (
                            <Button
                                onClick={() => handlePreviewOrigin(img.img_id, img.imageUrl, img.imgname)}
                                type="primary"
                            >
                                {loading ? "加载中..." : "查看原图"}
                            </Button>
                        )}
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(img.img_id, img.imageUrl, img.imgname)}
                        />
                    </div>
                </div>
            }
        >
            <span>
                <MinImg
                    img={img}
                    setImg={setImg}
                />
            </span>
        </PhotoConsumer>
    );
};

export default PreviewImage;
