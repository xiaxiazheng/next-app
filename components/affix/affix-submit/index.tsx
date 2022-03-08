import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
}

const AffixBack: React.FC<Props> = (props) => {

    return (
        <Button className={styles.submit} type="primary" htmlType="submit">
            提交
        </Button>
    );
};

export default AffixBack;
