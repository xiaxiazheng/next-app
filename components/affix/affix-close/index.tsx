import styles from "./index.module.scss";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface Props {
    close: Function;
}

const AffixClose: React.FC<Props> = (props) => {
    const { close } = props;

    return (
        <Button
            className={styles.affix}
            shape="circle"
            size="small"
            onClick={() => close()}
            icon={<CloseOutlined />}
        />
    );
};

export default AffixClose;
