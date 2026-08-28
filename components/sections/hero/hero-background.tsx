"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const GRID_SIZE_PX = 48;
const WARP_RADIUS = 220;
const WARP_STRENGTH = 0.42;
const SAMPLES_PER_LINE = 28;
const CURSOR_LERP = 0.14;

function warpPoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  radius: number,
  strength: number,
) {
  const dx = x - cx;
  const dy = y - cy;
  const distance = Math.hypot(dx, dy);

  if (distance >= radius || distance < 0.001) {
    return { x, y };
  }

  const t = 1 - distance / radius;
  // Gravity well: pull toward cursor, stronger near center (fisheye dent)
  const pull = t * t * strength;

  return {
    x: x - dx * pull,
    y: y - dy * pull,
  };
}

function readGridStroke(element: HTMLElement) {
  const styles = getComputedStyle(element);
  return styles.getPropertyValue("--hero-grid-line").trim() || "rgba(250,250,250,0.11)";
}

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotionRef = useRef(reduceMotion);

  reduceMotionRef.current = reduceMotion;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    let frameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stroke = readGridStroke(canvas);
    let pointerActive = false;
    let isDesktop = mediaQuery.matches;
    const pointer = { x: 0, y: 0 };
    const cursor = { x: 0, y: 0 };

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) {
        return;
      }

      const bounds = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      stroke = readGridStroke(canvas);

      if (!pointerActive) {
        cursor.x = width * 0.5;
        cursor.y = height * 0.42;
        pointer.x = cursor.x;
        pointer.y = cursor.y;
      }

      requestTick();
    };

    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      enableWarp: boolean,
    ) => {
      context.beginPath();

      for (let i = 0; i <= SAMPLES_PER_LINE; i += 1) {
        const t = i / SAMPLES_PER_LINE;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        const point = enableWarp
          ? warpPoint(x, y, cursor.x, cursor.y, WARP_RADIUS, WARP_STRENGTH)
          : { x, y };

        if (i === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      }

      context.stroke();
    };

    const drawGrid = (enableWarp: boolean) => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = stroke;
      context.lineWidth = 1;
      context.globalAlpha = 1;

      const startX = -GRID_SIZE_PX;
      const startY = -GRID_SIZE_PX;
      const endX = width + GRID_SIZE_PX;
      const endY = height + GRID_SIZE_PX;

      for (let x = startX; x <= endX; x += GRID_SIZE_PX) {
        drawLine(x, startY, x, endY, enableWarp);
      }

      for (let y = startY; y <= endY; y += GRID_SIZE_PX) {
        drawLine(startX, y, endX, y, enableWarp);
      }
    };

    const tick = () => {
      const enableWarp =
        !reduceMotionRef.current && isDesktop && pointerActive;

      if (enableWarp) {
        cursor.x += (pointer.x - cursor.x) * CURSOR_LERP;
        cursor.y += (pointer.y - cursor.y) * CURSOR_LERP;
        drawGrid(true);
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      drawGrid(false);
      frameId = 0;
    };

    const requestTick = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reduceMotionRef.current || !isDesktop) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointerActive = true;
      requestTick();
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      requestTick();
    };

    const handleMediaChange = () => {
      isDesktop = mediaQuery.matches;

      if (!isDesktop) {
        pointerActive = false;
      }

      requestTick();
    };

    const themeObserver = new MutationObserver(() => {
      stroke = readGridStroke(canvas);
      requestTick();
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    resize();
    requestTick();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      mediaQuery.removeEventListener("change", handleMediaChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="hero-grain pointer-events-none absolute inset-0 min-h-full overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="hero-grid-mask absolute inset-0 h-full w-full"
      />

      <div className="absolute inset-0 bg-linear-to-b from-background/0 via-transparent to-background" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
