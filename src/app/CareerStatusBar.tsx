import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import {
  factionNameKeys,
  getLifeStage,
  lifeStageNameKeys,
} from "../domain/pilot";
import type { Pilot, Zoid } from "../domain/types";
import { getZoid } from "../domain/zoids";
import { translate } from "../i18n";

const factionLogoPaths = {
  guylos: "/images/factions/guylos.png",
  helic: "/images/factions/helic.png",
} as const;
const zoidFallbackIcon = "◇";

interface CareerStatusBarProps {
  pilot: Pilot;
}

export function CareerStatusBar({ pilot }: CareerStatusBarProps) {
  const { i18n, t } = useTranslation("interface");
  const zoid = pilot.zoids ? getZoid(pilot.zoids.signatureId) : null;
  const factionName = i18n.t(factionNameKeys[pilot.faction]);
  const zoidName = zoid ? translate(zoid.nameKey) : null;

  return (
    <aside aria-label={t("careerStatus.label")} className="career-status">
      <div className="career-status__desktop">
        <StatusDetails
          factionName={factionName}
          pilot={pilot}
          zoid={zoid}
          zoidName={zoidName}
        />
      </div>
      <details className="career-status__mobile">
        <summary>
          <img alt="" src={factionLogoPaths[pilot.faction]} />
          <span>{pilot.name}</span>
          <strong>{t("careerStatus.ageCompact", { age: pilot.age })}</strong>
        </summary>
        <StatusDetails
          factionName={factionName}
          pilot={pilot}
          zoid={zoid}
          zoidName={zoidName}
        />
      </details>
    </aside>
  );
}

interface StatusDetailsProps {
  factionName: string;
  pilot: Pilot;
  zoid: Zoid | null;
  zoidName: string | null;
}

function StatusDetails({
  factionName,
  pilot,
  zoid,
  zoidName,
}: StatusDetailsProps) {
  const { t } = useTranslation("interface");
  const combatPower = Math.min(
    100,
    pilot.baseCombatPower + (zoid?.basePower ?? 0),
  );
  const guylosControl = pilot.career.warState.guylos;
  const helicControl = pilot.career.warState.helic;
  const powerStyle = {
    "--power-percent": `${combatPower}%`,
  } as CSSProperties;

  return (
    <div className="career-status__details">
      <ZoidPanel zoid={zoid} zoidName={zoidName} />
      <div className="career-status__pilot">
        <strong>{pilot.name}</strong>
        <span className="career-status__metadata">
          <span>{factionName}</span>
          <span>{translate(lifeStageNameKeys[getLifeStage(pilot.age)])}</span>
          <span>{t("careerStatus.ageCompact", { age: pilot.age })}</span>
          <span>{t("careerStatus.yearCompact", { year: pilot.age - 11 })}</span>
        </span>
      </div>
      <div
        aria-label={t("careerStatus.powerLabel", { value: combatPower })}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={combatPower}
        className="career-status__power"
        role="progressbar"
        style={powerStyle}
      >
        <small>{t("careerStatus.combatPower")}</small>
        <strong>{combatPower}</strong>
      </div>
      <div className="career-status__war">
        <span className="career-status__war-heading">
          {t("careerStatus.warState")}
        </span>
        <div className="career-status__war-scale">
          <img alt="" src={factionLogoPaths.helic} />
          <div
            aria-label={t("careerStatus.warLabel", {
              guylos: guylosControl,
              helic: helicControl,
            })}
            className="career-status__war-track"
            role="img"
          >
            <span
              aria-hidden="true"
              className="career-status__war-fill"
              style={{ width: `${helicControl}%` }}
            />
          </div>
          <img alt="" src={factionLogoPaths.guylos} />
        </div>
        <span className="career-status__war-values">
          <span>
            <strong>{t("careerStatus.helic")}</strong>
            <span>{t("careerStatus.percentage", { value: helicControl })}</span>
          </span>
          <span>
            <strong>{t("careerStatus.guylos")}</strong>
            <span>
              {t("careerStatus.percentage", { value: guylosControl })}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

interface ZoidPanelProps {
  zoid: Zoid | null;
  zoidName: string | null;
}

function ZoidPanel({ zoid, zoidName }: ZoidPanelProps) {
  const { t } = useTranslation("interface");

  return (
    <section
      aria-label={
        zoidName
          ? t("careerStatus.zoidLabel", { name: zoidName })
          : t("careerStatus.unassigned")
      }
      className="career-status__zoid-panel"
    >
      <small>{t("careerStatus.zoid")}</small>
      <span className="career-status__zoid-content">
        <span className="career-status__zoid-visual">
          {zoid?.imagePath ? (
            <img alt="" className="career-status__zoid" src={zoid.imagePath} />
          ) : (
            <span aria-hidden="true" className="career-status__zoid-fallback">
              {zoidFallbackIcon}
            </span>
          )}
        </span>
        {zoidName ? (
          <strong className="career-status__zoid-name">{zoidName}</strong>
        ) : null}
      </span>
    </section>
  );
}
