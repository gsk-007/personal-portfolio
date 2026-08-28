"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArchitectureNode } from "@/lib/content/project-architecture";
import { cn } from "@/lib/utils";

const SIGNAL_DURATION = 2.4;
const HOLD_AFTER_MS = 800;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;
const SNAP_EASE = [0.22, 1, 0.36, 1] as const;

type SignalStep = {
  progress: number;
  nodeIds: string[];
  techKeys: string[];
};

type ArchitecturePreviewProps = {
  nodes: ArchitectureNode[];
  techTimeline?: readonly string[];
  isActive?: boolean;
  size?: "featured" | "panel";
  className?: string;
  onHighlightedTechChange?: (tech: string[]) => void;
};

function buildSignalSteps(nodes: ArchitectureNode[]): SignalStep[] {
  const mainPath = nodes.filter((node) => node.id !== "redis");
  const redisNode = nodes.find((node) => node.id === "redis");

  if (mainPath.length === 0) {
    return [{ progress: 1, nodeIds: [], techKeys: [] }];
  }

  const steps: SignalStep[] = mainPath.map((node, index) => {
    const isApiWithRedis = node.id === "api" && redisNode;
    const nodeIds = isApiWithRedis ? [node.id, redisNode.id] : [node.id];
    const techKeys = isApiWithRedis
      ? [...(node.techKeys ?? []), ...(redisNode.techKeys ?? [])]
      : (node.techKeys ?? []);

    return {
      progress:
        mainPath.length === 1 ? 0 : index / (mainPath.length - 1),
      nodeIds,
      techKeys,
    };
  });

  steps.push({ progress: 1, nodeIds: [], techKeys: [] });

  return steps;
}

function techKeysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((key, index) => key === b[index]);
}

function nodeIdsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
}

function mergeNodeIds(current: string[], next: string[]) {
  const merged = [...current];

  next.forEach((id) => {
    if (!merged.includes(id)) {
      merged.push(id);
    }
  });

  return merged;
}

