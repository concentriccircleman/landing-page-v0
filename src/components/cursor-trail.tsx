"use client";

import { useEffect, useRef } from "react";

const CELL = 5;
const RADIUS = 28;
const FADE_RATE = 0.025;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef<Map<string, number>>(new Map());
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const cells = Math.ceil(RADIUS / CELL);

      for (let dx = -cells; dx <= cells; dx++) {
        for (let dy = -cells; dy <= cells; dy++) {
          const gx = Math.floor(cx / CELL) + dx;
          const gy = Math.floor(cy / CELL) + dy;
          const px = gx * CELL + CELL / 2;
          const py = gy * CELL + CELL / 2;
          const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
          if (dist > RADIUS) continue;

          const strength = 1 - dist / RADIUS;
          const jitter = Math.random() * Math.random();
          const opacity = strength * jitter * 0.75;
          if (opacity < 0.05) continue;
          const key = `${gx},${gy}`;
          const existing = grid.current.get(key) ?? 0;
          if (opacity > existing) grid.current.set(key, opacity);
        }
      }
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const [key, opacity] of grid.current) {
        const newOpacity = opacity - FADE_RATE;
        if (newOpacity <= 0) {
          grid.current.delete(key);
          continue;
        }
        grid.current.set(key, newOpacity);

        const [gxStr, gyStr] = key.split(",");
        const gx = Number(gxStr);
        const gy = Number(gyStr);

        ctx.fillStyle = `rgba(37, 99, 235, ${newOpacity})`;
        ctx.fillRect(gx * CELL, gy * CELL, CELL - 1, CELL - 1);
      }

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
