import styles from "./index.module.scss";
import { Drawer, DrawerProps } from "antd";

const DrawerWrapper: React.FC<DrawerProps> = (props) => {
    const { title, open, onClose, placement = "bottom", footer, height = '75vh', className, ...rest } = props;

    return (
        <Drawer
            open={open}
            placement={placement}
            className={styles.drawer}
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
    );
};

export default DrawerWrapper;
