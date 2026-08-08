"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Heading } from "@/components/ui/heading";
import {
  ENCOURAGEMENT_MESSAGES,
  encouragementScratchContent,
  SCRATCH_REVEAL_THRESHOLD,
} from "@/lib/content/encouragement-scratch";
import { cn } from "@/lib/utils";

type WipePoint = { x: number; y: number };

type ScratchParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

type World = {
  width: number;
  height: number;
  dpr: number;
  reduceMotion: boolean;
  particles: ScratchParticle[];
  celebrationStart: number | null;
  autoRevealStart: number | null;
  coatAlpha: number;
  cleared: boolean;
  samplePending: boolean;
  lastSampleAt: number;
};

type DragState = {
  active: boolean;
  lastPoint: WipePoint | null;
  pendingPoints: WipePoint[];
};

const BRUSH_RADIUS_CSS = 32;
const SAMPLE_INTERVAL_MS = 350;
const CARD_RADIUS_CSS = 16;
const MESSAGE_REVEAL_DELAY_MS = 1200;

function pickMessageLayout() {
  return {
    x: 36 + Math.random() * 28,
    y: 56 + Math.random() * 16,
  };
}

function pickMessage() {
  const index = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length);
  return ENCOURAGEMENT_MESSAGES[index];
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function initMetallicCoating(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#7a8088");
  base.addColorStop(0.18, "#aeb4bc");
  base.addColorStop(0.42, "#d2d6dc");
  base.addColorStop(0.58, "#b8bcc4");
  base.addColorStop(0.82, "#949aa4");
  base.addColorStop(1, "#6e747c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const step = 2;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const grain = Math.random();
      const tone = 168 + grain * 72;
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] = tone;
          data[i + 1] = tone + 2;
          data[i + 2] = tone + 6;
          data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 48; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const angle = Math.random() * Math.PI * 2;
    const len = 8 + Math.random() * 28;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
    ctx.stroke();
  }

  const sheen = ctx.createLinearGradient(0, 0, width * 0.72, height);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.28)");
  sheen.addColorStop(0.35, "rgba(255, 255, 255, 0.06)");
  sheen.addColorStop(1, "rgba(0, 0, 0, 0.12)");
  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.1,
    width * 0.5,
    height * 0.45,
    width * 0.75,
  );
  vignette.addColorStop(0, "rgba(255, 255, 255, 0.04)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.14)");
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";
}

function applyScratch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.98)");
  gradient.addColorStop(0.55, "rgba(0, 0, 0, 0.5)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function scratchStroke(
  ctx: CanvasRenderingContext2D,
  from: WipePoint,
  to: WipePoint,
  radius: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 0.5) {
    applyScratch(ctx, to.x, to.y, radius);
    return;
  }

  const step = radius * 0.3;
  const steps = Math.ceil(distance / step);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    applyScratch(ctx, from.x + dx * t, from.y + dy * t, radius);
  }
}

function estimateClearPercent(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const sampleStep = 8;
  const data = ctx.getImageData(0, 0, width, height).data;
  let clear = 0;
  let total = 0;

  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const alpha = data[(y * width + x) * 4 + 3];
      total += 1;
      if (alpha < 96) {
        clear += 1;
      }
    }
  }

  return total === 0 ? 0 : clear / total;
}

function spawnScratchResidue(
  world: World,
  x: number,
  y: number,
  count: number,
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.6;
    world.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 280 + Math.random() * 220,
      size: 0.8 + Math.random() * 1.6,
    });
  }
}

