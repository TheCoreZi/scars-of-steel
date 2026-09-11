import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { getAssetPath } from "../assets";
import {
  getLifeStage,
  factionShortNameKeys,
  lifeStageNameKeys,
  militaryRankNameKeys,
  specialRankNameKeys,
} from "../domain/pilot";
import { getRankInsignia } from "../domain/ranks";
import type { Pilot, Zoid } from "../domain/types";
import { getZoid, getEffectiveZoidPower } from "../domain/zoids";
import { translate } from "../i18n";
import { RankInsignia } from "./RankInsignia";

const factionLogoPaths = {
  guylos: getAssetPath("images/factions/guylos.png"),
  helic: getAssetPath("images/factions/helic.png"),
} as const;
const zoidFallbackIcon = "◇";

interface CareerStatusBarProps {
  pilot: Pilot;
}

export function CareerStatusBar({ pilot }: CareerStatusBarProps) {
  const { t } = useTranslation("interface");
  const zoid = pilot.zoids ? getZoid(pilot.zoids.signatureId) : null;
  const rankName = translate(
    pilot.career.specialRank
      ? specialRankNameKeys[pilot.career.specialRank]
      : militaryRankNameKeys[pilot.career.militaryRank],
  );
  const zoidName = zoid ? translate(zoid.nameKey) : null;

  return (
    <aside aria-label={t("careerStatus.label")} className="career-status">
      <div className="career-status__desktop">
        <StatusDetails
          factionName={translate(factionShortNameKeys[pilot.faction])}
          pilot={pilot}
          rankName={rankName}
          zoid={zoid}
          zoidName={zoidName}
        />
        <FameCrowd fame={pilot.career.fame} pilotName={pilot.name} />
      </div>
    </aside>
  );
}

interface StatusDetailsProps {
  factionName: string;
  pilot: Pilot;
  rankName: string;
  zoid: Zoid | null;
  zoidName: string | null;
}

function StatusDetails({
  factionName,
  pilot,
  rankName,
  zoid,
  zoidName,
}: StatusDetailsProps) {
  const { t } = useTranslation("interface");
  const potential = pilot.potential;
  const [firstSide, secondSide] = pilot.career.warState.sides;
  const firstFactionName = translate(factionShortNameKeys[firstSide.faction]);
  const secondFactionName = translate(factionShortNameKeys[secondSide.faction]);
  const potentialStyle = {
    "--potential-percent": `${potential}%`,
  } as CSSProperties;

  return (
    <div className="career-status__details">
      <ZoidPanel pilot={pilot} zoid={zoid} zoidName={zoidName} />
      <div className="career-status__pilot">
        <span className="career-status__pilot-heading">
          <small className="career-status__rank" title={rankName}>
            <RankInsignia
              insignia={getRankInsignia(pilot.career.militaryRank)}
            />
            <span>{rankName}</span>
          </small>
          <small className="career-status__pilot-faction">{factionName}</small>
        </span>
        <span className="career-status__pilot-name">
          <strong>{pilot.name}</strong>
          {pilot.condition === "injured" ? (
            <span
              aria-label={t("annualReport.statusInjured")}
              className="career-status__conditions career-status__condition--pilot"
              role="img"
              title={t("annualReport.statusInjured")}
            >
              {Array.from({ length: pilot.injuryCount ?? 1 }, (_, index) => (
                <span
                  aria-hidden="true"
                  className="career-status__condition"
                  key={index}
                />
              ))}
            </span>
          ) : null}
        </span>
        <span className="career-status__metadata">
          {pilot.bonusIds?.includes("organoid") ? (
            <span>{t("annualReport.statusOrganoid")}</span>
          ) : null}
        </span>
        <span className="career-status__metadata">
          <span>{translate(lifeStageNameKeys[getLifeStage(pilot.age)])}</span>
          <span>{t("careerStatus.ageCompact", { age: pilot.age })}</span>
          <span>{t("careerStatus.yearCompact", { year: pilot.age - 11 })}</span>
        </span>
      </div>
      <div className="career-status__war">
        <span className="career-status__war-heading">
          <span className="career-status__full-label">
            {t("careerStatus.warState")}
          </span>
          <span className="career-status__compact-label">
            {t("careerStatus.warStateCompact")}
          </span>
        </span>
        <div className="career-status__war-scale">
          <img alt="" src={factionLogoPaths[firstSide.faction]} />
          <div
            aria-label={t("careerStatus.warLabel", {
              firstControl: firstSide.control,
              firstFaction: firstFactionName,
              secondControl: secondSide.control,
              secondFaction: secondFactionName,
            })}
            className="career-status__war-track"
            data-faction={secondSide.faction}
            role="img"
          >
            <span
              aria-hidden="true"
              className="career-status__war-fill"
              data-faction={firstSide.faction}
              style={{ width: `${firstSide.control}%` }}
            />
          </div>
          <img alt="" src={factionLogoPaths[secondSide.faction]} />
        </div>
        <span className="career-status__war-values">
          <span>
            <strong>{firstFactionName}</strong>
            <span>
              {t("careerStatus.percentage", { value: firstSide.control })}
            </span>
          </span>
          <span>
            <strong>{secondFactionName}</strong>
            <span>
              {t("careerStatus.percentage", { value: secondSide.control })}
            </span>
          </span>
        </span>
      </div>
      <div
        aria-label={t("careerStatus.potentialLabel", { value: potential })}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={potential}
        className="career-status__potential"
        role="progressbar"
        style={potentialStyle}
      >
        <small>
          <span className="career-status__full-label">
            {t("careerStatus.potential")}
          </span>
          <span className="career-status__compact-label">
            {t("careerStatus.potentialCompact")}
          </span>
        </small>
        <strong>{potential}</strong>
      </div>
    </div>
  );
}

