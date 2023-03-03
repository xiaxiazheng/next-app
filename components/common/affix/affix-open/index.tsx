import styles from "./index.module.scss";
import { Button } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";

interface Props {
    onClick: Function;
}

const AffixOpen: React.FC<Props> = (props) => {
    const { onClick } = props;

    return (
        <Button
            className={styles.open}
            type="primary"
            danger
            shape="circle"
            size="large"
            onClick={() => onClick()}
            icon={<ApartmentOutlined />}
        />
    );
};

export default AffixOpen;
