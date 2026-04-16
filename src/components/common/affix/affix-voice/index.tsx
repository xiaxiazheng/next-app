import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Button, message } from "antd";
import { AudioOutlined, LoadingOutlined } from "@ant-design/icons";
import { addTodoItem, speechRecognition } from "@xiaxiazheng/blog-libs";
import dayjs from "dayjs";
import { useRefreshContext } from "../../../../LayoutWrapper";

type RecordingState = "idle" | "recording" | "recognizing";

// 将 AudioBuffer 转换为 WAV 格式
function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = 1; // 单声道
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = audioBuffer.length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // WAV 文件头
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  // 写入 PCM 数据
  const channelData = audioBuffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

// 将 ArrayBuffer 转换为 base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const AffixVoice: React.FC = () => {
  const { refresh } = useRefreshContext();
  const [state, setState] = useState<RecordingState>("idle");
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setIsSupported(false);
      return;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 创建 AudioContext 用于后续转换
      audioContextRef.current = new AudioContext();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setState("recording");
    } catch (error: any) {
      console.error("Failed to start recording:", error);
      if (error?.name === "NotAllowedError") {
        message.error("麦克风权限被拒绝，请在浏览器设置中授权");
      } else {
        message.error("启动录音失败");
      }
      setState("idle");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (state !== "recording") return;

    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    setState("recognizing");

    // 停止录音
    mediaRecorder.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());

    // 等待数据合并
    await new Promise<void>((resolve) => {
      mediaRecorder.onstop = () => resolve();
    });

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    // 解码为 AudioBuffer 并转换为 WAV
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = audioContextRef.current!;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 如果采样率不是 16kHz，需要重采样
      let bufferToUse = audioBuffer;
      if (audioBuffer.sampleRate !== 16000) {
        bufferToUse = await resampleBuffer(audioContext, audioBuffer, 16000);
      }

      const wavBuffer = audioBufferToWav(bufferToUse);
      const audioBase64 = arrayBufferToBase64(wavBuffer);

      await recognizeAndCreateTodo(audioBase64);
    } catch (error) {
      console.error("Audio processing error:", error);
      message.error("音频处理失败");
      setState("idle");
    }
  }, [state]);

  const recognizeAndCreateTodo = async (audioBase64: string) => {
    if (!audioBase64) {
      message.warning("未获取到音频数据");
      setState("idle");
      return;
    }

    try {
      const res = await speechRecognition(audioBase64, "wav");

      if (!res || res.resultsCode !== "success") {
        message.error(res?.message || "语音识别失败");
        setState("idle");
        return;
      }

      const transcript = res.data?.result?.trim();

      if (!transcript) {
        message.warning("未识别到语音内容");
        setState("idle");
        return;
      }

      // 创建 todo
      const now = dayjs();
      const title = `语音识别 ${now.format("HH:mm:ss")}`;
      const description = transcript;

      await addTodoItem({
        name: title,
        description,
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
      message.success("已创建语音 todo");
      refresh();
    } catch (error) {
      console.error("Speech recognition error:", error);
      message.error("语音识别请求失败");
    }

    setState("idle");
  };

  if (!isSupported) {
    return null;
  }

  const bottom = 220;
  const isRecording = state === "recording";
  const isRecognizing = state === "recognizing";

  return (
    <Button
      className={styles.affixVoice}
      style={{ bottom, right: 20 }}
      type={isRecording ? "primary" : "default"}
      shape="circle"
      size="large"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={() => state === "recording" && stopRecording()}
      onTouchStart={(e) => {
        e.preventDefault();
        startRecording();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        stopRecording();
      }}
      danger={isRecording}
      disabled={isRecognizing}
      icon={isRecognizing ? <LoadingOutlined /> : <AudioOutlined />}
    />
  );
};

// 重采样到目标采样率
async function resampleBuffer(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
  targetSampleRate: number
): Promise<AudioBuffer> {
  const channelData = audioBuffer.getChannelData(0);
  const ratio = audioBuffer.sampleRate / targetSampleRate;
  const newLength = Math.round(channelData.length / ratio);
  const newBuffer = audioContext.createBuffer(1, newLength, targetSampleRate);
  const newChannelData = newBuffer.getChannelData(0);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, channelData.length - 1);
    const t = srcIndex - srcIndexFloor;
    newChannelData[i] = channelData[srcIndexFloor] * (1 - t) + channelData[srcIndexCeil] * t;
  }

  return newBuffer;
}

export default AffixVoice;
