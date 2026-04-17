import { Button } from "antd";
import { AudioOutlined, LoadingOutlined } from "@ant-design/icons";
import { addTodoItem } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import VoiceRecordButton from "../../../common/voice-record-button";
import { useRefreshContext } from "../../../LayoutWrapper";
import styles from "./index.module.scss";

const AffixVoice: React.FC = () => {
  const { refresh } = useRefreshContext();

  return (
    <VoiceRecordButton
      onRecognize={async (text) => {
        const now = dayjs();
        await addTodoItem({
          name: `语音识别 ${now.format("HH:mm:ss")}`,
          description: text,
          time: now.format("YYYY-MM-DD"),
          status: 0,
          color: "3",
          category: "个人",
          doing: "0",
          isNote: "0",
          isTarget: "0",
          isBookMark: "0",
          isWork: "0",
          isDirectory: "0",
          isEncode: "0",
          isFollowUp: "0",
          isShow: "0",
        });
        refresh();
      }}
    >
      {(state) => (
        <Button
          className={styles.affixVoice}
          style={{ bottom: 120, right: 20 }}
          type={state === "recording" ? "primary" : "default"}
          shape="circle"
          size="large"
          danger={state === "recording"}
          loading={state === "recognizing"}
          icon={state === "recognizing" ? <LoadingOutlined /> : <AudioOutlined />}
        />
      )}
    </VoiceRecordButton>
  );
};

export default AffixVoice;
