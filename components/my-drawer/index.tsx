import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
    visible: boolean;
    title?: any;
    onCancel?: Function;
    children?: any;
    placement?: "top" | "bottom";
}

const MyDrawer: React.FC<Props> = (props) => {
    const { title, visible, onCancel, placement = "bottom" } = props;

    return (
        <div
            className={styles.my_drawer}
            style={{
                display: visible ? "flex" : "none",
                alignItems: placement === "bottom" ? "flex-end" : "flex-start",
            }}
        >
            <div className={styles.mask} onClick={() => onCancel()} />
            <div className={styles.drawer_box}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.content}>{props.children}</div>
            </div>
        </div>
    );
};

export default MyDrawer;
