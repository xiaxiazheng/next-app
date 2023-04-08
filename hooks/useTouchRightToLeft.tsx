import { useEffect, useRef, useState } from "react";

interface Params {
    spanX?: number;
    spanY?: number;
    onChange: Function;
    isReverse?: boolean;
}

const useTouchRightToLeft = ({ spanX = 160, spanY = 100, onChange, isReverse = false }: Params) => {
    const handleJudge = (x: number, y: number) => {
        if (handleReverse(ref.current.x - x) >= spanX && Math.abs(ref.current.y - y) < spanY) {
            onChange();
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

    useEffect(() => {
        document.addEventListener("touchstart", (e) => {
            ref.current = {
                x: e.targetTouches?.[0].pageX,
                y: e.targetTouches?.[0].pageY,
            };
            isStart.current = true;
        });
        document.addEventListener("touchend", (e) => {
            handleJudge(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY);
            isStart.current = false;
            setIsShow(false);
        });

        document.addEventListener("touchmove", (e) => {
            setX(handleReverse(ref.current.x - e.targetTouches?.[0].pageX));
            setY(e.targetTouches?.[0].pageY - ref.current.y);
            if (isStart.current) {
                handleReverse(ref.current.x - e.targetTouches?.[0].pageX) > 100 ? setIsShow(true) : setIsShow(false);
            }
        });
    }, []);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    return (
        isShow && (
            <div
                style={{
                    position: "fixed",
                    top: "50vh",
                    left: "50vw",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    background: x >= spanX && Math.abs(y) < spanY ? "#1bbb1b" : "#d9363e",
                    borderRadius: 8,
                    zIndex: 100,
                    padding: "5px 10px",
                }}
            >
                <div>x: {x}</div>
                <div>y: {y}</div>
            </div>
        )
    );
};

export default useTouchRightToLeft;
