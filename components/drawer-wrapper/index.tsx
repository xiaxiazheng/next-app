import styles from "./index.module.scss";
import { Button, Drawer, DrawerProps } from "antd";

const DrawerWrapper: React.FC<DrawerProps> = (props) => {
    const { title, visible, onClose, placement = "bottom", footer, height = '75vh' } = props;

    return (
        <Drawer
            visible={visible}
            placement={placement}
            className={styles.drawer}
            onClose={onClose}
            footer={footer}
            title={title}
            closeIcon={null}
            height={height}
        >
            <div className={styles.content}>{props.children}</div>
        </Drawer>
    );
};

export default DrawerWrapper;
