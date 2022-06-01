import router from "next/router";

export const goBack = () => {
    if (document.referrer) {
        router.push(document.referrer.split("/m")?.[1]);
    } else {
        router.back();
    }
};
