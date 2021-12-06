import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    
}

const AffixBack: React.FC<Props> = (props) => {

    const router = useRouter();

    return (
        <Button
            className={styles.back}
            type="primary"
            danger
            shape="circle"
            size="large"
            onClick={() => router.back()}
            icon={<RollbackOutlined />}
        />
    );
};

export default AffixBack;
