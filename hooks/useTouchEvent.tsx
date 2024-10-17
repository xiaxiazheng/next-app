import { useEffect, useReducer, useState } from "react";
import TouchEventClass from "../utils/touch-event";

let touchEvent: TouchEventClass;

const useTouchEvent = () => {
    // 类库的状态变化时，用这个来强刷 React 的视图
    const [, forceUpdate] = useReducer((s) => s + 1, 0);
    // const [number, setNumber] = useState(0);

    if (!touchEvent) {
        touchEvent = new TouchEventClass();
    }

    useEffect(() => {
        // 初始化touch事件
        touchEvent.init();
        touchEvent.setForceUpdate(() => {
            // forceUpdate?.();
            forceUpdate();
            // setNumber((prev) => prev + 1);
            console.log("force update");
        });
    }, []);

    return { touchEvent };
};

export default useTouchEvent;
