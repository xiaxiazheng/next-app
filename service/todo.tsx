import { getFetch, postFetch } from ".";

export enum TodoStatus {
    todo = 0,
    done = 1,
    pool = 2,
}

export const GetTodo = async () => {
    const params = {
        status: TodoStatus.todo,
    };
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const GetTodoById = async (todo_id) => {
    const res: any = await getFetch(`/todo/getTodoById?todo_id=${todo_id}`);
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

export const getTodoList = async (params: any) => {
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoDone = async ({ keyword, pageNo, category }) => {
    const params = {
        status: TodoStatus.done,
        keyword,
        pageNo,
    };
    if (category) {
        params["category"] = category;
    }
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTodoBookMark = async () => {
    const params: any = {
        isBookMark: "1",
        pageNo: 1,
        pageSize: 100,
    };
    const res = await postFetch(`/todo/getTodoList`, params);;
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
}

export const getTodoTarget = async () => {
    const params: any = {
        isTarget: "1",
        pageNo: 1,
        pageSize: 100,
    };
    const res = await postFetch(`/todo/getTodoList`, params);;
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
}

export const GetTodoPool = async () => {
    const params = {
        status: TodoStatus.pool,
    };
    const res: any = await postFetch(`/todo/getTodoList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const GetTodoCategory = async (params?: { isNote?: string }) => {
    return await getFetch(`/todo/getTodoCategory${params?.isNote ? `?isNote=${params.isNote}` : ""}`);
};

export const AddTodoItem = async (params) => {
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