function spawnCelebration(world: World, width: number, height: number) {
  const cx = width * 0.5;
  const cy = height * 0.5;

  for (let i = 0; i < 24; i++) {
    const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
    const speed = 0.5 + Math.random() * 2.2;
    world.particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 700 + Math.random() * 400,
      size: 1 + Math.random() * 2.2,
    });
  }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCoatingOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number,
  coatAlpha: number,
) {
  if (coatAlpha <= 0) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = coatAlpha;

  const edge = ctx.createLinearGradient(0, 0, 0, height);
  edge.addColorStop(0, "rgba(255, 255, 255, 0.14)");
  edge.addColorStop(0.08, "rgba(255, 255, 255, 0)");
  edge.addColorStop(0.92, "rgba(0, 0, 0, 0)");
  edge.addColorStop(1, "rgba(0, 0, 0, 0.1)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, width, height);

  const specular = ctx.createLinearGradient(0, 0, width * 0.65, height * 0.55);
  specular.addColorStop(0, "rgba(255, 255, 255, 0.16)");
  specular.addColorStop(0.45, "rgba(255, 255, 255, 0.02)");
  specular.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = specular;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();

  roundRectPath(ctx, 0, 0, width, height, CARD_RADIUS_CSS * dpr);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * coatAlpha})`;
  ctx.lineWidth = Math.max(1, dpr);
  ctx.stroke();
}

function drawParticles(ctx: CanvasRenderingContext2D, world: World, time: number) {
  const { particles, celebrationStart, reduceMotion } = world;

  for (const particle of particles) {
    particle.life += 16;
    particle.x += particle.vx * world.dpr;
    particle.y += particle.vy * world.dpr;
    particle.vx *= 0.94;
    particle.vy *= 0.94;

    if (particle.life >= particle.maxLife) {
      continue;
    }

    const t = 1 - particle.life / particle.maxLife;
    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      particle.size * world.dpr * t,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(180, 186, 194, 0.75)";
    ctx.globalAlpha = t * 0.55;
    ctx.fill();
  }

  if (
    celebrationStart &&
    !reduceMotion &&
    time - celebrationStart < 1400
  ) {
    const t = (time - celebrationStart) / 1400;
    const glow = ctx.createRadialGradient(
      world.width * 0.5,
      world.height * 0.5,
      0,
      world.width * 0.5,
      world.height * 0.5,
      world.width * 0.42,
    );
    glow.addColorStop(0, `rgba(255, 255, 255, ${0.08 * (1 - t)})`);
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glow;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, world.width, world.height);
  }

  ctx.globalAlpha = 1;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  coatCtx: CanvasRenderingContext2D,
  coatCanvas: HTMLCanvasElement,
  world: World,
  drag: DragState,
  time: number,
  onRevealed?: () => void,
) {
  const { width, height, dpr } = world;
  const brushRadius = BRUSH_RADIUS_CSS * dpr;

  if (
    world.autoRevealStart !== null &&
    !world.cleared
  ) {
    const elapsed = time - world.autoRevealStart;
    const t = Math.min(1, elapsed / 950);
    world.coatAlpha = 1 - easeOutCubic(t);

    if (t >= 1) {
      world.coatAlpha = 0;
      world.cleared = true;
      onRevealed?.();
    }
  }

  if (drag.pendingPoints.length > 0 && world.coatAlpha > 0) {
    let from = drag.lastPoint;

    for (const point of drag.pendingPoints) {
      if (from) {
        scratchStroke(coatCtx, from, point, brushRadius);
      } else {
        applyScratch(coatCtx, point.x, point.y, brushRadius);
      }

      if (!world.reduceMotion && world.coatAlpha > 0.2) {
        spawnScratchResidue(world, point.x, point.y, 2);
      }

      from = point;
    }

    drag.lastPoint = from;
    drag.pendingPoints = [];
    world.samplePending = true;
  }

  if (
    world.samplePending &&
    time - world.lastSampleAt >= SAMPLE_INTERVAL_MS &&
    !world.cleared &&
    world.autoRevealStart === null
  ) {
    const clearPercent = estimateClearPercent(coatCtx, width, height);
    world.lastSampleAt = time;
    world.samplePending = false;

    if (clearPercent >= SCRATCH_REVEAL_THRESHOLD) {
      world.autoRevealStart = time;
      if (!world.reduceMotion) {
        spawnCelebration(world, width, height);
        world.celebrationStart = time;
      } else {
        world.coatAlpha = 0;
        world.cleared = true;
        onRevealed?.();
      }
    }
  }

  ctx.clearRect(0, 0, width, height);

  if (world.coatAlpha > 0) {
    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, CARD_RADIUS_CSS * dpr);
    ctx.clip();
    ctx.globalAlpha = world.coatAlpha;
    ctx.drawImage(coatCanvas, 0, 0);
    ctx.restore();
    drawCoatingOverlay(ctx, width, height, dpr, world.coatAlpha);
  }

  drawParticles(ctx, world, time);

  world.particles = world.particles.filter(
    (particle) => particle.life < particle.maxLife,
  );

  if (
    world.celebrationStart &&
    time - world.celebrationStart > 1600
  ) {
    world.celebrationStart = null;
  }
}

type EncouragementScratchProps = {
  className?: string;
};

export function EncouragementScratch({ className }: EncouragementScratchProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coatCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const worldRef = useRef<World>({
    width: 0,
    height: 0,
    dpr: 1,
    reduceMotion: false,
    particles: [],
    celebrationStart: null,
    autoRevealStart: null,
    coatAlpha: 1,
    cleared: false,
    samplePending: false,
    lastSampleAt: 0,
  });

  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageLayout, setMessageLayout] = useState({ x: 50, y: 64 });
  const messageTimerRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(Boolean(reduceMotion));

  reduceMotionRef.current = Boolean(reduceMotion);

  const dragRef = useRef<DragState>({
    active: false,
    lastPoint: null,
    pendingPoints: [],
  });

  const onScratchStartRef = useRef<(() => void) | null>(null);
  const onRevealedRef = useRef<(() => void) | null>(null);
  const hasScratchedRef = useRef(false);

  const [hasScratched, setHasScratched] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  onScratchStartRef.current = () => {
    if (!hasScratchedRef.current) {
      hasScratchedRef.current = true;
      setHasScratched(true);
    }
  };

  onRevealedRef.current = () => {
    setIsRevealed(true);
  };

  const scheduleMessage = useCallback(() => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setMessageVisible(false);
    setMessage(pickMessage());
    setMessageLayout(pickMessageLayout());

    const delay = reduceMotionRef.current ? 0 : MESSAGE_REVEAL_DELAY_MS;
    messageTimerRef.current = window.setTimeout(() => {
      setMessageVisible(true);
    }, delay);
  }, []);

  const initCoatSurface = useCallback(() => {
    const world = worldRef.current;

    if (!coatCanvasRef.current) {
      coatCanvasRef.current = document.createElement("canvas");
    }

    const coatCanvas = coatCanvasRef.current;
    coatCanvas.width = world.width;
    coatCanvas.height = world.height;

    const coatCtx = coatCanvas.getContext("2d");
    if (coatCtx) {
      initMetallicCoating(coatCtx, world.width, world.height);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const world = worldRef.current;
    world.width = width;
    world.height = height;
    world.dpr = dpr;

    initCoatSurface();
  }, [initCoatSurface]);

  const resetCard = useCallback(() => {
    const world = worldRef.current;
    const drag = dragRef.current;

    world.particles = [];
    world.celebrationStart = null;
    world.autoRevealStart = null;
    world.coatAlpha = 1;
    world.cleared = false;
    world.samplePending = false;
    world.lastSampleAt = 0;

    scheduleMessage();

    drag.active = false;
    drag.lastPoint = null;
    drag.pendingPoints = [];

    hasScratchedRef.current = false;
    setHasScratched(false);
    setIsRevealed(false);

    initCoatSurface();
  }, [initCoatSurface, scheduleMessage]);

  const clientToCanvas = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const world = worldRef.current;

    return {
      x: ((clientX - rect.left) / rect.width) * world.width,
      y: ((clientY - rect.top) / rect.height) * world.height,
    };
  }, []);

  const queueScratch = useCallback(
    (clientX: number, clientY: number) => {
      const world = worldRef.current;

      if (world.cleared || world.coatAlpha <= 0) {
        return;
      }

      const point = clientToCanvas(clientX, clientY);
      dragRef.current.pendingPoints.push(point);
      onScratchStartRef.current?.();
    },
    [clientToCanvas],
  );

  useEffect(() => {
    scheduleMessage();

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
    // Mount only — message scheduling should not re-run when other hooks update.
  }, [scheduleMessage]);

  useEffect(() => {
    worldRef.current.reduceMotion = Boolean(reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    resizeCanvas();
    const observer = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    resizeCanvas();

    const canvas = canvasRef.current;
    const coatCanvas = coatCanvasRef.current;

    if (!canvas || !coatCanvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const coatCtx = coatCanvas.getContext("2d");

    if (!ctx || !coatCtx) {
      return;
    }

    let frameId = 0;

    const tick = (time: number) => {
      drawFrame(
        ctx,
        coatCtx,
        coatCanvas,
        worldRef.current,
        dragRef.current,
        time,
        onRevealedRef.current ?? undefined,
      );
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [resizeCanvas]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (event.button !== 0) {
        return;
      }

      const world = worldRef.current;
      if (world.cleared || world.coatAlpha <= 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      const drag = dragRef.current;
      drag.active = true;
      drag.lastPoint = null;
      queueScratch(event.clientX, event.clientY);
    },
    [queueScratch],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragRef.current.active) {
        return;
      }

      queueScratch(event.clientX, event.clientY);
    },
    [queueScratch],
  );

  const endScratch = useCallback(() => {
    const drag = dragRef.current;
    const world = worldRef.current;

    drag.active = false;
    drag.lastPoint = null;
    world.samplePending = true;
    world.lastSampleAt = 0;
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="max-w-2xl">
        <Heading id="before-you-go-heading" level={2}>
          {encouragementScratchContent.heading}
        </Heading>
        <p className="mt-4 text-body leading-body text-muted">
          {encouragementScratchContent.subtitle}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center sm:mt-10">
        <div className="relative w-full max-w-2xl">
          <div
            className="pointer-events-none absolute -inset-6 rounded-[24px] opacity-70 motion-reduce:opacity-50"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse at 50% 42%, rgba(212, 168, 118, 0.14) 0%, rgba(196, 148, 96, 0.06) 42%, transparent 72%)",
            }}
          />

          <div
            className={cn(
              "relative rounded-[18px] border border-border/55 p-1.5",
              "bg-[color-mix(in_srgb,var(--surface-elevated)_90%,#c9a87a_10%)]",
              "shadow-[0_22px_44px_-22px_rgba(0,0,0,0.72),0_6px_14px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]",
            )}
          >
            <div
              ref={containerRef}
              className={cn(
                "relative overflow-hidden rounded-2xl",
                !isRevealed && "cursor-crosshair",
                "h-[300px] sm:h-[340px]",
                "bg-gradient-to-b from-[#f6f4f0] via-[#f0ece6] to-[#e8e4de]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-10px_22px_rgba(0,0,0,0.05)]",
              )}
            >
              <div className="absolute inset-0 z-0" aria-hidden={!isRevealed}>
                {message && (
                  <p
                    className={cn(
                      "absolute max-w-[82%] text-center font-medium leading-heading tracking-normal text-[#1c1c1f]/84",
                      "text-[clamp(1.35rem,4vw,1.75rem)] sm:text-h3",
                      "transition-all duration-700 ease-out motion-reduce:transition-none",
                      messageVisible
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                    style={{
                      left: `${messageLayout.x}%`,
                      top: `${messageLayout.y}%`,
                      transform: messageVisible
                        ? "translate(-50%, -50%)"
                        : "translate(-50%, calc(-50% + 10px))",
                    }}
                  >
                    {message}
                  </p>
                )}
              </div>

              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 block h-full w-full touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endScratch}
                onPointerCancel={endScratch}
                onLostPointerCapture={endScratch}
                aria-label="Scratch card. Rub the silver coating to reveal a message."
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            "mt-3 text-[11px] text-muted/55 transition-colors duration-200",
            "rounded-sm px-1 hover:text-muted/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            !hasScratched && "pointer-events-none opacity-0",
          )}
          onClick={resetCard}
          disabled={!hasScratched}
        >
          {encouragementScratchContent.resetLabel}
        </button>
      </div>
    </div>
  );
}
