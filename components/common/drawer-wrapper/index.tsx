import useTouchBottomToTop from "../../../hooks/useTouchBottomToTop";
import styles from "./index.module.scss";
import { Drawer, DrawerProps } from "antd";

const DrawerWrapper: React.FC<DrawerProps> = (props) => {
    const { title, open, onClose, placement = "bottom", footer, height = "75vh", className, ...rest } = props;

    // 从上到下
    const tips = useTouchBottomToTop(
        {
            spanY: 200,
            onChange: () => {
                open && onClose(null);
            },
            isReverse: true,
            tipsText: '关闭抽屉',
            canListen: open,
        },
        [open],
    );

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
                {...rest}
            >
                <div className={styles.content}>{props.children}</div>
            </Drawer>
            {tips}
        </>
    );
};

export default DrawerWrapper;
