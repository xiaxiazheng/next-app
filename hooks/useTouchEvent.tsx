import { useEffect } from "react";
import TouchEventClass from "../utils/touch-event";

let touchEvent: TouchEventClass;

const useTouchEvent = () => {
    if (!touchEvent) {
        touchEvent = new TouchEventClass();
    }

    useEffect(() => {
        // 初始化touch事件
        touchEvent.init();
    }, []);

    return touchEvent;
};

export default useTouchEvent;
