import React from "react";
import { Radio } from "antd";

const SwitchComp = (props) => {
    return (
        <Radio.Group {...props}>
            <Radio.Button key={"1"} value={"1"}>
                是
            </Radio.Button>
            <Radio.Button key={"0"} value={"0"}>
                否
            </Radio.Button>
        </Radio.Group>
    );
};

export default SwitchComp;
