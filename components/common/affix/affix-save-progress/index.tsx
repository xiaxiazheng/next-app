import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
    onClick: (event: any) => void;
    danger?: boolean;
}

const AffixBack: React.FC<Props> = (props) => {
    return (
        <Button className={styles.submit} type="primary" {...props}>
            暂存
        </Button>
    );
};

export default AffixBack;
