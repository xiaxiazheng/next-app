import styles from "./index.module.scss";
import useSettings from "../../../hooks/useSettings";

interface Props {
    color: string;
    category: string;
    style?: any;
}

const Category: React.FC<Props> = (props) => {
    const { color = "", category = "", style = {} } = props;

    const settings = useSettings();

    return (
        <span
            className={styles.category}
            style={{
                border: `1px solid ${settings?.todoColorMap?.[color]}`,
                color: settings?.todoColorMap?.[color],
                ...style,
            }}
        >
            {category}
        </span>
    );
};

export default Category;
