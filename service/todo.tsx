import { getFetch, postFetch } from ".";
import { CreateTodoItemReq, TodoItemType } from "../components/todo/types";

export enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}

export interface TodoRes {
    data: { list: TodoItemType[]; total: number };
}

export const getIsWork = () => {
    if (localStorage.getItem("WorkOrLife")) {
        return localStorage.getItem("WorkOrLife");
    }
    return "";
};

export const getTodo = async (): Promise<TodoRes | false> => {
    const params = {
        status: TodoStatus.todo,
        isTarget: "0",
        isBookMark: "0",
        isFollowUp: "0",
        pageSize: 100,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoById = async (todo_id: string, isFindAllLevelChild: boolean = false) => {
    const res: any = await getFetch(
        `/todo/getTodoById?todo_id=${todo_id}${
            isFindAllLevelChild ? `&isFindAllLevelChild=${isFindAllLevelChild}` : ""
        }`
    );
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

/** 获取所有前置 todo，根据 other_id 一路往上查 */
export async function getTodoChainById(todo_id: string): Promise<any> {
    const res = await getFetch(`/todo/getTodoChainById?todo_id=${todo_id}`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
}

export const getTodoList = async (params: any): Promise<TodoRes | false> => {
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoDone = async (obj: any): Promise<TodoRes | false> => {
    const { status, keyword, pageNo, category, ...rest } = obj;
    const params = {
        keyword,
        pageNo,
        ...rest,
    };
    if (status) {
        params["status"] = status;
    }
    if (category) {
        params["category"] = category;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoPool = async (obj: any = {}): Promise<TodoRes | false> => {
    const params = {
        status: TodoStatus.pool,
        pageSize: 200,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
        ...obj,
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoFollowUp = async () => {
    const params: any = {
        isFollowUp: "1",
        pageNo: 1,
        pageSize: 60,
        // status: TodoStatus["todo"],
    };

    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoBookMark = async (): Promise<TodoRes | false> => {
    const params: any = {
        isBookMark: "1",
        pageNo: 1,
        pageSize: 100,
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoHabit = async (obj: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        isHabit: "1",
        pageNo: 1,
        pageSize: 60,
    };
    const { status } = obj;
    if (typeof status === "number") {
        params["status"] = status;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoTarget = async (obj: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        isTarget: "1",
        pageNo: 1,
        pageSize: 60,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
    };
    const { status } = obj;
    if (typeof status === "number") {
        params["status"] = status;
    }
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoFootprint = async (rest: any = {}): Promise<TodoRes | false> => {
    const params: any = {
        pageNo: 1,
        pageSize: 30,
        sortBy: [["mTime", "DESC"]],
        ...rest
    };
    const isWork = getIsWork();
    if (isWork !== "") {
        params["isWork"] = isWork;
    }
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoCategory = async (params?: { isNote?: string }) => {
    const isWork = getIsWork();
    return await getFetch(
        `/todo/getTodoCategory?${params?.isNote ? `isNote=${params.isNote}&` : ""}${isWork ? `isWork=${isWork}` : ""}`
    );
};

export const AddTodoItem = async (params: CreateTodoItemReq) => {
    const res: any = await postFetch(`/todo/addTodoItem`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const EditTodoItem = async (params) => {
    const res: any = await postFetch(`/todo/editTodoItem`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const DoneTodoItem = async (params) => {
    const res: any = await postFetch(`/todo/doneTodoItem`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};
