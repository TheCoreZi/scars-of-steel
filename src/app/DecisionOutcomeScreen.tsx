import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import {
  achievementCatalog,
  getAchievementIconPath,
} from "../domain/achievements";
import { getRankInsignia } from "../domain/ranks";
import {
  battleFactionNameKeys,
  factionNameKeys,
  militaryRankNameKeys,
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
import { RankInsignia } from "./RankInsignia";

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
  onAbandon: () => void;
  onCloseYear: () => void;
  result: ResolvedYear;
  titleId: string;
}

export function DecisionOutcomeScreen({
  event,
  onAbandon,
  onCloseYear,
  result,
  titleId,
}: DecisionOutcomeScreenProps) {
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const abandonButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t } = useTranslation("interface");
  const decision = event.decisions.find(
    ({ id }) => id === result.resolution.decisionId,
  );
  const battleFaction = translate(
    battleFactionNameKeys[result.pilotAfter.faction],
  );
  const growthMessageKey = getGrowthMessageKey(result.changes);
  const promotedRank = result.pilotAfter.career.militaryRank;
  const outcomeChanges = consolidateChanges(
    result.changes.filter(({ target }) => target !== "war-state"),
  );
  const warReport = getWarReport(
    result.pilotBefore.career.warState,
    result.pilotAfter.career.warState,
  );

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  function cancelAbandon() {
    setShowAbandonDialog(false);
    abandonButtonRef.current?.focus();
  }

  return (
    <div
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
                {outcomeChanges.map(({ amount, change }) => (
                  <OutcomeChange
                    amount={amount}
                    change={change}
                    key={getChangeKey(change)}
                  />
                ))}
              </ul>
            ) : null}
          </section>

          <section className="outcome-screen__report-section">
            <TerminalLine prompt=">">
              <h2>{t("annualReport.title")}</h2>
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
            {getRecoveryMessages(result)
              .filter((roll) => roll.kind !== "death" || roll.success)
              .map((roll, index) => (
                <TerminalLine key={index}>
                  <p className="outcome-screen__record">
                    {roll.kind === "repair"
                      ? t(
                          `annualReport.repair${roll.partial ? "Partial" : roll.success ? "Yes" : "No"}`,
                          {
                            zoid: roll.zoidId
                              ? translate(getZoid(roll.zoidId).nameKey)
                              : "",
                          },
                        )
                      : roll.kind === "death"
                        ? t("annualReport.deathYes")
                        : t(
                            `annualReport.recovery${roll.partial ? "Partial" : roll.success ? "Yes" : "No"}`,
                          )}
                  </p>
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
            {result.annualReport?.promoted ? (
              <div
                className="promotion-panel"
                role="group"
                aria-label={t("annualReport.promoted")}
              >
                <span className="promotion-panel__insignia">
                  <RankInsignia insignia={getRankInsignia(promotedRank)} />
                </span>
                <span className="promotion-panel__text">
                  <small>{t("annualReport.promoted")}</small>
                  <strong>
                    {translate(militaryRankNameKeys[promotedRank])}
                  </strong>
                </span>
              </div>
            ) : null}
          </section>

          {result.achievementIds.length > 0 ||
          result.annualReport?.bonusIds.length ? (
            <ul className="outcome-screen__achievements">
              {result.achievementIds.map((id) => (
                <li className="outcome-screen__achievement" key={id}>
                  <img src={getAchievementIconPath(id)} alt="" />
                  <div>
                    <small>{t("outcomeScreen.achievementEarned")}</small>
                    <strong>{translate(achievementCatalog[id].nameKey)}</strong>
                  </div>
                </li>
              ))}
              {result.annualReport?.bonusIds.map((id) => (
                <li className="outcome-screen__bonus" key={id}>
                  <img src={`/images/bonuses/${id}.png`} alt="" />
                  <div>
                    <strong>{t(`annualReport.bonuses.${id}.earned`)}</strong>
                    <p>{t(`annualReport.bonuses.${id}.description`)}</p>
                  </div>
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

      <div className="outcome-screen__actions">
        <button
          className="button button--secondary"
          onClick={() => setShowAbandonDialog(true)}
          ref={abandonButtonRef}
          type="button"
        >
          {t("outcomeScreen.abandon")}
        </button>
        <button
          className="button button--primary"
          onClick={onCloseYear}
          type="button"
        >
          {t("outcomeScreen.close")}
        </button>
      </div>
      {showAbandonDialog ? (
        <AbandonDialog onCancel={cancelAbandon} onConfirm={onAbandon} />
      ) : null}
    </div>
  );
}

interface AbandonDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function getRecoveryMessages(result: ResolvedYear) {
  const groups = new Map<
    string,
    {
      kind: "death" | "recovery" | "repair";
      partial: boolean;
      success: boolean;
      zoidId?: ZoidId;
    }
  >();
  for (const roll of result.annualReport?.rolls ?? []) {
    const key = `${roll.kind}:${roll.zoidId ?? ""}`;
    const success = roll.success || (groups.get(key)?.success ?? false);
    const remains =
      roll.kind === "recovery"
        ? result.pilotAfter.condition === "injured"
        : roll.kind === "repair" && roll.zoidId
          ? result.pilotAfter.zoids?.damagedIds.includes(roll.zoidId)
          : false;
    groups.set(key, { ...roll, partial: success && Boolean(remains), success });
  }
  return [...groups.values()];
}

function AbandonDialog({ onCancel, onConfirm }: AbandonDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { t } = useTranslation("interface");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    cancelButtonRef.current?.focus();

    return () => {
      if (dialog.open && typeof dialog.close === "function") {
        dialog.close();
      }
    };
  }, []);

  function cancelDialog() {
    const dialog = dialogRef.current;

    if (dialog?.open && typeof dialog.close === "function") {
      dialog.close();
    }

    onCancel();
  }

  function keepFocusInside(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;
    const controls = dialog?.querySelectorAll<HTMLElement>(
      "button:not(:disabled)",
    );
    const firstControl = controls?.[0];
    const lastControl = controls?.[controls.length - 1];

    if (
      !firstControl ||
      !lastControl ||
      (!event.shiftKey && document.activeElement !== lastControl) ||
      (event.shiftKey && document.activeElement !== firstControl)
    ) {
      return;
    }

    event.preventDefault();
    (event.shiftKey ? lastControl : firstControl).focus();
  }

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="abandon-dialog"
      onCancel={(event) => {
        event.preventDefault();
        cancelDialog();
      }}
      onKeyDown={keepFocusInside}
      ref={dialogRef}
      role="alertdialog"
    >
      <h2 id={titleId}>{t("outcomeScreen.abandonDialog.title")}</h2>
      <p id={descriptionId}>{t("outcomeScreen.abandonDialog.description")}</p>
      <div>
        <button
          className="button"
          onClick={cancelDialog}
          ref={cancelButtonRef}
          type="button"
        >
          {t("outcomeScreen.abandonDialog.cancel")}
        </button>
        <button
          className="button button--primary"
          onClick={onConfirm}
          type="button"
        >
          {t("outcomeScreen.abandonDialog.confirm")}
        </button>
      </div>
    </dialog>
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
  } else if (result.annualReport?.injured) {
    keys.push("interface:annualReport.injured");
  } else if (result.battleRecord.injured) {
    keys.push("interface:outcomeScreen.battleInjured");
  }

  if (result.battleRecord.zoidDestroyed) {
    keys.push("interface:outcomeScreen.zoidDestroyed");
  } else if (result.annualReport?.zoidDamaged) {
    keys.push("interface:annualReport.damaged");
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
  amount: number;
  change: AppliedChange;
}

function OutcomeChange({ amount, change }: OutcomeChangeProps) {
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
          : change.target === "zoid-power"
            ? t("annualReport.power")
            : change.target === "zoid-upgrades"
              ? t("annualReport.upgrades")
              : t("outcomeScreen.potential");

  return (
    <li data-negative={amount < 0 || undefined}>
      <strong>{getSignedDelta(amount)}</strong>
      <span>{label}</span>
    </li>
  );
}

interface ConsolidatedChange {
  amount: number;
  change: AppliedChange;
}

function consolidateChanges(
  changes: readonly AppliedChange[],
): ConsolidatedChange[] {
  const consolidated = new Map<string, ConsolidatedChange>();

  for (const change of changes) {
    const key = getChangeKey(change);
    const previous = consolidated.get(key);
    consolidated.set(key, {
      amount: (previous?.amount ?? 0) + change.current - change.previous,
      change: previous?.change ?? change,
    });
  }

  return [...consolidated.values()].filter(({ amount }) => amount !== 0);
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
  if (change.target === "zoid-power" || change.target === "zoid-upgrades") {
    return `${change.target}:${change.zoidId}`;
  }

  return change.target === "war-state"
    ? `war:${change.faction}`
    : change.target;
}
