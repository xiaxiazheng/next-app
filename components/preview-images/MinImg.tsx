/**
 * 实现了缩略图的逻辑，封装器交叉选择器的逻辑
 */
import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import "react-photo-view/dist/index.css";
import { handleOnloadImage } from "./utils";
import { ImgType } from "./";

interface IProps {
    ref: any;
    img: ImgType;
    setImg: any;
}

// 缩略图，采用交叉观察者
const MinImg: React.FC<IProps> = React.forwardRef((props, ref: any) => {
    const { img, setImg, ...rest } = props;
    const { imageMinUrl, img_id, imgname } = img;

    const [url, setUrl] = useState("/loading.svg");
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        let observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((item) => {
                    if (!isShow && item.isIntersecting) {
                        setIsShow(true);
                        onloadImage();
                    }
                });
            },
            {
                root: null,
            }
        );
        if (ref?.current) {
            observer.observe(ref.current);
        }
    }, [ref]);

    const onloadImage = async () => {
        const url = await handleOnloadImage(imageMinUrl, `min_${img_id}`, imgname);
        setImg({
            ...img,
            imageMinUrl: url,
        });
        setUrl(url);
    };

    return <img className={styles.min_img} src={url} ref={ref} {...rest} />;
});

export default MinImg;
