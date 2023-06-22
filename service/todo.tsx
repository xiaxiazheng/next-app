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

const getIsWork = () => {
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

export const getTodoDone = async ({ keyword, pageNo, category }): Promise<TodoRes | false> => {
    const params = {
        status: TodoStatus.done,
        keyword,
        pageNo,
    };
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

export const getTodoBookMark = async (): Promise<TodoRes | false> => {
    const params: any = {
        isBookMark: "1",
        pageNo: 1,
        pageSize: 100,
    };
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoPunchTheClock = async (): Promise<TodoRes | false> => {
    const params: any = {
        isPunchTheClock: "1",
        pageNo: 1,
        pageSize: 100,
    };
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoTarget = async (): Promise<TodoRes | false> => {
    const params: any = {
        isTarget: "1",
        pageNo: 1,
        pageSize: 100,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
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

export const getTodoFootprint = async (): Promise<TodoRes | false> => {
    const params: any = {
        pageNo: 1,
        pageSize: 30,
        sortBy: [["mTime", "DESC"]],
    };
    const res = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoPool = async (): Promise<TodoRes | false> => {
    const params = {
        status: TodoStatus.pool,
        pageSize: 200,
        sortBy: [["color"], ["isWork", "DESC"], ["category"]],
    };
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoCategory = async (params?: { isNote?: string }) => {
    return await getFetch(`/todo/getTodoCategory${params?.isNote ? `?isNote=${params.isNote}` : ""}`);
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
