'use client';
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import TodoTabs from "./todo";

export default function Home() {

  return (
    <div className={styles.page}>
      <TodoTabs refreshFlag={1} />
    </div>
  );
}
