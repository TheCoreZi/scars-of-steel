import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useReducedMotion } from "./useReducedMotion";

const transitionDuration = 220;
const transitionStyle = {
  "--screen-transition-duration": `${transitionDuration}ms`,
} as CSSProperties;

interface ScreenTransitionProps {
  children: ReactNode;
  reducedMotion: boolean;
  transitionKey: string;
}

interface TransitionLayer {
  content: ReactNode;
  key: string;
  motion: "current" | "incoming" | "outgoing";
}

export function ScreenTransition({
  children,
  reducedMotion,
  transitionKey,
}: ScreenTransitionProps) {
  const reduceMotion = useReducedMotion(reducedMotion);
  const activeKeyRef = useRef(transitionKey);
  const contentRef = useRef(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionStartTimeoutRef = useRef<number>(undefined);
  const transitionTimeoutRef = useRef<number>(undefined);
  const transitioningRef = useRef(false);
  const [layers, setLayers] = useState<readonly TransitionLayer[]>([
    { content: children, key: transitionKey, motion: "current" },
  ]);
  useEffect(() => {
    contentRef.current = children;
  }, [children]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const layer = container?.querySelector<HTMLElement>(
      '.screen-transition__layer:not([data-motion="outgoing"])',
    );
    if (!container || !layer) return;

    const updateHeight = () => {
      if (transitioningRef.current) return;
      // Measure layout height without the scale applied by an ancestor transition.
      container.style.height = `${layer.offsetHeight}px`;
    };
    updateHeight();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(layer);
    return () => observer.disconnect();
  }, [layers]);

  useEffect(() => {
    window.clearTimeout(transitionStartTimeoutRef.current);
    window.clearTimeout(transitionTimeoutRef.current);

    if (
      activeKeyRef.current === transitionKey &&
      !(reduceMotion && transitioningRef.current)
    ) {
      return;
    }

    transitionStartTimeoutRef.current = window.setTimeout(() => {
      const container = containerRef.current;
      const panel = container?.closest(".panel") ?? container;
      const panelTop = panel?.getBoundingClientRect().top;
      if (panelTop !== undefined && panelTop < 0) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + panelTop),
          behavior: reduceMotion ? "instant" : "smooth",
        });
      }
      activeKeyRef.current = transitionKey;

      if (reduceMotion) {
        transitioningRef.current = false;
        setLayers([
          {
            content: contentRef.current,
            key: transitionKey,
            motion: "current",
          },
        ]);
        return;
      }

      transitioningRef.current = true;
      setLayers((currentLayers) => {
        const currentLayer = currentLayers[currentLayers.length - 1];

        return [
          { ...currentLayer, motion: "outgoing" },
          {
            content: contentRef.current,
            key: transitionKey,
            motion: "incoming",
          },
        ];
      });
      transitionTimeoutRef.current = window.setTimeout(() => {
        transitioningRef.current = false;
        setLayers([
          {
            content: contentRef.current,
            key: transitionKey,
            motion: "current",
          },
        ]);
      }, transitionDuration);
    }, 0);

    return () => {
      window.clearTimeout(transitionStartTimeoutRef.current);
      window.clearTimeout(transitionTimeoutRef.current);
    };
  }, [reduceMotion, transitionKey]);

  return (
    <div
      className="screen-transition"
      data-transitioning={
        layers.some((layer) => layer.motion === "incoming") || undefined
      }
      data-reduced-motion={reduceMotion || undefined}
      ref={containerRef}
      style={transitionStyle}
    >
      {layers.map((layer) => (
        <div
          aria-hidden={layer.motion === "outgoing" || undefined}
          className="screen-transition__layer"
          data-motion={layer.motion}
          inert={layer.motion === "outgoing" || undefined}
          key={layer.key}
        >
          {layer.key === transitionKey ? children : layer.content}
        </div>
      ))}
    </div>
  );
}
