import styles from "./index.module.scss";
import { Button } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    onClick: Function;
}

const AffixAdd: React.FC<Props> = (props) => {
    const { onClick } = props;

    const router = useRouter();

    return (
        <Button
            className={styles.back}
            type="primary"
            shape="circle"
            size="large"
            // onClick={() => router.back()} // 这个在套壳 app 上行为会出问题
            onClick={() => onClick()}
            icon={<FolderAddOutlined />}
        />
    );
};

export default AffixAdd;
