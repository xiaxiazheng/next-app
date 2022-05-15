import { postFetch } from ".";

export const login = async ({ username, password }) => {
    const params = {
        username,
        password,
    };
    const res: any = await postFetch(`/auth/login`, params);
    if (res) {
        const data = await res.json();
        localStorage.setItem("token", data.refresh_token);
        localStorage.setItem("username", username);
        return true;        
    } else {
        return false;
    }
};