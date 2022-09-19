import { getFetch, postFetch } from ".";

// 从接口拿到的数据类型
export interface ImageType {
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

// 项目中使用的稍微拓展过的类型
export interface ImgType extends ImageType {
    imageMinUrl: string;
    imageUrl: string;
}

export const getImageListByOtherId = async (otherId: string, username: string): Promise<ImageType[] | false> => {
    const res = await getFetch(`/image/getImgListByOtherId?otherId=${otherId}&username=${username}`);
    if (res) {
        const data = await res.json();
        return data.data;
    } else {
        return false;
    }
};
