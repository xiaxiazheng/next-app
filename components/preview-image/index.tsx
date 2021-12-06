import React, { useState } from "react";
import styles from "./index.module.scss";
import { staticUrl } from "../../service";
import { handleSize } from "../upload-image";
import AffixClose from "../../components/affix/affix-close";

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
}

interface Props {
    img: ImgType;
}

const PreviewImage: React.FC<Props> = (props) => {
    const { img } = props;

    const imageUrl = `${staticUrl}/img/${img.type}/${img.filename}`; // 图片地址
    const imageMinUrl = img.has_min === "1" ? `${staticUrl}/min-img/${img.filename}` : imageUrl; // 缩略图地址

    const [isShowPreview, setIsShowPreview] = useState<boolean>(false);

    return (
        <>
            <img
                className={styles.min_img}
                src={imageMinUrl}
                alt={img.filename}
                onClick={() => setIsShowPreview(true)}
            />
            {isShowPreview && (
                <div className={styles.mask} onClick={() => setIsShowPreview(false)}>
                    <div>{img.imgname}</div>
                    <img
                        className={styles.origin_img}
                        src={imageUrl}
                        alt={img.filename}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div>{handleSize(Number(img.size))}</div>
                    <div>{img.cTime}</div>
                    <AffixClose close={() => setIsShowPreview(false)} />
                </div>
            )}
        </>
    );
};

export default PreviewImage;
