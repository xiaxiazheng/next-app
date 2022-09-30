import styles from "./index.module.scss";
import { colorMap } from "../constant";

interface Props {
    color: string;
    category: string;
    style?: any;
}

const Category: React.FC<Props> = (props) => {
    const { color = "", category = "", style = {} } = props;

    return (
        <span
            className={styles.category}
            style={{
                border: `1px solid ${colorMap[color]}`,
                color: colorMap[color],
                ...style,
            }}
        >
            {category}
        </span>
    );
};

export default Category;
