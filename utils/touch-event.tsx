import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import styles from "./touch-event.module.scss";

export const debounceTime = 20;

export class TouchEventClass {
    startX = 0;
    startY = 0;
    moveX = 0;
    moveY = 0;
    isStart = false;
    isShow = false;
    safeX = 120;
    safeY = 210;
    map = {
        top: [],
        bottom: [],
        left: [],
        right: [],
    };
    forceUpdate: Function = () => {};

    init = () => {
        document.addEventListener("touchstart", this.handleStart);
        document.addEventListener("touchend", this.handleEnd);
        document.addEventListener("touchmove", this.handleMove);
    };

    setForceUpdate = (forceUpdate: Function) => {
        this.forceUpdate = forceUpdate;
    };

    setSafeXY = (params: { x: number; y: number }) => {
        const { x, y } = params;
        if (x) {
            this.safeX = x;
        }
        if (y) {
            this.safeY = y;
        }
    };

    pushList = (
        direction: "bottom" | "top" | "left" | "right",
        params: {
            id: string;
            handleMoveEnd: () => void;
            tipsText: string;
        }
    ) => {
        this.map[direction].push(params);
    };

    popList = (direction: "bottom" | "top" | "left" | "right", id: string) => {
        this.map[direction] = this.map[direction].filter((item) => item.id !== id);
    };

    handleStart = debounce((e: TouchEvent) => {
        this.startX = e.targetTouches?.[0].pageX;
        this.startY = e.targetTouches?.[0].pageY;
        this.isStart = true;
        console.log(this.map);
    }, debounceTime);

    getDirection = (moveX: number, moveY: number) => {
        if (-moveY > this.safeY && Math.abs(moveX) < this.safeX) {
            return "top";
        }
        if (moveY > this.safeY && Math.abs(moveX) < this.safeX) {
            return "bottom";
        }
        if (-moveX > this.safeX && Math.abs(moveY) < this.safeY) {
            return "left";
        }
        if (moveX > this.safeX && Math.abs(moveY) < this.safeY) {
            return "right";
        }
        return "";
    };

    handleRunMoveEnd = (endX: number, endY: number) => {
        const moveX = endX - this.startX;
        const moveY = endY - this.startY;
        let direction = this.getDirection(moveX, moveY);
        const len = this.map[direction]?.length;
        len && this.map[direction][len - 1].handleMoveEnd();
    };

    handleMoveEndText = () => {
        const direction = this.getDirection(this.moveX, this.moveY);
        const len = this.map[direction]?.length;
        return len ? this.map[direction][len - 1].tipsText : "";
    };

    handleEnd = debounce((e: TouchEvent) => {
        this.handleRunMoveEnd(e.changedTouches?.[0]?.pageX, e.changedTouches?.[0]?.pageY);
        this.isStart = false;
        this.isShow = false;
        this.getRender();
    }, debounceTime);

    handleMove = debounce((e: TouchEvent) => {
        const moveY = e.targetTouches?.[0].pageY - this.startY;
        const moveX = e.targetTouches?.[0].pageX - this.startX;
        this.moveX = moveX;
        this.moveY = moveY;
        if (Math.abs(moveX) < this.safeX && Math.abs(moveY) < this.safeY) {
            this.isShow = false;
        } else {
            this.isShow = true;
        }
        this.getRender();
    }, debounceTime);

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
