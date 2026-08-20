import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useReducedMotion } from "./useReducedMotion";

const transitionDuration = 320;
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
  const transitionStartTimeoutRef = useRef<number>(undefined);
  const transitionTimeoutRef = useRef<number>(undefined);
  const transitioningRef = useRef(false);
  const [layers, setLayers] = useState<readonly TransitionLayer[]>([
    { content: children, key: transitionKey, motion: "current" },
  ]);
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
      activeKeyRef.current = transitionKey;

      if (reduceMotion) {
        transitioningRef.current = false;
        setLayers([
          { content: children, key: transitionKey, motion: "current" },
        ]);
        return;
      }

      transitioningRef.current = true;
      setLayers((currentLayers) => {
        const currentLayer = currentLayers[currentLayers.length - 1];

        return [
          { ...currentLayer, motion: "outgoing" },
          {
            content: children,
            key: transitionKey,
            motion: "incoming",
          },
        ];
      });
      transitionTimeoutRef.current = window.setTimeout(() => {
        transitioningRef.current = false;
        setLayers([
          { content: children, key: transitionKey, motion: "current" },
        ]);
      }, transitionDuration);
    }, 0);

    return () => {
      window.clearTimeout(transitionStartTimeoutRef.current);
      window.clearTimeout(transitionTimeoutRef.current);
    };
  }, [children, reduceMotion, transitionKey]);

  return (
    <div className="screen-transition" style={transitionStyle}>
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
