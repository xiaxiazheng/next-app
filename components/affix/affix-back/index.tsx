import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    backUrl?: string;
}

const AffixBack: React.FC<Props> = (props) => {
    const { backUrl } = props;

    const router = useRouter();

    return (
        <Button
            className={styles.back}
            type="primary"
            danger
            shape="circle"
            size="large"
            // onClick={() => router.back()} // 这个在套壳 app 上行为会出问题
            onClick={() => (backUrl ? router.push(backUrl) : router.back())}
            icon={<RollbackOutlined />}
        />
    );
};

export default AffixBack;
