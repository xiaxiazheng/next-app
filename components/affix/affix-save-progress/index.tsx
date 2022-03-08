import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
    onClick: Function;
}

const AffixBack: React.FC<Props> = (props) => {
    const { onClick } = props;

    return (
        <Button onClick={() => onClick()} className={styles.submit} type="primary">
            暂存
        </Button>
    );
};

export default AffixBack;
