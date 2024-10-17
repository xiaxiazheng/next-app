import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import styles from "./touch-event.module.scss";

interface Params {
    spanX?: number;
    spanY?: number;
    onChange: Function;
    isReverse?: boolean;
    tipsText?: string;
    canListen?: boolean;
}

export const debounceTime = 20;

export class TouchEventClass {
    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;
    isStart = false;
    isShow = false;
    safeXY = 120;
    leftList = [];
    rightList = [];
    topList = [];
    bottomList = [];
    forceUpdate: Function = () => {};

    init = () => {
        document.addEventListener("touchstart", this.handleStart);
        document.addEventListener("touchend", this.handleEnd);
        document.addEventListener("touchmove", this.handleMove);
    };

    setForceUpdate = (forceUpdate: Function) => {
        this.forceUpdate = forceUpdate;
    };

    pushList = (
        direction: "bottom" | "top" | "left" | "right",
        params: {
            id: string;
            handleMoveEnd: () => void;
            tipsText: string;
        }
    ) => {
        direction === "top" && this.topList.push(params);
        direction === "bottom" && this.bottomList.push(params);
        direction === "left" && this.leftList.push(params);
        direction === "right" && this.rightList.push(params);
    };

    popList = (direction: "bottom" | "top" | "left" | "right", id: string) => {
        if (direction === "top") {
            this.topList = this.topList.filter((item) => item.id !== id);
        }
        if (direction === "bottom") {
            this.bottomList = this.bottomList.filter((item) => item.id !== id);
        }
        if (direction === "left") {
            this.leftList = this.leftList.filter((item) => item.id !== id);
        }
        if (direction === "right") {
            this.rightList = this.rightList.filter((item) => item.id !== id);
        }
    };

    handleStart = debounce((e: TouchEvent) => {
        this.startX = e.targetTouches?.[0].pageX;
        this.startY = e.targetTouches?.[0].pageY;
        this.isStart = true;
        console.log("top", this.topList, "bottom", this.bottomList, "left", this.leftList, "right", this.rightList);
    }, debounceTime);

    handleJudge = (endX: number, endY: number) => {
        const moveX = endX - this.startX;
        const moveY = endY - this.startY;
        if (-moveY > this.safeXY && Math.abs(moveX) < this.safeXY) {
            this.topList.length && this.topList[this.topList.length - 1].handleMoveEnd();
        }
        if (moveY > this.safeXY && Math.abs(moveX) < this.safeXY) {
            this.bottomList.length && this.bottomList[this.bottomList.length - 1].handleMoveEnd();
        }
        if (-moveX > this.safeXY && Math.abs(moveY) < this.safeXY) {
            this.leftList.length && this.leftList[this.leftList.length - 1].handleMoveEnd();
        }
        if (moveX > this.safeXY && Math.abs(moveY) < this.safeXY) {
            this.rightList.length && this.rightList[this.rightList.length - 1].handleMoveEnd();
        }
    };

    handleEnd = debounce((e: TouchEvent) => {
        this.handleJudge(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY);
        this.isStart = false;
        this.isShow = false;
        this.getRender();
    }, debounceTime);

    handleMove = debounce((e: TouchEvent) => {
        const moveY = e.targetTouches?.[0].pageY - this.startY;
        const moveX = e.targetTouches?.[0].pageX - this.startX;
        this.moveX = moveX;
        this.moveY = moveY;
        if (Math.abs(moveX) < this.safeXY && Math.abs(moveY) < this.safeXY) {
            this.isShow = false;
        } else {
            this.isShow = true;
        }
        this.getRender();
    }, debounceTime);

    handleMoveEndText = () => {
        if (-this.moveY > this.safeXY && Math.abs(this.moveX) < this.safeXY) {
            return this.topList.length ? this.topList[this.topList.length - 1].tipsText : "";
        }
        if (this.moveY > this.safeXY && Math.abs(this.moveX) < this.safeXY) {
            return this.bottomList.length ? this.bottomList[this.bottomList.length - 1].tipsText : "";
        }
        if (-this.moveX > this.safeXY && Math.abs(this.moveY) < this.safeXY) {
            return this.leftList.length ? this.leftList[this.leftList.length - 1].tipsText : "";
        }
        if (this.moveX > this.safeXY && Math.abs(this.moveY) < this.safeXY) {
            return this.rightList.length ? this.rightList[this.rightList.length - 1].tipsText : "";
        }
    };

    getRender() {
        this.forceUpdate?.();
    }

    render() {
        if (!this.isShow) return null;
        const text = this.handleMoveEndText();
        return (
            text && (
                <div className={styles.touchEventText}>
                    <div>x: {this.moveX.toFixed(0)}</div>
                    <div>y: {this.moveY.toFixed(0)}</div>
                    <div>{text}</div>
                </div>
            )
        );
    }
}

export default TouchEventClass;
