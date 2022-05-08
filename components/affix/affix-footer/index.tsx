import styles from "./index.module.scss";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    style?: any;
    type?: 'sticky' | 'fixed'
}

const AffixFooter: React.FC<Props> = (props) => {
    const { type = 'sticky' } = props;

    return (
        <div {...props} className={type === 'sticky' ? styles.footer : styles.fixed}>
            {props.children}
        </div>
    );
};

export default AffixFooter;
