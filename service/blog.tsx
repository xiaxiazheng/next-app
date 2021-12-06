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

export const GetBlogCont = async (id: string) => {
    const res = await getFetch(`/blog/getBlogcont?id=${id}`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};