import { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import styles from "./index.module.scss";
import { DeleteOutlined } from "@ant-design/icons";

const NameTextArea = ({ value, onChange, handleDelete }: any) => {
    return (
        <div className={styles.nameTextArea}>
            <Input.TextArea
                value={value}
                onChange={onChange}
                autoSize={{ minRows: 1, maxRows: 5 }}
                allowClear
                placeholder="尽量的量化，有具体的完成指标，任务尽量细致且易完成"
            />
            <DeleteOutlined className={styles.deleteIcon} style={{ color: "red" }} onClick={handleDelete} />
        </div>
    );
};

export default NameTextArea;
