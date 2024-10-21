import { useEffect } from "react";
import TouchEventClass from "../utils/touch-event";
import useSettings from "./useSettings";

let touchEvent: TouchEventClass;
let isInit = false;

const useTouchEvent = () => {
    const settings = useSettings();
    const touchSafeXY = settings?.touchSafeXY; // 获取 settings 配置

    if (!touchEvent) {
        // 创建实例，用全局变量 touchEvent 保证只会有一个实例
        touchEvent = new TouchEventClass();
    }

    useEffect(() => {
        if (!isInit) {
            // 初始化 touch 监听事件，因为 window 对象的缘故，所以需要在 useEffect 里包裹
            touchEvent.init();
            isInit = true;
        }
    }, []);

    useEffect(() => {
        if (touchSafeXY) {
            touchEvent.setSafeXY(touchSafeXY); // 将 settings 的配置写入 class 实例
        }
    }, [touchSafeXY]);

    return touchEvent; // 返回唯一的实例给所有使用的地方
};

export default useTouchEvent;
