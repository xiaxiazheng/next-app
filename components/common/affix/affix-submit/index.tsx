import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
    danger?: boolean;
    loading?: boolean;
}

const AffixBack: React.FC<Props> = (props) => {
    return (
        <Button className={styles.submit} type="primary" htmlType="submit" {...props}>
            提交
        </Button>
    );
};

export default AffixBack;
