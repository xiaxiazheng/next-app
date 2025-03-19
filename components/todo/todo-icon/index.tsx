import {
    AimOutlined,
    BookOutlined,
    StarFilled,
    ThunderboltFilled,
    AppleFilled,
    BarsOutlined,
    FireFilled,
    CoffeeOutlined,
} from "@ant-design/icons";

interface Props {
    iconType: 'habit' | 'work' | 'life' | 'bookMark' | 'note' | 'followUp' | 'target' | 'urgent',
    style?: any
    className?: any;
}

const TodoIcon: React.FC<Props> = (props) => {
    const map = {
        bookMark: StarFilled,
        note: BookOutlined,
        followUp: FireFilled,
        target: AimOutlined,
        urgent: ThunderboltFilled,
        work: AppleFilled,
        habit: BarsOutlined,
        life: CoffeeOutlined
    }

    const Comp = map[props.iconType];

    return <Comp style={props.style} className={props.className} />;
}

export default TodoIcon;