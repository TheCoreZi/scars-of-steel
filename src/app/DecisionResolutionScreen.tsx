import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import type {
  DecisionEvent,
  ResolvedYear,
  ChanceDecisionResolution,
} from "../domain/types";
import { translate } from "../i18n";
import { Badge } from "./UiPrimitives";
import { useReducedMotion } from "./useReducedMotion";

const animatedOutcomeDelay = 1800;
const impactDelay = 1000;
const reducedMotionOutcomeDelay = 2000;

interface DecisionResolutionScreenProps {
  event: DecisionEvent;
  onRevealOutcome: () => void;
  reducedMotion: boolean;
  result: ResolvedYear & { resolution: ChanceDecisionResolution };
  titleId: string;
}

export function DecisionResolutionScreen({
  event,
  onRevealOutcome,
  reducedMotion,
  result,
  titleId,
}: DecisionResolutionScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation("interface");
  const reduceMotion = useReducedMotion(reducedMotion);
  const [showIndicator, setShowIndicator] = useState(false);
  const decision = event.decisions.find(
    ({ id }) => id === result.resolution.decisionId,
  );
  const {
    adjustedSuccessChance,
    result: resolutionResult,
    roll,
  } = result.resolution;
  const indicatorVisible = reduceMotion || showIndicator;
  const angle = (roll / 100) * Math.PI * 2 - Math.PI / 2;
  const targetStyle = {
    "--impact-x": `${50 + Math.cos(angle) * 32}%`,
    "--impact-y": `${50 + Math.sin(angle) * 32}%`,
    "--success-percent": `${adjustedSuccessChance}%`,
  } as CSSProperties;

  useEffect(() => {
    headingRef.current?.focus();

    const indicatorTimeout = reduceMotion
      ? undefined
      : window.setTimeout(() => setShowIndicator(true), impactDelay);
    const outcomeTimeout = window.setTimeout(
      onRevealOutcome,
      reduceMotion ? reducedMotionOutcomeDelay : animatedOutcomeDelay,
    );

    return () => {
      if (indicatorTimeout !== undefined) {
        window.clearTimeout(indicatorTimeout);
      }

      window.clearTimeout(outcomeTimeout);
    };
  }, [onRevealOutcome, reduceMotion]);

  return (
    <div
      aria-labelledby={titleId}
      className="resolution-screen"
      data-reduced-motion={reduceMotion || undefined}
    >
      <Badge>{t("resolutionScreen.badge")}</Badge>
      <h1 id={titleId} ref={headingRef} tabIndex={-1}>
        {t("resolutionScreen.selected")}
      </h1>
      <strong className="resolution-screen__decision">
        {decision ? translate(decision.labelKey) : ""}
      </strong>
      <div className="resolution-screen__target-wrap">
        <div
          aria-label={t("resolutionScreen.probabilityLabel", {
            failure: 100 - adjustedSuccessChance,
            success: adjustedSuccessChance,
          })}
          className="resolution-screen__target"
          role="img"
          style={targetStyle}
        >
          <span aria-hidden="true" className="resolution-screen__impact" />
        </div>
      </div>
      <p
        aria-live="assertive"
        className="resolution-screen__indicator"
        data-result={resolutionResult}
        data-visible={indicatorVisible || undefined}
        role="status"
      >
        {indicatorVisible
          ? t(
              resolutionResult === "success"
                ? "resolutionScreen.indicatorSuccess"
                : "resolutionScreen.indicatorFailure",
            )
          : "\u00a0"}
      </p>
    </div>
  );
}
