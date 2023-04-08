import { message, notification } from "antd";

export * from "./login";
export * from "./todo";
export * from "./blog";
export * from "./note";
export * from "./translate";
export * from "./tree";

const serverUrl =
    process.env.NEXT_PUBLIC_IS_LOCAL === "YES" ? "http://localhost:300/api" : "https://www.xiaxiazheng.cn/api";
export const staticUrl =
    process.env.NEXT_PUBLIC_IS_LOCAL_STATIC === "YES"
        ? "https://www.xiaxiazheng.cn:2333"
        : "https://www.xiaxiazheng.cn/static-server";

export const getFetch = async (url) => {
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const token = localStorage.getItem("token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }

        const res: any = await fetch(`${serverUrl}${url}`, {
            method: "get",
            headers,
            mode: "cors",
        });

        if (res.status === 401) {
            message.warning("登录已过期，请重新登录", 2);
            location.href = `${location.origin}/m/login`;
            return false;
        }

        if (res.status === 200 || res.status === 201) {
            return res;
        }

        message.warning(`${res.status}: ${res.statusText}`);
        return false;
    } catch (err) {
        notification.error(err);
        return false;
    }
};

export const postFetch = async (url, params) => {
    try {
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        const token = localStorage.getItem("token");
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }

        const res: any = await fetch(`${serverUrl}${url}`, {
            method: "post",
            headers,
            body: JSON.stringify(params),
            mode: "cors",
        });

        if (res.status === 401) {
            message.warning("401: 登录已过期，请重新登录", 2);
            location.href = `${location.origin}/m/login`;
            return false;
        }

        if (res.status === 200 || res.status === 201) {
            return res;
        }

        message.warning(`${res.status}: ${res.statusText}`);
        return false;
    } catch (err) {
        notification.error(err);
        return false;
    }
};

export const GetMediaList = async () => {
    return await getFetch(`/media/getMediaList`);
};
