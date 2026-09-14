import { useId, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { getAssetPath } from "../assets";
import {
  achievementCatalog,
  getAchievementIconPath,
} from "../domain/achievements";
import {
  factionShortNameKeys,
  militaryRankNameKeys,
  specialRankNameKeys,
} from "../domain/pilot";
import { getRankInsignia } from "../domain/ranks";
import type { CareerHistory, Pilot, StatName, ZoidId } from "../domain/types";
import { getEffectiveZoidPower, getZoid } from "../domain/zoids";
import { translate } from "../i18n";
import { RankInsignia } from "./RankInsignia";
import "../styles/tactical-career.css";

interface Props {
  history: CareerHistory;
  onSelectZoid?: (id: ZoidId) => void;
  pilot: Pilot;
}

export function TacticalCareerPanel({ history, onSelectZoid, pilot }: Props) {
  const { t } = useTranslation("interface");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const zoid = pilot.zoids ? getZoid(pilot.zoids.signatureId) : null;
  const rank = translate(
    pilot.career.specialRank
      ? specialRankNameKeys[pilot.career.specialRank]
      : militaryRankNameKeys[pilot.career.militaryRank],
  );
  const faction = translate(factionShortNameKeys[pilot.faction]);
  const injured = pilot.condition === "injured";
  const owned = pilot.zoids
    ? [pilot.zoids.signatureId, ...pilot.zoids.reserveIds]
    : [];
  const stats = Object.keys(pilot.stats) as StatName[];
  const potentialStyle = {
    "--detail-value": `${pilot.potential}%`,
    "--status-value": `${pilot.potential}%`,
  } as CSSProperties;
  const zoidName = zoid ? translate(zoid.nameKey) : t("tacticalPanel.noZoid");
  const identity = (
    <>
      <RankInsignia insignia={getRankInsignia(pilot.career.militaryRank)} />
      {rank}
    </>
  );
  const visual = (
    <span
      className="status-zoid-visual"
      role={zoid ? undefined : "img"}
      aria-label={zoid ? undefined : t("careerStatus.unassigned")}
    >
      {zoid?.imagePath ? <img alt="" src={zoid.imagePath} /> : null}
      {zoid && pilot.zoids?.damagedIds.includes(zoid.id) ? (
        <span
          className="status-damage-mark"
          role="img"
          aria-label={t("tacticalPanel.damaged")}
        />
      ) : null}
    </span>
  );

  return (
    <div className="tactical-career" data-faction={pilot.faction}>
      <aside
        aria-label={t("careerStatus.label")}
        className="core-pulse"
        data-expanded={expanded}
      >
        <div className="core-pulse__pilot">
          <img
            className="status-faction-mark"
            alt=""
            src={getAssetPath(`images/factions/${pilot.faction}.png`)}
          />
          <div className="status-identity">
            <span className="status-identity__heading">
              <span className="status-identity__rank">{identity}</span>
              {injured ? (
                <span className="status-identity__condition">
                  <i aria-hidden="true" />
                  {t("annualReport.statusInjured")}
                </span>
              ) : null}
              <span className="status-identity__mobile-age">
                {t("careerStatus.ageCompact", { age: pilot.age })}
              </span>
            </span>
            <strong>{pilot.name}</strong>
            <span className="status-identity__meta">
              {t("careerStatus.ageCompact", { age: pilot.age })} · {faction}
            </span>
          </div>
        </div>
        <div
          className="core-pulse__core"
          style={potentialStyle}
          aria-label={t("careerStatus.potentialLabel", {
            value: pilot.potential,
          })}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pilot.potential}
        >
          <span>
            <small>{t("careerStatus.potentialCompact")}</small>
            <strong>{pilot.potential}</strong>
          </span>
        </div>
        <div className="core-pulse__zoid">
          {visual}
          <span>
            <strong>{zoidName}</strong>
            <small>{zoid ? getEffectiveZoidPower(pilot, zoid.id) : "—"}</small>
          </span>
        </div>
        <WarStatus pilot={pilot} />
        <button
          type="button"
          className="core-pulse__toggle"
          aria-controls={id}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <span>
            {t(
              expanded
                ? "tacticalPanel.collapseDetails"
                : "tacticalPanel.expandDetails",
            )}
          </span>
          <i aria-hidden="true" />
        </button>
      </aside>
      <div
        className="status-detail-drawer"
        id={id}
        data-expanded={expanded}
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <div>
          {expanded ? (
            <section
              tabIndex={0}
              className="detail-panel detail-panel--tactical"
              aria-label={t("tacticalPanel.title")}
            >
              <header className="detail-panel__heading">
                <h2>{t("tacticalPanel.title")}</h2>
              </header>
              <WarStatus pilot={pilot} />
              <div
                className="detail-primary-summary"
                data-variant="tacticalProfile"
              >
                <section className="detail-pilot-primary">
                  <img
                    className="status-faction-mark"
                    alt=""
                    src={getAssetPath(`images/factions/${pilot.faction}.png`)}
                  />
                  <span>
                    <small>{faction}</small>
                    <strong>{pilot.name}</strong>
                    <span className="detail-pilot-rank">{identity}</span>
                    <span>
                      {t("careerStatus.ageCompact", { age: pilot.age })}
                    </span>
                    {injured ? (
                      <em>{t("annualReport.statusInjured")}</em>
                    ) : null}
                  </span>
                </section>
                <section className="detail-zoid-primary">
                  {visual}
                  <span>
                    <small>{t("tacticalPanel.activeZoid")}</small>
                    <strong>{zoidName}</strong>
                    {zoid ? (
                      <span className="detail-zoid-power">
                        <small>{t("tacticalPanel.zoidPower")}</small>
                        <b>{getEffectiveZoidPower(pilot, zoid.id)}</b>
                      </span>
                    ) : null}
                  </span>
                </section>
                <div className="detail-potential" style={potentialStyle}>
                  <span>
                    <small>{t("tacticalPanel.potential")}</small>
                    <strong>{pilot.potential}</strong>
                  </span>
                </div>
                <div className="detail-battle-record">
                  <small>{t("tacticalPanel.battleRecord")}</small>
                  <strong>
                    {history.battles.wins}-{history.battles.losses}
                  </strong>
                </div>
              </div>
              <section className="detail-owned-zoids">
                <h3>{t("tacticalPanel.ownedZoids")}</h3>
                {owned.length ? (
                  <div>
                    {owned.map((zoidId) => {
                      const entry = getZoid(zoidId);
                      return (
                        <article key={zoidId}>
                          <button
                            type="button"
                            disabled={!onSelectZoid}
                            aria-pressed={zoidId === zoid?.id}
                            onClick={() => onSelectZoid?.(zoidId)}
                          >
                            <span className="detail-hangar-image">
                              <img alt="" src={entry.imagePath} />
                            </span>
                            <strong>{translate(entry.nameKey)}</strong>
                          </button>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p>{t("tacticalPanel.noZoid")}</p>
                )}
              </section>
              <section className="tactical-layout">
                <svg
                  className="tactical-radar"
                  viewBox="-65 -65 130 130"
                  role="img"
                  aria-label={t("tacticalPanel.radarLabel")}
                >
                  {[20, 35, 50].map((radius) => (
                    <polygon
                      key={radius}
                      points={radarPoints(stats.map(() => radius))}
                      className="tactical-radar__grid"
                    />
                  ))}
                  <polygon
                    className="tactical-radar__value"
                    points={radarPoints(
                      stats.map((stat) => pilot.stats[stat] / 2),
                    )}
                  />
                </svg>
                <div>
                  <h3>{t("tacticalPanel.combatProfile")}</h3>
                  <div className="detail-stat-legend">
                    {stats.map((stat) => (
                      <span key={stat}>
                        <i aria-hidden="true" />
                        <small>{t(`pilotCreation.stats.${stat}`)}</small>
                        <strong>{pilot.stats[stat]}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </section>
              <div className="detail-career-indicators">
                <div className="detail-trust" data-variant="tacticalProfile">
                  <span>
                    <small>{t("tacticalPanel.factionTrust")}</small>
                    <strong>{pilot.career.factionTrust}</strong>
                  </span>
                  <div aria-hidden="true">
                    {Array.from({ length: 10 }, (_, index) => (
                      <i
                        key={index}
                        data-active={
                          index < Math.round(pilot.career.factionTrust / 10)
                        }
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="detail-fame-panel"
                  data-audience="tacticalProfile"
                >
                  <span className="detail-fame-panel__heading">
                    <small>{t("tacticalPanel.fame")}</small>
                    <strong>{pilot.career.fame}</strong>
                  </span>
                  <span className="career-status__crowd" aria-hidden="true">
                    {Array.from(
                      { length: pilot.career.fame > 0 ? 5 : 0 },
                      (_, index) => (
                        <span key={index} className="career-status__fan">
                          <span className="career-status__fan-sprite" />
                        </span>
                      ),
                    )}
                  </span>
                </div>
              </div>
              <div className="detail-rewards">
                <section>
                  <h3>{t("finalScreen.bonuses")}</h3>
                  {pilot.bonusIds?.length ? (
                    pilot.bonusIds.map((bonus) => (
                      <article key={bonus}>
                        <img
                          alt=""
                          src={getAssetPath(`images/bonuses/${bonus}.png`)}
                        />
                        <span>
                          <strong>
                            {t(`annualReport.bonuses.${bonus}.name`)}
                          </strong>
                          <small>
                            {t(`annualReport.bonuses.${bonus}.description`)}
                          </small>
                        </span>
                      </article>
                    ))
                  ) : (
                    <small>{t("tacticalPanel.none")}</small>
                  )}
                </section>
                <section>
                  <h3>{t("finalScreen.achievements")}</h3>
                  <div className="detail-achievements">
                    {history.achievementIds.map((achievement) => (
                      <article key={achievement}>
                        <img alt="" src={getAchievementIconPath(achievement)} />
                        <strong>
                          {translate(achievementCatalog[achievement].nameKey)}
                        </strong>
                      </article>
                    ))}
                  </div>
                  {!history.achievementIds.length ? (
                    <small>{t("tacticalPanel.none")}</small>
                  ) : null}
                </section>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WarStatus({ pilot }: { pilot: Pilot }) {
  const { t } = useTranslation("interface");
  const [first, second] = pilot.career.warState.sides;
  return (
    <div
      className="detail-war-status"
      role="img"
      aria-label={t("careerStatus.warLabel", {
        firstControl: first.control,
        firstFaction: translate(factionShortNameKeys[first.faction]),
        secondControl: second.control,
        secondFaction: translate(factionShortNameKeys[second.faction]),
      })}
    >
      <small>{t("careerStatus.warState")}</small>
      <span>
        {translate(factionShortNameKeys[first.faction])}{" "}
        <strong>{first.control}%</strong>
      </span>
      <i aria-hidden="true">
        <b style={{ width: `${first.control}%` }} />
      </i>
      <span>
        <strong>{second.control}%</strong>{" "}
        {translate(factionShortNameKeys[second.faction])}
      </span>
    </div>
  );
}

function radarPoints(values: readonly number[]) {
  return values
    .map((value, index) => {
      const angle = (index * Math.PI) / 3 - Math.PI / 2;
      return `${Math.cos(angle) * value},${Math.sin(angle) * value}`;
    })
    .join(" ");
}