export function ArchitecturePreview({
  nodes,
  techTimeline,
  isActive = false,
  size = "panel",
  className,
  onHighlightedTechChange,
}: ArchitecturePreviewProps) {
  const reduceMotion = useReducedMotion();
  const [filledNodeIds, setFilledNodeIds] = useState<string[]>([]);
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const timersRef = useRef<number[]>([]);
  const onHighlightRef = useRef(onHighlightedTechChange);
  const lastTechKeysRef = useRef<string[]>([]);
  const filledNodeIdsRef = useRef<string[]>([]);
  const activeNodeIdsRef = useRef<string[]>([]);

  const signalSteps = useMemo(() => buildSignalSteps(nodes), [nodes]);

  onHighlightRef.current = onHighlightedTechChange;

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const setFilledNodes = (nodeIds: string[]) => {
    if (nodeIdsEqual(nodeIds, filledNodeIdsRef.current)) {
      return;
    }

    filledNodeIdsRef.current = nodeIds;
    setFilledNodeIds(nodeIds);
  };

  const setActiveNodes = (nodeIds: string[]) => {
    if (nodeIdsEqual(nodeIds, activeNodeIdsRef.current)) {
      return;
    }

    activeNodeIdsRef.current = nodeIds;
    setActiveNodeIds(nodeIds);
  };

  const notifyTechHighlight = (techKeys: string[]) => {
    if (techKeysEqual(lastTechKeysRef.current, techKeys)) return;
    lastTechKeysRef.current = techKeys;
    onHighlightRef.current?.(techKeys);
  };

  const resetHighlight = () => {
    if (lastTechKeysRef.current.length === 0) {
      return;
    }

    lastTechKeysRef.current = [];
    onHighlightRef.current?.([]);
  };

  useEffect(() => {
    clearTimers();

    if (!isActive) {
      filledNodeIdsRef.current = [];
      activeNodeIdsRef.current = [];
      setFilledNodeIds([]);
      setActiveNodeIds([]);
      resetHighlight();
      return clearTimers;
    }

    if (reduceMotion) {
      filledNodeIdsRef.current = [];
      activeNodeIdsRef.current = [];
      setFilledNodeIds([]);
      setActiveNodeIds([]);
      resetHighlight();
      return clearTimers;
    }

    filledNodeIdsRef.current = [];
    activeNodeIdsRef.current = [];
    setFilledNodeIds([]);
    setActiveNodeIds([]);
    resetHighlight();

    signalSteps.forEach((step, index) => {
      if (index === signalSteps.length - 1) {
        const resetTimer = window.setTimeout(() => {
          setFilledNodes([]);
          setActiveNodes([]);
          if (techTimeline?.length) {
            resetHighlight();
          }
        }, SIGNAL_DURATION * 1000 + HOLD_AFTER_MS);
        timersRef.current.push(resetTimer);
        return;
      }

      const timer = window.setTimeout(() => {
        const nextFilled = mergeNodeIds(filledNodeIdsRef.current, step.nodeIds);
        setFilledNodes(nextFilled);
        setActiveNodes(step.nodeIds);
      }, step.progress * SIGNAL_DURATION * 1000);
      timersRef.current.push(timer);
    });

    if (techTimeline && techTimeline.length > 0) {
      techTimeline.forEach((_, index) => {
        const progress =
          techTimeline.length === 1
            ? 0
            : index / (techTimeline.length - 1);

        const timer = window.setTimeout(() => {
          notifyTechHighlight(techTimeline.slice(0, index + 1));
        }, progress * SIGNAL_DURATION * 1000);
        timersRef.current.push(timer);
      });
    }

    return clearTimers;
  }, [isActive, reduceMotion, signalSteps, techTimeline]);

  const isFeatured = size === "featured";
  const mainPathNodes = nodes.filter((node) => node.id !== "redis");
  const redisNode = nodes.find((node) => node.id === "redis");

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col",
        isFeatured ? "justify-center" : "justify-end",
        className,
      )}
      aria-hidden="true"
    >
      {isFeatured ? (
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
          Request flow
        </p>
      ) : null}

      <div className={cn("relative", isFeatured ? "px-1" : "px-0.5")}>
        <div
          className={cn(
            "relative flex items-center",
            isFeatured ? "gap-1.5 sm:gap-2" : "gap-1",
          )}
        >
          {mainPathNodes.map((node, index) => {
            const filled = isActive && filledNodeIds.includes(node.id);
            const active = isActive && activeNodeIds.includes(node.id);
            const previousFilled =
              index > 0 &&
              isActive &&
              filledNodeIds.includes(mainPathNodes[index - 1]?.id ?? "");
            const linkLit = previousFilled;

            return (
              <div
                key={node.id}
                className={cn(
                  "flex min-w-0 flex-1 items-center",
                  index < mainPathNodes.length - 1 && "gap-1.5 sm:gap-2",
                )}
              >
                <ArchNode
                  node={node}
                  filled={filled}
                  active={active}
                  isFeatured={isFeatured}
                />

                {index < mainPathNodes.length - 1 ? (
                  <FlowConnector
                    lit={linkLit}
                    reduceMotion={Boolean(reduceMotion)}
                    featured={isFeatured}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {redisNode && isFeatured ? (
          <div className="mt-3 flex justify-center">
            <div className="flex w-[38%] flex-col items-center">
              <ArchNode
                node={redisNode}
                filled={isActive && filledNodeIds.includes(redisNode.id)}
                active={isActive && activeNodeIds.includes(redisNode.id)}
                isFeatured={isFeatured}
                className="w-full"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FlowConnector({
  lit,
  reduceMotion,
  featured,
}: {
  lit: boolean;
  reduceMotion: boolean;
  featured: boolean;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-border/70",
        featured ? "h-[2px] w-3 sm:w-5" : "h-[2px] w-2 sm:w-3",
      )}
    >
      <motion.div
        className="absolute inset-0 origin-left bg-foreground/65 light:bg-heading/70"
        initial={false}
        animate={{ scaleX: lit ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.7, ease: FILL_EASE, delay: lit ? 0.12 : 0 }
        }
      />
    </div>
  );
}

function ArchNode({
  node,
  filled,
  active,
  isFeatured,
  className,
}: {
  node: ArchitectureNode;
  filled: boolean;
  active: boolean;
  isFeatured: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "relative min-w-0 flex-1 overflow-hidden rounded-lg border bg-surface-elevated/40 light:bg-white light:border-border/80",
        isFeatured ? "px-2.5 py-2.5 sm:px-3 sm:py-3" : "px-2 py-1.5",
        filled
          ? "border-foreground/30 light:border-heading/30"
          : "border-border/55",
        className,
      )}
      initial={false}
      animate={
        reduceMotion
          ? { scale: 1 }
          : {
              scale: active ? 1.045 : filled ? 1.015 : 1,
            }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 460, damping: 30, mass: 0.7 }
      }
    >
      <motion.div
        className="absolute inset-0 origin-left bg-foreground/8 light:bg-heading/8"
        initial={false}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.85, ease: FILL_EASE }
        }
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-y-0 left-0 w-[2px] origin-center bg-foreground/80 light:bg-heading"
        initial={false}
        animate={{
          scaleY: active ? 1 : filled ? 0.7 : 0,
          opacity: filled ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.65, ease: FILL_EASE }
        }
        aria-hidden="true"
      />

      <div className="relative">
        <motion.p
          className={cn(
            "truncate font-semibold tracking-tight",
            isFeatured ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs",
          )}
          initial={false}
          animate={{
            color: filled
              ? "var(--heading, var(--foreground))"
              : "var(--foreground)",
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: SNAP_EASE }
          }
        >
          {node.label}
        </motion.p>
        {node.sublabel ? (
          <p
            className={cn(
              "truncate text-muted-foreground",
              isFeatured ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]",
            )}
          >
            {node.sublabel}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
