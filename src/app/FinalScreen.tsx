import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import {
  createFinalSummary,
  type FinalAchievementSummary,
} from "../domain/finalSummary";
import type { FinalGameState } from "../domain/types";
import { Panel } from "./UiPrimitives";
import { createFinalCardBlob } from "./finalCard";
import {
  canShareFinalCard,
  downloadBlob,
  getFinalCardFilename,
} from "./finalCardActions";
import { RankInsignia } from "./RankInsignia";

interface FinalScreenProps {
  onRestart: () => void;
  state: FinalGameState;
}

export function FinalScreen({ onRestart, state }: FinalScreenProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageBlobRef = useRef<Promise<Blob> | null>(null);
  const [busyAction, setBusyAction] = useState<"download" | "share" | null>(
    null,
  );
  const [errorKey, setErrorKey] = useState<
    "finalScreen.downloadError" | "finalScreen.shareError" | null
  >(null);
  const { t } = useTranslation("interface");
  const summary = createFinalSummary(state);
  const shareSupported = canShareFinalCard();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function downloadCard() {
    setBusyAction("download");
    setErrorKey(null);

    try {
      downloadBlob(
        await getCardBlob(),
        getFinalCardFilename(summary.pilotName),
      );
    } catch {
      setErrorKey("finalScreen.downloadError");
    } finally {
      setBusyAction(null);
    }
  }

  async function shareCard() {
    setBusyAction("share");
    setErrorKey(null);

    try {
      const file = new File(
        [await getCardBlob()],
        getFinalCardFilename(summary.pilotName),
        { type: "image/png" },
      );
      await navigator.share({ files: [file], title: summary.titleName });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setErrorKey("finalScreen.shareError");
      }
    } finally {
      setBusyAction(null);
    }
  }

  function getCardBlob(): Promise<Blob> {
    imageBlobRef.current ??= createFinalCardBlob(summary);
    return imageBlobRef.current;
  }

  return (
    <main className="final-screen screen">
      <Panel className="final-screen__panel" labelledBy={headingId}>
        <section className="final-screen__hero">
          <div className="final-screen__title">
            <span className="final-screen__title-emblem">
              <span aria-hidden="true" className="final-screen__spotlights">
                <span />
                <span />
                <span />
              </span>
              <DistinctionIcon
                className="final-screen__title-icon"
                path={summary.titleIconPath}
              />
            </span>
            <h1 id={headingId} ref={headingRef} tabIndex={-1}>
              {summary.titleName}
            </h1>
            <p>{summary.titleDescription}</p>
            <p className="final-screen__career">{summary.ageLabel}</p>
          </div>
          <div className="final-screen__visual">
            <img
              alt={summary.factionName}
              className="final-screen__faction"
              src={summary.factionImagePath}
            />
            <div className="final-screen__rank" title={summary.rank}>
              <RankInsignia insignia={summary.rankInsignia} />
              <strong>{summary.rank}</strong>
            </div>
            {summary.zoidImagePath ? (
              <img
                alt={summary.zoidName}
                className="final-screen__zoid"
                src={summary.zoidImagePath}
              />
            ) : null}
            <div className="final-screen__zoid-label">
              <small>{summary.labels.zoid}</small>
              <strong>{summary.zoidName}</strong>
            </div>
          </div>
        </section>

        <section className="final-screen__metrics">
          <FinalMetric
            label={summary.labels.potential}
            value={summary.potential}
          />
          <FinalMetric label={summary.labels.fame} value={summary.fame} />
          <FinalMetric
            label={summary.labels.factionTrust}
            value={summary.factionTrust}
          />
          <div className="final-screen__record">
            <small>{summary.labels.battleRecord}</small>
            <div>
              <FinalRecord
                label={summary.labels.wins}
                value={summary.battleWins}
              />
              <FinalRecord
                label={summary.labels.losses}
                value={summary.battleLosses}
              />
            </div>
          </div>
        </section>

        <section className="final-screen__achievements">
          <h2>{summary.labels.achievements}</h2>
          {summary.achievements.length > 0 ? (
            <ul>
              {summary.achievements.map((achievement) => (
                <AchievementTrophy
                  achievement={achievement}
                  key={achievement.name}
                />
              ))}
            </ul>
          ) : (
            <p>{t("finalScreen.noAchievements")}</p>
          )}
        </section>

        <section className="final-screen__stats">
          <h2>{summary.labels.stats}</h2>
          <div>
            {summary.stats.map((stat) => (
              <FinalStat
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </section>

        <div className="final-screen__actions">
          <button
            className="button final-screen__export"
            disabled={busyAction !== null}
            onClick={downloadCard}
            type="button"
          >
            {t("finalScreen.download")}
          </button>
          {shareSupported ? (
            <button
              className="button final-screen__export"
              disabled={busyAction !== null}
              onClick={shareCard}
              type="button"
            >
              {t("finalScreen.share")}
            </button>
          ) : null}
          <button
            className="button final-screen__restart"
            onClick={onRestart}
            type="button"
          >
            {t("finalScreen.newRun")}
          </button>
        </div>
        {errorKey ? <p role="alert">{t(errorKey)}</p> : null}
      </Panel>
    </main>
  );
}

interface AchievementTrophyProps {
  achievement: FinalAchievementSummary;
}

function AchievementTrophy({ achievement }: AchievementTrophyProps) {
  return (
    <li>
      <DistinctionIcon
        className="final-screen__achievement-icon"
        path={achievement.iconPath}
      />
      <div>
        <strong>{achievement.name}</strong>
        <p>{achievement.description}</p>
      </div>
    </li>
  );
}

interface DistinctionIconProps {
  className: string;
  path: string;
}

function DistinctionIcon({ className, path }: DistinctionIconProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`final-screen__distinction-icon ${className}`}
      data-icon-path={path}
      src={path}
    />
  );
}

interface FinalMetricProps {
  label: string;
  value: number;
}

function FinalMetric({ label, value }: FinalMetricProps) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

interface FinalRecordProps {
  label: string;
  value: number;
}

function FinalRecord({ label, value }: FinalRecordProps) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

interface FinalStatProps {
  label: string;
  value: number;
}

function FinalStat({ label, value }: FinalStatProps) {
  const style = { "--final-stat": `${value}%` } as CSSProperties;

  return (
    <div>
      <span>
        <span>{label}</span>
        <strong>{value}</strong>
      </span>
      <div
        aria-label={`${label}: ${value}`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        role="progressbar"
        style={style}
      >
        <span />
      </div>
    </div>
  );
}
