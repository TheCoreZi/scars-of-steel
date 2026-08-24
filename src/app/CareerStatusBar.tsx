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
import { getZoid } from "../domain/zoids";
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
      <ZoidPanel zoid={zoid} zoidName={zoidName} />
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
        <strong>{pilot.name}</strong>
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
            role="img"
          >
            <span
              aria-hidden="true"
              className="career-status__war-fill"
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
        aria-orientation="vertical"
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
