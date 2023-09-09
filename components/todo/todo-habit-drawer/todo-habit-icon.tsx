import React, { useContext } from "react";
import styles from "./index.module.scss";
import { ClockCircleOutlined } from "@ant-design/icons";
import { TodoItemType } from "../types";
import { handleIsTodayPunchTheClock } from "../todo-form-habit/utils";

const TodoHabitIcon = (props: { item: TodoItemType }) => {
    const { item } = props;

    if (!item.timeRange) {
        return null;
    }

    const isTodayDone = handleIsTodayPunchTheClock(item);

    return (
      <ClockCircleOutlined
          className={styles.habitIcon}
          style={{
              color: isTodayDone ? "#52d19c" : "#f5222d",
          }}
      />
    );
};

export default TodoHabitIcon;
