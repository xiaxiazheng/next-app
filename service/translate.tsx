import { getFetch, postFetch } from ".";

export const getTranslate = async (keyword: string) => {
    const params = {
        keyword
    }
    const res = await postFetch(`/translate/translate`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const getTranslateList = async (params: {
    keyword?: string,
    pageNo: number,
    pageSize?: number
    isMark?: number
}) => {
    const res: any = await postFetch(`/translate/getTranslateList`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const switchTranslateMark = async (translate_id: string, isMark: number) => {
    const params = {
        translate_id,
        isMark
    };
    const res: any = await postFetch(`/translate/switchTranslateMark`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};

export const deleteTranslateItem = async (translate_id: string) => {
    const params = {
        translate_id
    };
    const res: any = await postFetch(`/translate/deleteTranslateItem`, params);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};
