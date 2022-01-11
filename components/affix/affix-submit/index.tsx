import styles from "./index.module.scss";
import { Button } from "antd";

interface Props {
}

const AffixBack: React.FC<Props> = (props) => {

    return (
        <Button className={styles.submit} type="primary" htmlType="submit">
            Submit
        </Button>
    );
};

export default AffixBack;
