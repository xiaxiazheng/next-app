import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useVoiceRecognize, VoiceRecognizeState } from "../../../hooks/useVoiceRecognize";

export interface VoiceRecordButtonProps {
    /** 识别成功回调 */
    onRecognize: (text: string) => void;
    /** 是否展示，false 时不渲染 */
    visible?: boolean;
    children?: (state: VoiceRecognizeState) => React.ReactNode;
}

/**
 * 录音按钮，封装 mousedown/mouseup/touch 事件。
 * children 是渲染函数，接收 state 返回 ReactNode。
 */
const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
    onRecognize,
    visible = true,
    children,
}) => {
    const { state, isSupported, startRecording, stopRecording } = useVoiceRecognize(onRecognize);

    if (!visible || !isSupported) return null;

    const isRecording = state === "recording";
    const isRecognizing = state === "recognizing";

    return (
        <span
            onMouseDown={(e) => { e.stopPropagation(); startRecording(); }}
            onMouseUp={(e) => { e.stopPropagation(); stopRecording(); }}
            onMouseLeave={(e) => { e.stopPropagation(); isRecording && stopRecording(); }}
            onTouchStart={(e) => { e.stopPropagation(); startRecording(); }}
            onTouchEnd={(e) => { e.stopPropagation(); stopRecording(); }}
            style={{ display: "inline-flex", cursor: isRecognizing ? "not-allowed" : "pointer" }}
        >
            {children ? children(state) : <LoadingOutlined />}
        </span>
    );
};

export default VoiceRecordButton;
