"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Sparkles, RotateCcw, Trophy, Play, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme";
import { ENCOURAGEMENT_MESSAGES } from "@/lib/content/encouragement-scratch";
import { cn } from "@/lib/utils";

type Block = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  borderColor: string;
  destroyed: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
};

type BallTrailPoint = {
  x: number;
  y: number;
  alpha: number;
};

type LevelConfig = {
  name: string;
  ballSpeed: number;
  speedLabel: string;
  grid: number[][];
};

const LEVELS: LevelConfig[] = [
  {
    name: "The Gateway",
    ballSpeed: 4.8,
    speedLabel: "1.0x",
    // 2 rows of 6 = 12 blocks
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: "The Pyramid",
    ballSpeed: 5.8,
    speedLabel: "1.2x",
    // 3 rows = 12 blocks
    grid: [
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
    ],
  },
  {
    name: "Twin Pillars",
    ballSpeed: 6.8,
    speedLabel: "1.4x",
    // 3 rows = 12 blocks
    grid: [
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
    ],
  },
  {
    name: "The Diamond",
    ballSpeed: 7.8,
    speedLabel: "1.6x",
    // 3 rows = 12 blocks
    grid: [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0],
    ],
  },
  {
    name: "The Secret Vault",
    ballSpeed: 8.8,
    speedLabel: "1.8x",
    // Final level = 12 blocks guarding the last mystery block
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 1, 1],
    ],
  },
];

// Futuristic Cyber-Neon Tile Palettes
const ROW_COLORS_DARK = [
  { fill: "rgba(6, 182, 212, 0.24)", border: "#00f0ff" }, // Neon Cyan
  { fill: "rgba(168, 85, 247, 0.24)", border: "#c084fc" }, // Plasma Violet
  { fill: "rgba(244, 63, 94, 0.24)", border: "#ff2a85" }, // Laser Fuchsia
  { fill: "rgba(16, 185, 129, 0.24)", border: "#00ff9f" }, // Matrix Mint
  { fill: "rgba(245, 158, 11, 0.24)", border: "#fbbf24" }, // Solar Amber
];

const ROW_COLORS_LIGHT = [
  { fill: "rgba(224, 242, 254, 0.88)", border: "#0284c7" }, // Cyber Cyan
  { fill: "rgba(243, 232, 255, 0.88)", border: "#7c3aed" }, // Plasma Violet
  { fill: "rgba(255, 228, 230, 0.88)", border: "#db2777" }, // Laser Fuchsia
  { fill: "rgba(209, 250, 229, 0.88)", border: "#059669" }, // Matrix Mint
  { fill: "rgba(254, 243, 199, 0.88)", border: "#d97706" }, // Solar Amber
];

const SURPRISE_MESSAGES = [
  "You conquered all 5 levels and smashed every blocker! Here's your tiny internet high-five.",
  "Persistence wins every time. May your next pull request merge without conflicts.",
  "All 5 walls cleared, zero bugs left behind. You're doing incredible work.",
  "Behind the final block of Level 5 is good fortune: may your coffee be hot and your code be clean.",
  "Every level mastered! Take this momentum into the rest of your day.",
  ...ENCOURAGEMENT_MESSAGES,
];

