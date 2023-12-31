import { getFetch } from ".";

/** 操作 settings */
export async function getSettings(): Promise<any> {
    const res = await getFetch(`/settings/getSettings`);
    if (res) {
        const data = res.json();
        return data;
    } else {
        return false;
    }
}
