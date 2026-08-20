import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { calculateAdjustedSuccessChance } from "../domain/events";
import type { Decision, DecisionEvent, Pilot } from "../domain/types";
import { translate } from "../i18n";
import { Badge } from "./UiPrimitives";
import { useReducedMotion } from "./useReducedMotion";

interface DecisionSelectionScreenProps {
  event: DecisionEvent;
  onDecision: (decision: Decision) => void;
  pilot: Pilot;
  reducedMotion: boolean;
  titleId: string;
}

export function DecisionSelectionScreen({
  event,
  onDecision,
  pilot,
  reducedMotion,
  titleId,
}: DecisionSelectionScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation("interface");
  const terminalDescription = translate(event.introductionKey, {
    name: pilot.name,
  });
  const terminalTitle = translate(event.titleKey);
  const typedTransmission = useTerminalTyping(
    terminalTitle,
    terminalDescription,
    reducedMotion,
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <header className="decision-screen__heading">
        <div className="decision-screen__terminal-bar">
          <Badge>{t("decisionScreen.badge")}</Badge>
          <span className="decision-screen__channel">
            {t("decisionScreen.channel")}
          </span>
        </div>
        <div
          className="decision-screen__terminal-line"
          data-typing={!typedTransmission.titleComplete || undefined}
        >
          <span aria-hidden="true" className="decision-screen__prompt">
            &gt;
          </span>
          <h1
            aria-label={terminalTitle}
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
          >
            {typedTransmission.title}
          </h1>
        </div>
        <div
          className="decision-screen__terminal-line"
          data-typing={
            (typedTransmission.titleComplete && typedTransmission.isTyping) ||
            undefined
          }
        >
          <span aria-hidden="true" className="decision-screen__prompt">
            $
          </span>
          <p aria-label={terminalDescription}>
            {typedTransmission.description}
          </p>
        </div>
      </header>

      <section
        aria-labelledby={`${titleId}-decisions`}
        className="decision-screen__choices"
      >
        <h2 id={`${titleId}-decisions`}>{t("decisionScreen.choose")}</h2>
        <div className="decision-screen__choice-grid">
          {event.decisions.map((decision) => (
            <DecisionOption
              decision={decision}
              key={decision.id}
              onDecision={onDecision}
              pilot={pilot}
            />
          ))}
        </div>
      </section>
    </>
  );
}

interface DecisionOptionProps {
  decision: Decision;
  onDecision: (decision: Decision) => void;
  pilot: Pilot;
}

function DecisionOption({ decision, onDecision, pilot }: DecisionOptionProps) {
  const { t } = useTranslation("interface");
  const success =
    decision.kind === "chance"
      ? calculateAdjustedSuccessChance(decision, pilot.stats)
      : null;
  const accessibilityLabel =
    success === null
      ? t("decisionScreen.safeOptionLabel", {
          decision: translate(decision.labelKey),
        })
      : t("decisionScreen.riskOptionLabel", {
          decision: translate(decision.labelKey),
          failure: 100 - success,
          success,
        });

  return (
    <button
      aria-label={accessibilityLabel}
      className="decision-option"
      onClick={() => onDecision(decision)}
      type="button"
    >
      <span className="decision-option__copy">
        <strong>{translate(decision.labelKey)}</strong>
        <span>{translate(decision.descriptionKey)}</span>
      </span>
      <span className="decision-option__result">
        <span
          className={`decision-option__kind decision-option__kind--${decision.kind}`}
        >
          {decision.kind === "safe" ? (
            t("decisionScreen.safe")
          ) : (
            <>
              <span className="decision-option__risk-full">
                {t("decisionScreen.risk")}
              </span>
              <span className="decision-option__risk-compact">
                {t("decisionScreen.riskCompact", { success })}
              </span>
            </>
          )}
        </span>
        {success === null ? null : <DecisionProbability success={success} />}
      </span>
    </button>
  );
}

interface DecisionProbabilityProps {
  success: number;
}

function DecisionProbability({ success }: DecisionProbabilityProps) {
  const { t } = useTranslation("interface");
  const failure = 100 - success;
  const targetStyle = {
    "--success-percent": `${success}%`,
  } as CSSProperties;

  return (
    <span className="decision-probability">
      <span
        aria-label={t("decisionScreen.probabilityLabel", { failure, success })}
        className="decision-probability__target"
        role="img"
        style={targetStyle}
      >
        <strong>{success}%</strong>
      </span>
    </span>
  );
}

interface TypedTransmission {
  description: string;
  isTyping: boolean;
  title: string;
  titleComplete: boolean;
}

function useTerminalTyping(
  title: string,
  description: string,
  reducedMotion: boolean,
): TypedTransmission {
  const reduceMotion = useReducedMotion(reducedMotion);
  const totalCharacters = title.length + description.length;
  const [characterCount, setCharacterCount] = useState(
    reduceMotion ? totalCharacters : 0,
  );

  useEffect(() => {
    if (reduceMotion) return;

    const resetTimeout = window.setTimeout(() => setCharacterCount(0), 0);
    const interval = window.setInterval(() => {
      setCharacterCount((currentCount) => {
        if (currentCount >= totalCharacters) {
          window.clearInterval(interval);
          return totalCharacters;
        }

        return currentCount + 1;
      });
    }, 8);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resetTimeout);
    };
  }, [description, reduceMotion, title, totalCharacters]);

  const visibleCharacters = reduceMotion ? totalCharacters : characterCount;
  const titleCharacters = Math.min(visibleCharacters, title.length);
  const descriptionCharacters = Math.max(0, visibleCharacters - title.length);

  return {
    description: description.slice(0, descriptionCharacters),
    isTyping: visibleCharacters < totalCharacters,
    title: title.slice(0, titleCharacters),
    titleComplete: titleCharacters === title.length,
  };
}
