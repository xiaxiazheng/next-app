import { ImgType } from "../preview-images";

const obj = {
    category: "公司",
    color: "1",
    description: "",
    name: "文档填写",
    status: "0",
    time: "2021-09-13",
    todo_id: "92f77eff-69fd-4dc6-9fdd-6e6c6b097bdc",
    username: "zyb",
};
type Obj = typeof obj;
export interface TodoType extends Obj {
    imgList: ImgType[];
};
