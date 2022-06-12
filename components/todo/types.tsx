import { ImgType } from "../preview-images";

const obj = {
    cTime: "2022-04-15 17:07:39",
    category: "需求",
    child_todo_list: [],
    color: "1",
    description: "",
    imgList: [],
    name: "交换共享：下一个需求，搜索优化&附件",
    other_id: "",
    status: "0",
    time: "2022-04-18",
    todo_id: "53ec86bd-994e-4c46-8ebd-5f2c765d5304",
    username: "zyb",
    doing: '0'
};
type Obj = typeof obj;
export interface TodoType extends Obj {
    child_todo_list: Obj[];
    imgList: ImgType[];
};
