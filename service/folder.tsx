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
