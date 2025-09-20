import { TodoIconMap } from "@xiaxiazheng/blog-libs";

interface Props {
    iconType: keyof typeof TodoIconMap,
    style?: any
    className?: any;
}

const TodoIcon: React.FC<Props> = (props) => {
    const Comp = TodoIconMap[props.iconType];

    return <Comp style={props.style} className={props.className} />;
}

export default TodoIcon;