import { FileType } from "../../service/file";
import { ImageType } from "../../service/image";

export interface Mao {
    appearance: string;
    birthday: string;
    description: string;
    father: string;
    feature: string;
    head_img_id: string;
    mao_id: string;
    mother: string;
    name: string;
    mother_id: string;
    father_id: string;
    status: string;
    remarks: string;
    children?: Mao[];
    headImgList: ImageType[];
    imgList: ImageType[];
    fileList: FileType[];
}

export interface IMao extends Mao {
    key: string;
    title: string;
    children: IMao[];
    fatherObject: IMao;
    motherObject: IMao;
}
