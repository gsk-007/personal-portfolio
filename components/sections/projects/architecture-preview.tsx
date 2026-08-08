"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArchitectureNode } from "@/lib/content/project-architecture";
import { cn } from "@/lib/utils";

const SIGNAL_DURATION = 0.85;

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

export function ArchitecturePreview({
  nodes,
  techTimeline,
  isActive = false,
  size = "panel",
  className,
  onHighlightedTechChange,
}: ArchitecturePreviewProps) {
  const reduceMotion = useReducedMotion();
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [signalKey, setSignalKey] = useState(0);
  const timersRef = useRef<number[]>([]);
  const onHighlightRef = useRef(onHighlightedTechChange);
  const lastTechKeysRef = useRef<string[]>([]);
  const activeNodeIdsRef = useRef<string[]>([]);

  const signalSteps = useMemo(() => buildSignalSteps(nodes), [nodes]);

  onHighlightRef.current = onHighlightedTechChange;

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
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
      activeNodeIdsRef.current = [];
      setActiveNodeIds([]);
      resetHighlight();
      return clearTimers;
    }

    if (reduceMotion) {
      activeNodeIdsRef.current = [];
      setActiveNodeIds([]);
      resetHighlight();
      return clearTimers;
    }

    setSignalKey((key) => key + 1);
    activeNodeIdsRef.current = [];
    setActiveNodeIds([]);
    resetHighlight();

    signalSteps.forEach((step, index) => {
      if (index === signalSteps.length - 1) {
        const resetTimer = window.setTimeout(() => {
          setActiveNodes([]);
          if (techTimeline?.length) {
            resetHighlight();
          }
        }, SIGNAL_DURATION * 1000 + 40);
        timersRef.current.push(resetTimer);
        return;
      }

      const timer = window.setTimeout(() => {
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
          {!reduceMotion && isActive ? (
            <motion.div
              key={signalKey}
              className="pointer-events-none absolute top-1/2 z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/75 shadow-[0_0_6px_rgba(250,250,250,0.4)]"
              initial={{ left: "6%", opacity: 0 }}
              animate={{ left: "94%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: SIGNAL_DURATION, ease: "linear" }}
            />
          ) : null}

          {mainPathNodes.map((node, index) => (
            <div
              key={node.id}
              className={cn(
                "flex min-w-0 flex-1 items-center",
                index < mainPathNodes.length - 1 && "gap-1.5 sm:gap-2",
              )}
            >
              <ArchNode
                node={node}
                active={isActive && activeNodeIds.includes(node.id)}
                isFeatured={isFeatured}
              />

              {index < mainPathNodes.length - 1 ? (
                <div
                  className={cn(
                    "shrink-0 bg-border/70",
                    isFeatured ? "h-px w-3 sm:w-5" : "h-px w-2 sm:w-3",
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>

        {redisNode && isFeatured ? (
          <div className="mt-3 flex justify-center">
            <div className="flex w-[38%] flex-col items-center">
              <div className="h-3 w-px bg-border/60" />
              <ArchNode
                node={redisNode}
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

function ArchNode({
  node,
  active,
  isFeatured,
  className,
}: {
  node: ArchitectureNode;
  active: boolean;
  isFeatured: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-w-0 flex-1 rounded-lg border bg-surface-elevated/70",
        "transition-[border-color,background-color,box-shadow] duration-300",
        isFeatured ? "px-2.5 py-2.5 sm:px-3 sm:py-3" : "px-2 py-1.5",
        active
          ? "border-foreground/22 bg-surface-elevated/95 shadow-[0_0_12px_-4px_rgba(250,250,250,0.14)]"
          : "border-border/55",
        className,
      )}
    >
      <p
        className={cn(
          "truncate font-semibold tracking-tight text-foreground",
          isFeatured ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs",
        )}
      >
        {node.label}
      </p>
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

      <span
        className={cn(
          "absolute right-1.5 top-1.5 size-1.5 rounded-full border transition-colors duration-300",
          active
            ? "border-emerald-400/50 bg-emerald-400/90"
            : "border-border/60 bg-background/80",
        )}
      />
    </div>
  );
}
