import { useEffect, useState } from "react";

export const useIsWork = () => {
  const [isWork, setIsWork] = useState<string>("");
  useEffect(() => {
    if (localStorage.getItem("WorkOrLife")) {
      setIsWork(localStorage.getItem("WorkOrLife"));
    }
  })
  return isWork;
};