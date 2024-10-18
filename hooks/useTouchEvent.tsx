import { useEffect } from "react";
import TouchEventClass from "../utils/touch-event";
import useSettings from "./useSettings";

let touchEvent: TouchEventClass;

const useTouchEvent = () => {
    const settings = useSettings();
    const touchSafeXY = settings?.touchSafeXY;

    if (!touchEvent) {
        touchEvent = new TouchEventClass();
    }

    useEffect(() => {
        // 初始化touch事件
        touchEvent.init();
    }, []);

    useEffect(() => {
        if (touchSafeXY) {
            touchEvent.setSafeXY(touchSafeXY);
        }
    }, [touchSafeXY]);

    return touchEvent;
};

export default useTouchEvent;