export function SmashBlocks({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isLightRef = useRef(isLight);

  useEffect(() => {
    isLightRef.current = theme === "light";
  }, [theme]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [levelIndex, setLevelIndex] = useState(0); // 0 to 4
  const [gameState, setGameState] = useState<
    "ready" | "playing" | "level_complete" | "victory" | "gameover"
  >("ready");
  const [totalLevelBlocks, setTotalLevelBlocks] = useState(12);
  const [blocksRemaining, setBlocksRemaining] = useState(12);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [secretMessage, setSecretMessage] = useState("");

  // Game internal state ref
  const gameRef = useRef({
    width: 600,
    height: 340,
    dpr: 1,
    paddle: { x: 300, y: 310, w: 86, h: 11, targetX: 300 },
    ball: { x: 300, y: 290, vx: 0, vy: 0, r: 7.5, speed: 4.8 },
    blocks: [] as Block[],
    particles: [] as Particle[],
    ballTrail: [] as BallTrailPoint[],
    lastFrameTime: 0,
    elapsedMs: 0,
    launched: false,
    currentLevelIdx: 0,
  });

  // Load high score / best time
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_smash_blocks_best_time");
      if (saved) {
        setBestTime(parseInt(saved, 10));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Initialize block grid
  const initLevel = useCallback((lvlIdx: number, canvasWidth: number) => {
    const config = LEVELS[lvlIdx] ?? LEVELS[0];
    gameRef.current.currentLevelIdx = lvlIdx;
    gameRef.current.ball.speed = config.ballSpeed;

    const isLightCurrent =
      isLightRef.current ||
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("light"));
    const colorPalette = isLightCurrent ? ROW_COLORS_LIGHT : ROW_COLORS_DARK;

    const marginX = 24;
    const marginTop = 34;
    const gapX = 8;
    const gapY = 9;
    const gridCols = config.grid[0]?.length || 6;
    const availableW = Math.max(canvasWidth - marginX * 2, 260);
    const blockW = (availableW - gapX * (gridCols - 1)) / gridCols;
    const blockH = 18;

    const newBlocks: Block[] = [];
    let idCounter = 0;

    for (let r = 0; r < config.grid.length; r++) {
      const row = config.grid[r];
      const { fill, border } = colorPalette[r % colorPalette.length];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 1) {
          newBlocks.push({
            id: idCounter++,
            x: marginX + c * (blockW + gapX),
            y: marginTop + r * (blockH + gapY),
            w: blockW,
            h: blockH,
            color: fill,
            borderColor: border,
            destroyed: false,
          });
        }
      }
    }

    gameRef.current.blocks = newBlocks;
    setTotalLevelBlocks(newBlocks.length);
    setBlocksRemaining(newBlocks.length);
    setLevelIndex(lvlIdx);
  }, []);

  // Block explosion particles
  const spawnBlockParticles = useCallback(
    (x: number, y: number, w: number, h: number, color: string, count = 12) => {
      if (reduceMotion) return;
      const particles = gameRef.current.particles;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 4.2;
        particles.push({
          x: x + w / 2,
          y: y + h / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 3.5,
          color,
          alpha: 1,
          life: 0,
          maxLife: 26 + Math.random() * 20,
        });
      }
    },
    [reduceMotion],
  );

  // Victory celebration particles
  const spawnCelebrationParticles = useCallback(
    (isFinal = false) => {
      if (reduceMotion) return;
      const { width, height, particles } = gameRef.current;
      const colors = ["#00f0ff", "#c084fc", "#ff2a85", "#00ff9f", "#fbbf24", "#ffffff"];
      const count = isFinal ? 95 : 45;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * (isFinal ? 7.5 : 5.5);
        particles.push({
          x: width / 2,
          y: height / 2 - 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 3.5 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: 45 + Math.random() * 35,
        });
      }
    },
    [reduceMotion],
  );

  // Reset ball perched directly on top of paddle
  const resetBallOnPaddle = useCallback(() => {
    const game = gameRef.current;
    game.launched = false;
    game.paddle.x = game.width / 2;
    game.paddle.targetX = game.width / 2;
    game.ball.x = game.paddle.x;
    const paddleTop = game.paddle.y - game.paddle.h / 2;
    game.ball.y = paddleTop - game.ball.r - 2;
    game.ball.vx = 0;
    game.ball.vy = 0;
    game.ballTrail = [];
  }, []);

  // Launch the ball
  const launchBall = useCallback(() => {
    const game = gameRef.current;
    if (game.launched) return;

    game.launched = true;
    const randomAngle = (Math.random() * 0.44 - 0.22) * Math.PI;
    const speed = game.ball.speed;
    game.ball.vx = Math.sin(randomAngle) * speed;
    game.ball.vy = -Math.cos(randomAngle) * speed;

    setGameState("playing");
  }, []);

  // Advance to next level (escalates ball speed)
  const advanceToNextLevel = useCallback(() => {
    const nextIdx = gameRef.current.currentLevelIdx + 1;
    if (nextIdx < LEVELS.length) {
      initLevel(nextIdx, gameRef.current.width);
      resetBallOnPaddle();
      setLives((l) => Math.min(3, l + 1));
      setGameState("ready");
    }
  }, [initLevel, resetBallOnPaddle]);

  // Restart whole game from Level 1
  const startNewGame = useCallback(() => {
    const game = gameRef.current;
    initLevel(0, game.width);
    resetBallOnPaddle();
    game.particles = [];
    game.ballTrail = [];
    game.elapsedMs = 0;
    setElapsedSec(0);
    setLives(3);
    setGameState("ready");
  }, [initLevel, resetBallOnPaddle]);

  // Auto-advance timer when a level is cleared
  useEffect(() => {
    if (gameState === "level_complete") {
      const timer = setTimeout(() => {
        advanceToNextLevel();
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [gameState, advanceToNextLevel]);

  // Setup canvas size
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(rect.width || 0, 300);
      const height = Math.max(rect.height || 0, 320);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const game = gameRef.current;
      game.width = width;
      game.height = height;
      game.dpr = dpr;
      game.paddle.y = height - 26;
      game.paddle.w = Math.max(76, Math.min(94, width * 0.18));

      initLevel(game.currentLevelIdx, width);
      resetBallOnPaddle();
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [initLevel, resetBallOnPaddle]);

  // Pointer movement (mouse / touch)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const game = gameRef.current;

    const halfW = game.paddle.w / 2;
    const clampedX = Math.max(halfW, Math.min(game.width - halfW, clientX));
    game.paddle.targetX = clampedX;

    if (!game.launched) {
      game.paddle.x = clampedX;
      game.ball.x = clampedX;
      const paddleTop = game.paddle.y - game.paddle.h / 2;
      game.ball.y = paddleTop - game.ball.r - 2;
    }
  }, []);

  // Pointer click / tap to launch
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      handlePointerMove(e);
      if (!gameRef.current.launched && gameState === "ready") {
        launchBall();
      }
    },
    [gameState, handlePointerMove, launchBall],
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      const step = 28;
      const halfW = game.paddle.w / 2;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        game.paddle.targetX = Math.max(halfW, game.paddle.targetX - step);
        if (!game.launched) {
          game.paddle.x = game.paddle.targetX;
          game.ball.x = game.paddle.targetX;
          const paddleTop = game.paddle.y - game.paddle.h / 2;
          game.ball.y = paddleTop - game.ball.r - 2;
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        game.paddle.targetX = Math.min(game.width - halfW, game.paddle.targetX + step);
        if (!game.launched) {
          game.paddle.x = game.paddle.targetX;
          game.ball.x = game.paddle.targetX;
          const paddleTop = game.paddle.y - game.paddle.h / 2;
          game.ball.y = paddleTop - game.ball.r - 2;
        }
      } else if (e.key === " " && !game.launched && gameState === "ready") {
        e.preventDefault();
        launchBall();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, launchBall]);

  // Main 60fps animation loop
  useEffect(() => {
    let animId: number;
    gameRef.current.lastFrameTime = performance.now();

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min((now - gameRef.current.lastFrameTime) / 1000, 0.05);
      gameRef.current.lastFrameTime = now;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const game = gameRef.current;
      const { width, height, dpr, paddle, ball, blocks, particles, ballTrail, currentLevelIdx } = game;

      const isCurrentLight =
        isLightRef.current ||
        (typeof document !== "undefined" &&
          document.documentElement.classList.contains("light"));

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Arena background fill
      ctx.fillStyle = isCurrentLight ? "#fbfbfa" : "#0e0e11";
      ctx.fillRect(0, 0, width, height);

      // Subtle cybernetic arena grid
      ctx.strokeStyle = isCurrentLight ? "rgba(0, 0, 0, 0.035)" : "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Smooth paddle movement
      paddle.x += (paddle.targetX - paddle.x) * 0.35;

      // Update timer & ball position if in play
      if (game.launched) {
        game.elapsedMs += dt * 1000;
        const currentSec = Math.floor(game.elapsedMs / 1000);
        setElapsedSec((prev) => (prev !== currentSec ? currentSec : prev));

        // Add ball trail point
        ballTrail.push({ x: ball.x, y: ball.y, alpha: 0.5 });
        if (ballTrail.length > 5) {
          ballTrail.shift();
        }
      } else {
        // When not launched, ball tracks with paddle exactly
        ball.x = paddle.x;
        const paddleTop = paddle.y - paddle.h / 2;
        ball.y = paddleTop - ball.r - 2;
      }

      // Physics update when launched
      if (game.launched) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Left / Right wall bounce
        if (ball.x - ball.r <= 0) {
          ball.x = ball.r;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x + ball.r >= width) {
          ball.x = width - ball.r;
          ball.vx = -Math.abs(ball.vx);
        }

        // Top ceiling bounce
        if (ball.y - ball.r <= 0) {
          ball.y = ball.r;
          ball.vy = Math.abs(ball.vy);
        }

        // Paddle collision
        const paddleTop = paddle.y - paddle.h / 2;
        const paddleBottom = paddle.y + paddle.h / 2;
        const paddleLeft = paddle.x - paddle.w / 2;
        const paddleRight = paddle.x + paddle.w / 2;

        if (
          ball.y + ball.r >= paddleTop &&
          ball.y - ball.r <= paddleBottom &&
          ball.x >= paddleLeft - ball.r &&
          ball.x <= paddleRight + ball.r &&
          ball.vy > 0
        ) {
          ball.y = paddleTop - ball.r;
          const hitOffset = (ball.x - paddle.x) / (paddle.w / 2);
          const clampedOffset = Math.max(-0.85, Math.min(0.85, hitOffset));
          const maxAngle = Math.PI * 0.38; // ~68 degrees
          const bounceAngle = clampedOffset * maxAngle;
          const speed = Math.hypot(ball.vx, ball.vy);

          ball.vx = Math.sin(bounceAngle) * speed;
          ball.vy = -Math.cos(bounceAngle) * speed;

          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(8);
          }
        }

        // Block collisions
        for (const block of blocks) {
          if (block.destroyed) continue;

          const testX = Math.max(block.x, Math.min(ball.x, block.x + block.w));
          const testY = Math.max(block.y, Math.min(ball.y, block.y + block.h));
          const distX = ball.x - testX;
          const distY = ball.y - testY;
          const distSq = distX * distX + distY * distY;

          if (distSq <= ball.r * ball.r) {
            block.destroyed = true;

            const overlapLeft = ball.x + ball.r - block.x;
            const overlapRight = block.x + block.w - (ball.x - ball.r);
            const overlapTop = ball.y + ball.r - block.y;
            const overlapBottom = block.y + block.h - (ball.y - ball.r);
            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);

            if (minOverlapX < minOverlapY) {
              ball.vx = -ball.vx;
            } else {
              ball.vy = -ball.vy;
            }

            spawnBlockParticles(block.x, block.y, block.w, block.h, block.borderColor, 12);

            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(14);
            }

            const nextRemaining = blocks.filter((b) => !b.destroyed).length;
            setBlocksRemaining(nextRemaining);

            // Level Complete or Final Victory!
            if (nextRemaining === 0) {
              game.launched = false;

              if (currentLevelIdx >= LEVELS.length - 1) {
                // Final Level 5 cleared! Twist: Reveal the secret surprise!
                spawnCelebrationParticles(true);
                setGameState("victory");

                const randomMsg =
                  SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)];
                setSecretMessage(randomMsg);

                const finalTime = Math.floor(game.elapsedMs / 1000);
                setBestTime((prev) => {
                  if (prev === null || finalTime < prev) {
                    try {
                      localStorage.setItem("portfolio_smash_blocks_best_time", String(finalTime));
                    } catch {
                      // Ignore
                    }
                    return finalTime;
                  }
                  return prev;
                });
              } else {
                // Intermediate level completed
                spawnCelebrationParticles(false);
                setGameState("level_complete");
              }
            }
            break;
          }
        }

        // Ball fell below paddle (Lost ball)
        if (ball.y - ball.r > height) {
          game.launched = false;
          setLives((currentLives) => {
            const nextLives = currentLives - 1;
            if (nextLives <= 0) {
              setGameState("gameover");
            } else {
              resetBallOnPaddle();
              setGameState("ready");
            }
            return nextLives;
          });
        }
      }

      // DRAW BLOCKS: Futuristic Cyber-Neon Tiles
      const activeBlocks = blocks.filter((b) => !b.destroyed);
      const isFinalLevel = currentLevelIdx === LEVELS.length - 1;
      const isLastBlockRemaining = isFinalLevel && activeBlocks.length === 1;

      for (const block of blocks) {
        if (block.destroyed) continue;

        ctx.save();
        const radius = 5;

        // Final mystery block highlight
        if (isLastBlockRemaining) {
          const pulse = (Math.sin(now * 0.008) + 1) * 0.5;
          ctx.shadowColor = "rgba(250, 204, 21, 0.85)";
          ctx.shadowBlur = 14 + pulse * 10;
          ctx.fillStyle = isCurrentLight ? "#fef08a" : "rgba(250, 204, 21, 0.35)";
          ctx.strokeStyle = isCurrentLight ? "#ca8a04" : "#fef08a";
          ctx.lineWidth = 2;
        } else {
          // Futuristic glow border
          ctx.shadowColor = block.borderColor;
          ctx.shadowBlur = isCurrentLight ? 3 : 7;
          ctx.fillStyle = block.color;
          ctx.strokeStyle = block.borderColor;
          ctx.lineWidth = 1.5;
        }

        // Cybernetic rounded tile
        ctx.beginPath();
        ctx.roundRect(block.x, block.y, block.w, block.h, radius);
        ctx.fill();
        ctx.stroke();

        // Futuristic top laser scanline / edge highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = isCurrentLight
          ? "rgba(255, 255, 255, 0.65)"
          : "rgba(255, 255, 255, 0.28)";
        ctx.beginPath();
        ctx.roundRect(block.x + 3, block.y + 1.5, block.w - 6, 2, 1);
        ctx.fill();

        // Mystery mark in the final block
        if (isLastBlockRemaining) {
          ctx.fillStyle = isCurrentLight ? "#854d0e" : "#ffffff";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("✨", block.x + block.w / 2, block.y + block.h / 2);
        }

        ctx.restore();
      }

      // DRAW PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // DRAW PADDLE: Matte Pill
      ctx.save();
      const pTop = paddle.y - paddle.h / 2;
      const pLeft = paddle.x - paddle.w / 2;

      ctx.shadowColor = isCurrentLight ? "rgba(0, 0, 0, 0.16)" : "rgba(250, 250, 250, 0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = isCurrentLight ? 2 : 0;

      const paddleGrad = ctx.createLinearGradient(0, pTop, 0, pTop + paddle.h);
      if (isCurrentLight) {
        paddleGrad.addColorStop(0, "#27272a");
        paddleGrad.addColorStop(1, "#18181b");
      } else {
        paddleGrad.addColorStop(0, "#fafafa");
        paddleGrad.addColorStop(1, "#d4d4d8");
      }
      ctx.fillStyle = paddleGrad;
      ctx.beginPath();
      ctx.roundRect(pLeft, pTop, paddle.w, paddle.h, paddle.h / 2);
      ctx.fill();

      // Top paddle reflection line
      ctx.fillStyle = isCurrentLight ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.roundRect(pLeft + 6, pTop + 1, paddle.w - 12, 2.5, 1.5);
      ctx.fill();
      ctx.restore();

      // DRAW BALL TRAIL (Laser Red)
      if (game.launched && !reduceMotion) {
        for (let i = 0; i < ballTrail.length; i++) {
          const pt = ballTrail[i];
          const trailAlpha = ((i + 1) / (ballTrail.length + 1)) * 0.35;
          const trailR = ball.r * (0.55 + 0.35 * (i / ballTrail.length));

          ctx.save();
          ctx.fillStyle = isCurrentLight
            ? `rgba(220, 38, 38, ${trailAlpha})`
            : `rgba(255, 59, 48, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // DRAW BALL: Cool Red Dot
      ctx.save();
      const ballColor = isCurrentLight ? "#dc2626" : "#ff3b30";
      const ballGlow = isCurrentLight ? "rgba(220, 38, 38, 0.4)" : "rgba(255, 59, 48, 0.8)";

      // Subtle red laser aura
      ctx.shadowColor = ballGlow;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = isCurrentLight ? 1 : 0;

      // Solid vivid red dot body
      ctx.fillStyle = ballColor;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // Hairline perimeter ring for crisp contrast against any surface
      if (isCurrentLight) {
        ctx.strokeStyle = "rgba(153, 27, 27, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cool laser pin-point specular dot
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(ball.x - ball.r * 0.3, ball.y - ball.r * 0.3, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reduceMotion, spawnBlockParticles, spawnCelebrationParticles, resetBallOnPaddle]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-2xl">
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[24px] opacity-70 motion-reduce:opacity-50"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse at 50% 42%, rgba(0, 240, 255, 0.1) 0%, rgba(168, 85, 247, 0.05) 42%, transparent 72%)",
            }}
          />

          {/* Premium Outer Card Frame matching Portfolio system */}
          <div
            className={cn(
              "relative rounded-[18px] border border-border/55 p-1.5",
              "bg-[color-mix(in_srgb,var(--surface-elevated)_90%,#00f0ff_10%)]",
              "shadow-[0_22px_44px_-22px_rgba(0,0,0,0.72),0_6px_14px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]",
            )}
          >
            {/* Inner Game Arena */}
            <div
              ref={containerRef}
              className={cn(
                "relative overflow-hidden rounded-2xl select-none",
                "h-[320px] sm:h-[350px]",
                "bg-surface border border-border/40",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-10px_22px_rgba(0,0,0,0.25)]",
              )}
            >
              {/* TOP HUD */}
              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border/50 bg-surface-elevated/85 px-3 py-1.5 backdrop-blur-sm sm:px-5">
                {/* Level Indicator with Speed Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-foreground border border-border/60">
                    Level {levelIndex + 1}/5
                  </span>
                  <span className="hidden sm:inline text-xs text-muted">
                    {LEVELS[levelIndex]?.name}
                  </span>
                  <span className="rounded bg-surface-elevated px-1 py-0.5 text-[9px] font-mono font-medium text-amber-500 light:text-amber-600 border border-border/40">
                    {LEVELS[levelIndex]?.speedLabel}
                  </span>
                </div>

                {/* Blocks Count */}
                <div className="flex items-center gap-1 text-xs font-medium">
                  <span className="text-[11px] uppercase tracking-wider text-muted">Blocks</span>
                  <span className="font-mono font-semibold text-foreground">
                    {totalLevelBlocks - blocksRemaining}/{totalLevelBlocks}
                  </span>
                </div>

                {/* Timer */}
                <div className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                  0:{elapsedSec.toString().padStart(2, "0")}
                </div>

                {/* Lives & Reset */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-0.5" title={`${lives} balls remaining`}>
                    {[...Array(3)].map((_, i) => (
                      <Heart
                        key={i}
                        className={cn(
                          "size-3 sm:size-3.5 transition-colors",
                          i < lives
                            ? "fill-rose-500 text-rose-500"
                            : "fill-transparent text-muted/30",
                        )}
                      />
                    ))}
                  </div>

                  {bestTime !== null && (
                    <div className="hidden md:flex items-center gap-1 text-[11px] text-muted">
                      <Trophy className="size-3 text-amber-500" />
                      <span>{bestTime}s</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={startNewGame}
                    aria-label="Restart game from Level 1"
                    title="Restart game from Level 1"
                    className="rounded p-1 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* INTERACTIVE CANVAS */}
              <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                className="absolute inset-0 z-10 block h-full w-full cursor-pointer touch-none"
                aria-label="Smash the Blocks arcade game. Move paddle to bounce ball."
              />

              {/* READY / LAUNCH PROMPT OVERLAY */}
              {gameState === "ready" && (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 px-4 text-center">
                  <div className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/90 px-3.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
                    <Play className="size-3 fill-current text-rose-500" />
                    <span>Click or press Space to launch</span>
                  </div>
                </div>
              )}

              {/* LEVEL COMPLETE OVERLAY (INTERMEDIATE LEVELS) */}
              {gameState === "level_complete" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-surface/92 p-6 text-center backdrop-blur-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500 light:text-emerald-700">
                    <Sparkles className="size-3.5" />
                    <span>Level {levelIndex + 1} Cleared!</span>
                  </div>

                  <h3 className="mt-2 text-h3 font-semibold tracking-tight text-foreground">
                    Level {levelIndex + 1} Complete!
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-muted">
                    Next: {LEVELS[levelIndex + 1]?.name} ({LEVELS[levelIndex + 1]?.speedLabel} speed)
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={advanceToNextLevel}>
                      <span>Continue to Level {levelIndex + 2}</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* FINAL VICTORY OVERLAY (TWIST: SECRET SURPRISE MESSAGE) */}
              {gameState === "victory" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-surface/95 p-6 text-center backdrop-blur-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500 light:text-amber-700">
                    <Sparkles className="size-3.5" />
                    <span>All 5 Levels Cleared!</span>
                  </div>

                  <h3 className="mt-2 text-h3 font-semibold tracking-tight text-foreground">
                    Secret Message Unlocked
                  </h3>

                  <div className="mt-3 max-w-md rounded-xl border border-border/60 bg-surface-elevated/90 p-3.5 shadow-sm">
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground font-medium">
                      &ldquo;{secretMessage}&rdquo;
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 text-xs text-muted">
                    <span>Total Time:</span>
                    <span className="font-mono font-semibold text-foreground">{elapsedSec}s</span>
                    {bestTime !== null && elapsedSec <= bestTime && (
                      <span className="text-amber-500 font-medium">🏆 Personal Best!</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={startNewGame}>
                      <RotateCcw className="size-3.5" />
                      <span>Play Again</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* GAME OVER OVERLAY */}
              {gameState === "gameover" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-surface/95 p-6 text-center backdrop-blur-md">
                  <div className="rounded-full border border-border/80 bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-muted">
                    <span>Out of Balls</span>
                  </div>

                  <h3 className="mt-2 text-h3 font-semibold tracking-tight text-foreground">
                    Game Over
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-muted">
                    You made it to Level {levelIndex + 1} with {blocksRemaining}{" "}
                    {blocksRemaining === 1 ? "block" : "blocks"} left.
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={startNewGame}>
                      <RotateCcw className="size-3.5" />
                      <span>Start from Level 1</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom guidance */}
        <p className="mt-3 text-[11px] text-muted/55">
          {levelIndex === 4 && blocksRemaining === 1
            ? "✨ Final Mystery Block! Smash it to unlock the secret message."
            : `Level ${levelIndex + 1} of 5 • Speed: ${LEVELS[levelIndex]?.speedLabel} • Move paddle to bounce ball and destroy blocks`}
        </p>
      </div>
    </div>
  );
}
