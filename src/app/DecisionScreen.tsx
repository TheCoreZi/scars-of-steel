import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { calculateAdjustedSuccessChance } from "../domain/events";
import type {
  Decision,
  DecisionEvent,
  DecisionResolution,
  Pilot,
} from "../domain/types";
import { translate } from "../i18n";
import { CareerStatusBar } from "./CareerStatusBar";
import { Badge, Panel } from "./UiPrimitives";

interface DecisionScreenProps {
  event: DecisionEvent;
  onDecision: (decision: Decision) => void;
  pilot: Pilot;
  resolution?: DecisionResolution;
}

export function DecisionScreen({
  event,
  onDecision,
  pilot,
  resolution,
}: DecisionScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const { t } = useTranslation("interface");
  const terminalDescription = translate(event.introductionKey, {
    name: pilot.name,
  });
  const terminalTitle = translate(event.titleKey);
  const typedTransmission = useTerminalTyping(
    terminalTitle,
    terminalDescription,
  );
  const selectedDecision = resolution
    ? event.decisions.find((decision) => decision.id === resolution.decisionId)
    : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="decision-screen screen">
      <Panel className="decision-screen__panel" labelledBy={titleId}>
        <CareerStatusBar pilot={pilot} />
        <div className="decision-screen__content">
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
                (typedTransmission.titleComplete &&
                  typedTransmission.isTyping) ||
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
            {resolution ? (
              <p
                aria-live="polite"
                className="decision-screen__status"
                role="status"
              >
                {t("decisionScreen.locked", {
                  decision: selectedDecision
                    ? translate(selectedDecision.labelKey)
                    : "",
                })}
              </p>
            ) : null}
            <div className="decision-screen__choice-grid">
              {event.decisions.map((decision) => {
                const isSelected = selectedDecision?.id === decision.id;
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
                    aria-pressed={isSelected}
                    className="decision-option"
                    data-selected={isSelected || undefined}
                    disabled={Boolean(resolution) && !isSelected}
                    key={decision.id}
                    onClick={
                      resolution ? undefined : () => onDecision(decision)
                    }
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
                        {decision.kind === "safe"
                          ? t("decisionScreen.safe")
                          : t("decisionScreen.risk")}
                      </span>
                      {success === null ? null : (
                        <DecisionProbability success={success} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </Panel>
    </main>
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
): TypedTransmission {
  const reduceMotion =
    typeof window === "undefined" ||
    !window.matchMedia ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const totalCharacters = title.length + description.length;
  const [characterCount, setCharacterCount] = useState(
    reduceMotion ? totalCharacters : 0,
  );

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

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