interface ZoidPanelProps {
  pilot: Pilot;
  zoid: Zoid | null;
  zoidName: string | null;
}

function ZoidPanel({ pilot, zoid, zoidName }: ZoidPanelProps) {
  const { t } = useTranslation("interface");
  const upgrades = zoid ? (pilot.zoidProgress?.[zoid.id]?.upgrades ?? 0) : 0;
  const visibleUpgrades = Math.min(6, upgrades);

  return (
    <section
      aria-label={
        zoidName
          ? t("careerStatus.zoidLabel", { name: zoidName })
          : t("careerStatus.unassigned")
      }
      className="career-status__zoid-panel"
    >
      <span className="career-status__zoid-content">
        <span className="career-status__zoid-visual">
          {zoid?.imagePath ? (
            <img alt="" className="career-status__zoid" src={zoid.imagePath} />
          ) : (
            <span aria-hidden="true" className="career-status__zoid-fallback">
              {zoidFallbackIcon}
            </span>
          )}
          {zoid && pilot.zoids?.damagedIds.includes(zoid.id) ? (
            <span
              aria-label={t("annualReport.statusDamaged")}
              className="career-status__conditions career-status__condition--zoid"
              role="img"
              title={t("annualReport.statusDamaged")}
            >
              {pilot.zoids.damagedIds
                .filter((id) => id === zoid.id)
                .map((_, index) => (
                  <span
                    aria-hidden="true"
                    className="career-status__condition"
                    key={index}
                  />
                ))}
            </span>
          ) : null}
          {upgrades > 0 ? (
            <span
              className="career-status__zoid-upgrades"
              role="img"
              aria-label={t("annualReport.upgradeCount", { count: upgrades })}
              title={t("annualReport.upgradeCount", { count: upgrades })}
            >
              <svg
                aria-hidden="true"
                viewBox={`0 0 14 ${visibleUpgrades * 6 + 2}`}
                width="14"
                height={visibleUpgrades * 6 + 2}
              >
                {Array.from({ length: visibleUpgrades }, (_, index) => (
                  <polyline
                    key={index}
                    points={`2,${index * 6 + 6} 7,${index * 6 + 2} 12,${index * 6 + 6}`}
                  />
                ))}
              </svg>
              {upgrades > visibleUpgrades ? (
                <span aria-hidden="true">+{upgrades - visibleUpgrades}</span>
              ) : null}
            </span>
          ) : null}
        </span>
        {zoidName ? (
          <strong className="career-status__zoid-name" title={zoidName}>
            {zoidName}
          </strong>
        ) : null}
        {zoid ? (
          <small className="career-status__zoid-power">
            {t("annualReport.statusPower", {
              power: getEffectiveZoidPower(pilot, zoid.id),
            })}
          </small>
        ) : null}
      </span>
    </section>
  );
}

interface FameCrowdProps {
  fame: number;
  pilotName: string;
}

function FameCrowd({ fame, pilotName }: FameCrowdProps) {
  const { t } = useTranslation("interface");
  const fanCount = Math.ceil(fame / 2);
  const speakingCount =
    fame === 100 ? fanCount : Math.floor((fanCount * fame) / 100);

  return (
    <div
      aria-label={t("careerStatus.fameLabel", { value: fame })}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={fame}
      className="career-status__fans"
      data-mood={fame < 25 ? "indifferent" : fame < 75 ? "engaged" : "cheering"}
      role="progressbar"
    >
      <span className="career-status__fans-label">
        <small>{t("careerStatus.fame")}</small>
      </span>
      <span aria-hidden="true" className="career-status__crowd">
        {Array.from({ length: fanCount }, (_, index) => {
          const style = {
            "--fan-delay": `${index * 35}ms`,
            "--fan-message-delay": `${index * -180}ms`,
          } as CSSProperties;

          return (
            <span
              className="career-status__fan"
              data-entering="true"
              data-side={index % 2 === 0 ? "left" : "right"}
              data-speaking={index < speakingCount || undefined}
              key={index}
              style={style}
            >
              <span className="career-status__fan-message">
                {index < speakingCount ? pilotName : "?"}
              </span>
              <span className="career-status__fan-sprite" />
            </span>
          );
        })}
      </span>
    </div>
  );
}
