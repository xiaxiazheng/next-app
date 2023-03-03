import styles from "./index.module.scss";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface Props {
    onClick: Function;
}

const AffixRefresh: React.FC<Props> = (props) => {
    const { onClick } = props;

    return (
        <Button
            className={styles.refresh}
            type="primary"
            danger
            shape="circle"
            size="large"
            onClick={() => onClick()}
            icon={<EditOutlined />}
        />
    );
};

export default AffixRefresh;
