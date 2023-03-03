import styles from "./index.module.scss";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const AffixHome = () => {
    const router = useRouter();

    return (
        <Button
            className={styles.affix}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => router.push("/")}
            icon={<HomeOutlined />}
        />
    );
};

export default AffixHome;
