import styles from "./index.module.scss";
import { Button } from "antd";
import { HomeOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

interface Props {
    type: "home" | "add" | "category";
    bottomIndex: 0 | 1 | 2 | 3 | 4;
    onClick?: () => void;
    isLeft?: boolean;
}

const indexMap = {
    1: 20,
    2: 70,
    3: 120,
    4: 170,
};

const IconMap = {
    home: HomeOutlined,
    add: PlusOutlined,
    category: UnorderedListOutlined
};

const Affix: React.FC<Props> = (props) => {
    const { type, bottomIndex, onClick, isLeft = false } = props;
    const bottom = indexMap?.[bottomIndex] || 20;
    const router = useRouter();

    const onClickMap = {
        home: () => router.push("/"),
    };

    const Icon = IconMap?.[type];

    const dir = isLeft ? "left" : "right";

    return (
        <Button
            className={styles.affix}
            style={{ bottom, [dir]: 20 }}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => (onClick ? onClick?.() : onClickMap?.[type]?.())}
            icon={Icon && <Icon />}
        />
    );
};

export default Affix;
