import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { achievementNameKeys } from "../domain/achievements";
import {
  battleFactionNameKeys,
  factionNameKeys,
  statNameKeys,
} from "../domain/pilot";
import type {
  AppliedChange,
  DecisionEvent,
  ResolvedYear,
  StatName,
  TranslationKey,
  ZoidId,
} from "../domain/types";
import { getWarReport } from "../domain/war";
import { getZoid } from "../domain/zoids";
import { translate } from "../i18n";
import { Badge } from "./UiPrimitives";

const statNames = [
  "charisma",
  "piloting",
  "strength",
  "synchrony",
  "tactics",
  "technique",
] as const satisfies readonly StatName[];
const zoidFallbackIcon = "◇";

interface DecisionOutcomeScreenProps {
  event: DecisionEvent;
  onCloseYear: () => void;
  result: ResolvedYear;
  titleId: string;
}

export function DecisionOutcomeScreen({
  event,
  onCloseYear,
  result,
  titleId,
}: DecisionOutcomeScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation("interface");
  const decision = event.decisions.find(
    ({ id }) => id === result.resolution.decisionId,
  );
  const battleFaction = translate(
    battleFactionNameKeys[result.pilotAfter.faction],
  );
  const growthMessageKey = getGrowthMessageKey(result.changes);
  const outcomeChanges = result.changes.filter(
    ({ target }) => target !== "war-state",
  );
  const warReport = getWarReport(
    result.pilotBefore.career.warState,
    result.pilotAfter.career.warState,
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby={titleId}
      aria-live="polite"
      className="outcome-screen"
    >
      <div className="outcome-screen__report">
        <div className="decision-screen__heading outcome-screen__terminal">
          <div className="decision-screen__terminal-bar">
            <Badge>{t("outcomeScreen.badge")}</Badge>
            <span className="decision-screen__channel">
              {t("outcomeScreen.channel")}
            </span>
          </div>

          <section className="outcome-screen__report-section">
            <TerminalLine prompt=">">
              <h1 id={titleId} ref={headingRef} tabIndex={-1}>
                {t(
                  result.resolution.kind === "safe"
                    ? "outcomeScreen.decisionSafe"
                    : result.resolution.result === "success"
                      ? "outcomeScreen.decisionRiskSuccess"
                      : "outcomeScreen.decisionRiskFailure",
                )}
              </h1>
            </TerminalLine>
            <TerminalLine>
              <strong className="outcome-screen__decision">
                {decision ? translate(decision.labelKey) : ""}
              </strong>
            </TerminalLine>
            <TerminalLine>
              <p>{translate(result.outcome.narrativeKey)}</p>
            </TerminalLine>

            {result.zoidIds.length > 0 ? (
              <ul className="outcome-screen__rewards">
                {result.zoidIds.map((id) => (
                  <OutcomeZoid key={id} zoidId={id} />
                ))}
              </ul>
            ) : null}

            {outcomeChanges.length > 0 ? (
              <ul className="outcome-screen__terminal-changes">
                {outcomeChanges.map((change) => (
                  <OutcomeChange change={change} key={getChangeKey(change)} />
                ))}
              </ul>
            ) : null}
          </section>

          <section className="outcome-screen__report-section">
            <TerminalLine prompt=">">
              <h2>{t("outcomeScreen.battles")}</h2>
            </TerminalLine>
            <TerminalLine>
              <p className="outcome-screen__record">
                {result.battleRecord.participated === 0
                  ? t("outcomeScreen.noBattles")
                  : t("outcomeScreen.battleReport", {
                      ...result.battleRecord,
                      faction: battleFaction,
                    })}
              </p>
            </TerminalLine>
            {getBattleStatusKeys(result).map((key) => (
              <TerminalLine key={key}>
                <p className="outcome-screen__record">{translate(key)}</p>
              </TerminalLine>
            ))}
            <TerminalLine>
              <p
                className="outcome-screen__war-report"
                data-urgency={warReport.urgency}
              >
                {t(`outcomeScreen.warTerritory.${warReport.urgency}`, {
                  loser: translate(factionNameKeys[warReport.loser]),
                  winner: translate(factionNameKeys[warReport.winner]),
                })}
              </p>
            </TerminalLine>
          </section>

          {result.achievementIds.length > 0 ? (
            <ul className="outcome-screen__achievements">
              {result.achievementIds.map((id) => (
                <li key={id}>
                  <small>{t("outcomeScreen.achievementEarned")}</small>
                  <strong>{translate(achievementNameKeys[id])}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <section className="outcome-screen__stats">
          <TerminalLine prompt=">">
            <h2>{t("outcomeScreen.stats")}</h2>
          </TerminalLine>
          <TerminalLine>
            <p>{t(growthMessageKey)}</p>
          </TerminalLine>
          <div className="outcome-screen__stat-grid">
            {statNames.map((stat) => (
              <OutcomeStat
                current={result.pilotAfter.stats[stat]}
                key={stat}
                previous={result.pilotBefore.stats[stat]}
                stat={stat}
              />
            ))}
          </div>
        </section>
      </div>

      <button
        className="button button--primary"
        onClick={onCloseYear}
        type="button"
      >
        {t("outcomeScreen.close")}
      </button>
    </section>
  );
}

interface TerminalLineProps {
  children: React.ReactNode;
  prompt?: ">" | "$";
}

function TerminalLine({ children, prompt = "$" }: TerminalLineProps) {
  return (
    <div className="decision-screen__terminal-line outcome-screen__line">
      <span aria-hidden="true" className="decision-screen__prompt">
        {prompt}
      </span>
      {children}
    </div>
  );
}

function getBattleStatusKeys(result: ResolvedYear) {
  const keys: TranslationKey<"interface">[] = [];

  if (result.battleRecord.killed) {
    keys.push("interface:outcomeScreen.battleKilled");
  } else if (result.battleRecord.injured) {
    keys.push("interface:outcomeScreen.battleInjured");
  }

  if (result.battleRecord.zoidDestroyed) {
    keys.push("interface:outcomeScreen.zoidDestroyed");
  } else if (result.battleRecord.zoidDamaged) {
    keys.push("interface:outcomeScreen.zoidDamaged");
  }

  return keys;
}

interface OutcomeZoidProps {
  zoidId: ZoidId;
}

function OutcomeZoid({ zoidId }: OutcomeZoidProps) {
  const { t } = useTranslation("interface");
  const zoid = getZoid(zoidId);

  return (
    <li>
      <span className="outcome-screen__reward-visual">
        {zoid.imagePath ? (
          <img alt="" src={zoid.imagePath} />
        ) : (
          <span>{zoidFallbackIcon}</span>
        )}
      </span>
      <span>
        <small>{t("outcomeScreen.zoidObtained")}</small>
        <strong>{translate(zoid.nameKey)}</strong>
      </span>
    </li>
  );
}

interface OutcomeStatProps {
  current: number;
  previous: number;
  stat: StatName;
}

function OutcomeStat({ current, previous, stat }: OutcomeStatProps) {
  const { t } = useTranslation("interface");
  const label = translate(statNameKeys[stat]);
  const style = {
    "--stat-current": `${current}%`,
    "--stat-previous": `${previous}%`,
  } as CSSProperties;

  return (
    <div className="outcome-screen__stat">
      <span>
        <strong>{label}</strong>
        <strong className="outcome-screen__stat-total">{current}</strong>
      </span>
      <div
        aria-label={t("outcomeScreen.statValueLabel", { current, stat: label })}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={current}
        className="outcome-screen__stat-track"
        role="progressbar"
        style={style}
      >
        <span />
      </div>
    </div>
  );
}

interface OutcomeChangeProps {
  change: AppliedChange;
}

function OutcomeChange({ change }: OutcomeChangeProps) {
  const { t } = useTranslation("interface");
  const label =
    change.target === "stat"
      ? translate(statNameKeys[change.stat])
      : change.target === "career-indicator"
        ? t(
            change.indicator === "faction-trust"
              ? "outcomeScreen.factionTrust"
              : "outcomeScreen.fame",
          )
        : change.target === "war-state"
          ? t("outcomeScreen.warState", {
              faction: translate(factionNameKeys[change.faction]),
            })
          : t("outcomeScreen.potential");

  return (
    <li data-negative={change.current < change.previous || undefined}>
      <strong>{getSignedDelta(change.current - change.previous)}</strong>
      <span>{label}</span>
    </li>
  );
}

function getSignedDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : String(delta);
}

function getGrowthMessageKey(changes: readonly AppliedChange[]) {
  const growth = changes.reduce(
    (total, change) =>
      change.target === "stat"
        ? total + change.current - change.previous
        : total,
    0,
  );

  if (growth >= 7) return "outcomeScreen.growthExceptional" as const;
  if (growth >= 4) return "outcomeScreen.growthStrong" as const;
  if (growth > 0) return "outcomeScreen.growthSteady" as const;
  return "outcomeScreen.growthLimited" as const;
}

function getChangeKey(change: AppliedChange): string {
  if (change.target === "stat") return `stat:${change.stat}`;
  if (change.target === "career-indicator") {
    return `indicator:${change.indicator}`;
  }

  return change.target === "war-state" ? `war:${change.faction}` : "potential";
}
