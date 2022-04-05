import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    style?: any;
}

const AffixFooter: React.FC<Props> = (props) => {
    // const { backUrl } = props;

    const router = useRouter();

    return (
        <div {...props} className={styles.footer}>
            {props.children}
        </div>
    );
};

export default AffixFooter;
