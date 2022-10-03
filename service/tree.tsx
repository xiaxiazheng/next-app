import { getFetch, postFetch } from ".";

export const getAllTreeList = async () => {
    const res = await getFetch(`/tree/getAllTreeList`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getNodeCont = async (id: string) => {
    const res = await getFetch(`/treeCont/cont?id=${id}`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const modifyNodeContItem = async (params: any) => {
    const res = await postFetch(`/treeCont/modifyNodeContItem`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};
