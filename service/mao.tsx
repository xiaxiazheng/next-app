import { getFetch } from ".";

export const getMaoList = async (): Promise<any> => {
    const res = await getFetch(`/maopu/getMaoPuList`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
};
