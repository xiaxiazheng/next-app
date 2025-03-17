import { useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { Drawer, DrawerProps } from "antd";
import useTouchEvent from "../../../hooks/useTouchEvent";

const DrawerWrapper: React.FC<DrawerProps> = (props) => {
    const { title, open, onClose, placement = "bottom", footer, height = "75vh", className, ...rest } = props;

    const id = useRef<any>(null);
    useEffect(() => {
        id.current = "关闭弹窗" + Math.random().toFixed(6);
    }, []);

    const touchEvent = useTouchEvent();

    useEffect(() => {
        if (open) {
            touchEvent?.popList("bottom", id.current);
            touchEvent?.pushList("bottom", {
                id: id.current,
                handleMoveEnd: () => {
                    onClose(null);
                },
                tipsText: "关闭弹窗",
            });
        } else {
            touchEvent?.popList("bottom", id.current);
        }
    }, [open, onClose]);

    return (
        <>
            <Drawer
                open={open}
                placement={placement}
                className={`${styles.drawer} ${className}`}
                onClose={onClose}
                footer={footer}
                title={title}
                closeIcon={null}
                closable={false}
                height={height}
                push={{ distance: 5 }}
                {...rest}
            >
                <div className={styles.content}>{props.children}</div>
            </Drawer>
        </>
    );
};

export default DrawerWrapper;
