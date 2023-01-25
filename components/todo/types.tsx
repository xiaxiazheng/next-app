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

export interface FileType {
    cTime: string
    file_id: string
    filename: string
    originalname: string
    other_id: string
    type: string
    username: string
    size: string
  }

export interface TodoItemType {
    todo_id: string;
    time: string;
    description: string;
    name: string;
    status: number | string;
    color: string;
    category: string;
    other_id?: string;
    cTime?: string;
    doing: "0" | "1";
    mTime?: string;
    isNote?: "0" | "1";
    isTarget?: "0" | "1";
    isBookMark?: "0" | "1";

    imgList: ImageType[];
    fileList: FileType[];
    other_todo: TodoItemType;
    child_todo_list: TodoItemType[];
    child_todo_list_length: number;
}

export interface CreateTodoItemReq {
    time: string;
    description: string;
    name: string;
    status: number | string;
    color: string;
    category: string;
    other_id?: string;
    doing: "0" | "1";
    isNote: "0" | "1";
}

export interface EditTodoItemReq extends CreateTodoItemReq {
    todo_id: string;
}

export type OperatorType = 'add' | 'progress' | 'edit' | 'copy' | 'add-note';

export const operatorMap = {
  progress: '添加进度',
  edit: '编辑',
  copy: '复制',
  add: '新增'
}
