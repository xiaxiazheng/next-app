import styles from "./index.module.scss";
import { Button } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const AffixSong = ({ onClick }) => {
    return (
        <Button
            className={styles.affix}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => onClick()}
            icon={<RocketOutlined />}
        />
    );
};

export default AffixSong;
