import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { staticUrl } from "../../service";
import { handleSize } from "../upload-image";
// import AffixClose from "../affix/affix-close";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
import localforage from "localforage";

export interface ImgType {
    cTime: string;
    filename: string;
    has_min: "0" | "1"; // 是否有缩略图
    img_id: string;
    imgname: string;
    other_id: string;
    type: string;
    username: string;
    size: string;
    imageUrl: string;
    imageMinUrl: string;
}

interface Props {
    imagesList: ImgType[];
}

const PreviewImages: React.FC<Props> = (props) => {
    const { imagesList } = props;

    const [list, setList] = useState<ImgType[]>([]);

    useEffect(() => {
        if (imagesList) {
            handImageData(imagesList);
        }
    }, [imagesList]);

    const handImageData = async (imagesList: ImgType[]) => {
        const promiseList = imagesList.map(async (img) => {
            const url = `${staticUrl}/img/${img.type}/${img.filename}`;
            const imageUrl = await handleOnload(img.imageUrl, img.img_id);

            return {
                ...img,
                imageMinUrl: img.has_min === "1" ? `${staticUrl}/min-img/${img.filename}` : imageUrl, // 缩略图地址
                imageUrl
            }
        });
        setList(await Promise.all(promiseList));
    };

    // 将 image 对象变成 canvas 对象
    function imagetoCanvas(image) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");
        cvs.width = image.width;
        cvs.height = image.height;
        ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
        return cvs;
    }

    // 将 canvas 变成 blob
    const canvasResizetoBlob = async (canvas) => {
        return new Promise((resolve) => {
            canvas.toBlob(
                function (blob) {
                    resolve(blob);
                }
                // imageType,
                // quality
            );
        });
    };

    // 将 canvas 变成 blob
    const canvasResizetoDataUrl = (canvas) => {
        return canvas.toDataURL();
    };

    const handleImageToBase64 = (src: string) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = (e) => {
                const canvas = imagetoCanvas(e.target);
                const base64 = canvasResizetoDataUrl(canvas);
                resolve(base64);
            };
            img.crossOrigin = ""; // 让图片可以跨域，不会触发 canvas 的 CORS
            img.src = src;
        });
    };

    const handleOnload = async (src: string, img_id: string) => {
        const cache = await localforage.getItem(img_id);
        console.log("cache", cache);
        if (cache) {
            // return cache;
            return src;
        } else {
            const base64 = (await handleImageToBase64(src)) as string;
            localforage.setItem(img_id, base64);
            return base64;
        }
    };

    return (
        <PhotoProvider maskClosable={true}>
            {list.map((img, index) => {
                <PhotoConsumer
                    key={index}
                    src={img.imageUrl}
                    intro={
                        <>
                            <div>{img.imgname}</div>
                            <div>{handleSize(Number(img.size))}</div>
                            <div>{img.cTime}</div>
                        </>
                    }
                >
                    <img className={styles.min_img} src={img.imageMinUrl} alt="" />
                </PhotoConsumer>;
            })}
        </PhotoProvider>
    );
};

export default PreviewImages;
