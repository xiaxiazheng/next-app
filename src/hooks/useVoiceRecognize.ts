import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { speechRecognition } from "@xiaxiazheng/blog-libs";

export type VoiceRecognizeState = "idle" | "recording" | "recognizing";

/**
 * 语音识别 hook，复用录音+识别逻辑
 * @param onRecognize 识别成功回调，参数为识别文本
 */
export function useVoiceRecognize(onRecognize?: (text: string) => void) {
    const [state, setState] = useState<VoiceRecognizeState>("idle");
    const [isSupported, setIsSupported] = useState(true);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setIsSupported(false);
            return;
        }
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            audioChunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

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
        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder || mediaRecorder.state === "inactive") return;

        mediaRecorder.stop();
        streamRef.current?.getTracks().forEach((track) => track.stop());

        await new Promise<void>((resolve) => {
            mediaRecorder.onstop = () => resolve();
        });

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        setState("recognizing");
        try {
            const arrayBuffer = await audioBlob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const audioBase64 = btoa(binary);

            const res = await speechRecognition(audioBase64, "ogg-opus");

            if (!res || res.resultsCode !== "success") {
                message.error(res?.message || "语音识别失败");
                setState("idle");
                return;
            }

            const transcript = res.data?.result?.trim();
            if (transcript) {
                onRecognize?.(transcript);
            } else {
                message.warning("未识别到语音内容");
            }
        } catch (error) {
            console.error("Speech recognition error:", error);
            message.error("语音识别请求失败");
        } finally {
            setState("idle");
        }
    }, []);

    return {
        state,
        isSupported,
        startRecording,
        stopRecording,
    };
}
