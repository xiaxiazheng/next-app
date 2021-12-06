import { ImgType } from "../preview-image";

export type NoteType = {
    cTime: string;
    mTime: string;
    note: string;
    note_id: string;
    username: string;
    category: string;
    imgList: ImgType[];
};
