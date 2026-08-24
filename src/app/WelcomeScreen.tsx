import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAssetPath } from "../assets";
import { militaryRankNameKeys, specialRankNameKeys } from "../domain/pilot";
import { getRankInsignia } from "../domain/ranks";
import { getTitleDefinition } from "../domain/titles";
import { getZoid } from "../domain/zoids";
import { translate } from "../i18n";
import { AnimationToggle } from "./AppControls";
import type { CompletedGame } from "./gameStorage";
import { RankInsignia } from "./RankInsignia";
import { Badge, Button, Panel } from "./UiPrimitives";

const welcomeFacts = {
  decisions: 5,
  factions: 2,
  paths: 21,
  wars: 1,
} as const;
const serviceRecordIcons = { fame: "★", potential: "⚡" } as const;
const zoidFallbackIcon = "◇";

interface WelcomeScreenProps {
  completedGames: readonly CompletedGame[];
  onReducedMotionChange: (reducedMotion: boolean) => void;
  onSelectGame: (game: CompletedGame) => void;
  onStart: () => void;
  reducedMotion: boolean;
}

export function WelcomeScreen({
  completedGames,
  onReducedMotionChange,
  onSelectGame,
  onStart,
  reducedMotion,
}: WelcomeScreenProps) {
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const titleId = useId();
  const { t } = useTranslation("interface");

  function handleStart() {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    setStarted(true);
    onStart();
  }

  return (
    <main className="screen welcome">
      <Panel
        className={`welcome__panel${completedGames.length > 0 ? " welcome__panel--records" : ""}`}
        labelledBy={titleId}
      >
        <AnimationToggle
          onReducedMotionChange={onReducedMotionChange}
          reducedMotion={reducedMotion}
        />
        <div className="welcome__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Badge>{t("welcome.badge")}</Badge>
        <div className="welcome__heading">
          <div className="welcome__brand">
            <img
              alt=""
              className="welcome__logo"
              src={getAssetPath("images/brand/scars-of-steel-mark.png")}
            />
            <h1 id={titleId}>{t("welcome.title")}</h1>
          </div>
          <p className="welcome__description">{t("welcome.description")}</p>
          <p className="welcome__journey">{t("welcome.journey")}</p>
          <p className="welcome__call-to-action">{t("welcome.callToAction")}</p>
        </div>
        <dl aria-label={t("welcome.facts.label")} className="welcome__facts">
          <div>
            <dd>{welcomeFacts.factions}</dd>
            <dt>{t("welcome.facts.factions")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.decisions}</dd>
            <dt>{t("welcome.facts.decisions")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.paths}</dd>
            <dt>{t("welcome.facts.paths")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.wars}</dd>
            <dt>{t("welcome.facts.wars")}</dt>
          </div>
        </dl>
        <Button disabled={started} onClick={handleStart}>
          {t("welcome.start")}
        </Button>
        <ServiceRecords
          completedGames={completedGames}
          onSelectGame={onSelectGame}
        />
      </Panel>
    </main>
  );
}

interface ServiceRecordsProps {
  completedGames: readonly CompletedGame[];
  onSelectGame: (game: CompletedGame) => void;
}

function ServiceRecords({ completedGames, onSelectGame }: ServiceRecordsProps) {
  const { t } = useTranslation("interface");

  if (completedGames.length === 0) {
    return null;
  }

  return (
    <section className="service-records">
      <h2>{t("welcome.serviceRecords.title")}</h2>
      <ul>
        {completedGames.map((game) => (
          <ServiceRecord
            game={game}
            key={game.state.pilot.id}
            onSelect={onSelectGame}
          />
        ))}
      </ul>
    </section>
  );
}

interface ServiceRecordProps {
  game: CompletedGame;
  onSelect: (game: CompletedGame) => void;
}

function ServiceRecord({ game, onSelect }: ServiceRecordProps) {
  const { t } = useTranslation("interface");
  const { pilot } = game.state;
  const rank = translate(
    pilot.career.specialRank
      ? specialRankNameKeys[pilot.career.specialRank]
      : militaryRankNameKeys[pilot.career.militaryRank],
  );
  const title = getTitleDefinition(game.state.titleId);
  const titleName = translate(title.nameKey);
  const zoid = pilot.zoids ? getZoid(pilot.zoids.signatureId) : null;
  const zoidName = zoid
    ? translate(zoid.nameKey)
    : t("careerStatus.unassigned");

  return (
    <li>
      <button
        aria-label={t("welcome.serviceRecords.open", { name: pilot.name })}
        className="service-records__row"
        data-faction={pilot.faction}
        onClick={() => onSelect(game)}
        type="button"
      >
        <span
          aria-label={titleName}
          className="service-records__title"
          title={titleName}
        >
          <img alt="" src={title.iconPath} />
        </span>
        <strong className="service-records__name" title={pilot.name}>
          {pilot.name}
        </strong>
        <span aria-label={rank} className="service-records__rank" title={rank}>
          <RankInsignia insignia={getRankInsignia(pilot.career.militaryRank)} />
          <small>{rank}</small>
        </span>
        <span
          aria-label={t("careerStatus.zoidLabel", { name: zoidName })}
          className="service-records__zoid"
        >
          {zoid?.imagePath ? (
            <img alt="" src={zoid.imagePath} />
          ) : (
            <span aria-hidden="true">{zoidFallbackIcon}</span>
          )}
          <small>{zoidName}</small>
        </span>
        <ServiceRecordMetric
          icon={serviceRecordIcons.potential}
          label={t("careerStatus.potentialLabel", { value: pilot.potential })}
          value={pilot.potential}
        />
        <ServiceRecordMetric
          icon={serviceRecordIcons.fame}
          label={t("careerStatus.fameLabel", {
            value: pilot.career.fame,
          })}
          value={pilot.career.fame}
        />
      </button>
    </li>
  );
}

interface ServiceRecordMetricProps {
  icon: string;
  label: string;
  value: number;
}

function ServiceRecordMetric({ icon, label, value }: ServiceRecordMetricProps) {
  return (
    <span aria-label={label} className="service-records__metric">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
    </span>
  );
}
