import { getFetch, postFetch } from ".";

export const GetBlogList = async (params) => {
    const res = await postFetch(`/blog/getAllBlogList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

// 获取文件夹
export const getFolder = async (parentId: string, username: string) => {
    const res = await getFetch(`/folder/getFolder?parentId=${parentId}&username=${username}`);
    if (res) {
        const data = await res.json();
        return data;
    } else {
        return false;
    }
};

// 新增文件夹
export const addFolder = async (params: any) => {
    const res = await postFetch(`/folder/addFolder`, params);
    if (res) {
        const data = await res.json();
        return data;
    } else {
        return false;
    }
};

export const getMediaList = async () => {
    const res = await getFetch(`/media/getMediaList`);
    if (res) {
        const data = await res.json();
        return data;
    } else {
        return false;
    }
};