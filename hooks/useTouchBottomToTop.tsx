import { useEffect, useRef, useState } from "react";

interface Params {
    spanX?: number;
    spanY?: number;
    onChange: Function;
    isReverse?: boolean;
    tipsText?: string;
    canListen?: boolean;
}

let bottomTopList = [];
let topBottomList = [];

const useTouchBottomToTop = (
    { spanX = 100, spanY = 160, onChange, isReverse = false, canListen = true, tipsText = "" }: Params,
    listener: any[]
) => {
    const judgeCanRun = () => {
        if (isReverse) {
            if (topBottomList.length !== 0 && topBottomList[topBottomList.length - 1] === tipsText) {
                return true;
            }
        }
        if (!isReverse) {
            if (bottomTopList.length !== 0 && bottomTopList[bottomTopList.length - 1] === tipsText) {
                return true;
            }
        }
        return false;
    }

    const handleJudge = (x: number, y: number) => {
        if (handleReverse(ref.current.y - y) >= spanY && Math.abs(ref.current.x - x) < spanX) {
            if (judgeCanRun()) {
                onChange();
            }
        }
    };

    const handleReverse = (num: number) => {
        return isReverse ? num * -1 : num;
    };

    const ref = useRef<any>({
        x: 0,
        y: 0,
    });
    const isStart = useRef<any>(false);

    const handleStart = (e: TouchEvent) => {
        ref.current = {
            x: e.targetTouches?.[0].pageX,
            y: e.targetTouches?.[0].pageY,
        };
        isStart.current = true;
    };

    const handleEnd = (e: TouchEvent) => {
        handleJudge(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY);
        isStart.current = false;
        setIsShow(false);
    };

    const handleMove = (e: TouchEvent) => {
        const moveY = handleReverse(ref.current.y - e.targetTouches?.[0].pageY);
        setX(ref.current.x - e.targetTouches?.[0].pageX);
        setY(moveY);
        if (isStart.current) {
            moveY > 100 ? setIsShow(true) : setIsShow(false);
        }
    };

    useEffect(() => {
        if (canListen) {
            !isReverse && bottomTopList.push(tipsText);
            isReverse && topBottomList.push(tipsText);
            console.log('listener bottom to top', isReverse);
            document.addEventListener("touchstart", handleStart);
            document.addEventListener("touchend", handleEnd);
            document.addEventListener("touchmove", handleMove);

            console.log('bottomTopList', bottomTopList);
            console.log('topBottomList', topBottomList);
        }

        return () => {
            !isReverse && (bottomTopList = bottomTopList.filter(item => item !== tipsText));
            isReverse && (topBottomList = topBottomList.filter(item => item !== tipsText));
            document.removeEventListener("touchstart", handleStart);
            document.removeEventListener("touchend", handleEnd);
            document.removeEventListener("touchmove", handleMove);

            console.log('bottomTopList', bottomTopList);
            console.log('topBottomList', topBottomList);
        };
    }, [...listener, canListen]);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    return (
        isShow && judgeCanRun() && (
            <div
                style={{
                    position: "fixed",
                    top: "50vh",
                    left: "50vw",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    background: y >= spanY && Math.abs(x) < spanX ? "#1bbb1b" : "#d9363e",
                    borderRadius: 8,
                    zIndex: 1001,
                    padding: "5px 10px",
                }}
            >
                <div>x: {x.toFixed(0)}</div>
                <div>y: {y.toFixed(0)}</div>
                <div>{tipsText}</div>
            </div>
        )
    );
};

export default useTouchBottomToTop;
