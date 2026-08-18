import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  aspirationNameKeys,
  factionNameKeys,
  getInitialStats,
} from "../domain/pilot";
import type { Aspiration, Faction, StatName } from "../domain/types";
import { Badge, Button, Meter, Panel } from "./UiPrimitives";

const aspirations = Object.keys(aspirationNameKeys) as Aspiration[];
const aspirationIconPaths = {
  commander:
    "m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 21l1.1-6.2L3 10.4l6.2-.9L12 2.8Z",
  shadow: "M6 20V10a6 6 0 0 1 12 0v10l-3-2-3 2-3-2-3 2Zm3-9h.01M15 11h.01",
  "war-hero":
    "M9 3h6l1 4c2 4 3 9 4 14l-8-3-8 3c1-5 2-10 4-14l1-4Zm-1 4h8m-4 0v11",
  "zoid-ace": "m13 2-8 12h6l-1 8 9-13h-6V2Z",
} as const satisfies Record<Aspiration, string>;
const factions = Object.keys(factionNameKeys) as Faction[];
const factionLogoPaths = {
  guylos: "/images/factions/guylos.png",
  helic: "/images/factions/helic.png",
} as const satisfies Record<Faction, string>;
const pendingIcon = "⌁";
const statNames: StatName[] = [
  "charisma",
  "piloting",
  "strength",
  "synchrony",
  "tactics",
  "technique",
];

export interface PilotConfiguration {
  aspiration: Aspiration;
  faction: Faction;
  name: string;
}

interface PilotCreationScreenProps {
  onConfirm: (configuration: PilotConfiguration) => void;
  onFactionChange: (faction: Faction) => void;
}

export function PilotCreationScreen({
  onConfirm,
  onFactionChange,
}: PilotCreationScreenProps) {
  const [aspiration, setAspiration] = useState<Aspiration | null>(null);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const submittedRef = useRef(false);
  const titleId = useId();
  const { i18n, t } = useTranslation("interface");
  const stats = aspiration ? getInitialStats(aspiration) : null;
  const isComplete = Boolean(name.trim() && aspiration && faction);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function changeFaction(selectedFaction: Faction) {
    setFaction(selectedFaction);
    onFactionChange(selectedFaction);
  }

  function submitPilot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!aspiration || !faction || !isComplete || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    setSubmitted(true);
    onConfirm({ aspiration, faction, name });
  }

  return (
    <main className="pilot-creation screen">
      <Panel className="pilot-creation__panel" labelledBy={titleId}>
        <form className="pilot-creation__form" onSubmit={submitPilot}>
          <header className="pilot-creation__heading">
            <Badge>{t("pilotCreation.badge")}</Badge>
            <h1 id={titleId} ref={headingRef} tabIndex={-1}>
              {t("pilotCreation.title")}
            </h1>
            <p>{t("pilotCreation.description")}</p>
          </header>

          <div className="pilot-creation__identity">
            <label className="pilot-creation__name">
              <span>{t("pilotCreation.name.label")}</span>
              <input
                autoComplete="name"
                disabled={submitted}
                name="pilot-name"
                onChange={(event) => setName(event.target.value)}
                placeholder={t("pilotCreation.name.placeholder")}
                required
                type="text"
                value={name}
              />
            </label>

            <fieldset className="pilot-creation__choices" disabled={submitted}>
              <legend>{t("pilotCreation.faction")}</legend>
              <div className="pilot-creation__option-grid pilot-creation__option-grid--factions">
                {factions.map((factionOption) => (
                  <label
                    className="pilot-option pilot-option--faction"
                    data-faction={factionOption}
                    key={factionOption}
                  >
                    <input
                      aria-label={i18n.t(factionNameKeys[factionOption])}
                      checked={faction === factionOption}
                      name="faction"
                      onChange={() => changeFaction(factionOption)}
                      required
                      type="radio"
                      value={factionOption}
                    />
                    <span className="pilot-option__content">
                      <img
                        alt=""
                        aria-hidden="true"
                        src={factionLogoPaths[factionOption]}
                      />
                      <strong>{i18n.t(factionNameKeys[factionOption])}</strong>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <fieldset
            className="pilot-creation__choices pilot-creation__choices--aspirations"
            disabled={submitted}
          >
            <legend>{t("pilotCreation.aspiration")}</legend>
            <div className="pilot-creation__option-grid pilot-creation__option-grid--aspirations">
              {aspirations.map((aspirationOption) => (
                <label
                  className="pilot-option pilot-option--aspiration"
                  key={aspirationOption}
                >
                  <input
                    aria-label={i18n.t(aspirationNameKeys[aspirationOption])}
                    checked={aspiration === aspirationOption}
                    name="aspiration"
                    onChange={() => setAspiration(aspirationOption)}
                    required
                    type="radio"
                    value={aspirationOption}
                  />
                  <span className="pilot-option__content">
                    <svg
                      aria-hidden="true"
                      className="pilot-option__icon"
                      viewBox="0 0 24 24"
                    >
                      <path d={aspirationIconPaths[aspirationOption]} />
                    </svg>
                    <span className="pilot-option__text">
                      <strong>
                        {i18n.t(aspirationNameKeys[aspirationOption])}
                      </strong>
                      <small>
                        {t(`pilotCreation.aspirations.${aspirationOption}`)}
                      </small>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section
            aria-live="polite"
            aria-labelledby={`${titleId}-stats`}
            className={`pilot-creation__stats ${
              stats ? "" : "pilot-creation__stats--pending"
            }`.trim()}
          >
            <h2 id={`${titleId}-stats`}>{t("pilotCreation.stats.title")}</h2>
            {stats ? (
              <div className="pilot-creation__stat-grid">
                {statNames.map((statName) => (
                  <Meter
                    key={statName}
                    label={t(`pilotCreation.stats.${statName}`)}
                    max={5}
                    value={stats[statName]}
                  />
                ))}
              </div>
            ) : (
              <div className="pilot-creation__pending">
                <span aria-hidden="true">{pendingIcon}</span>
                <div>
                  <strong>{t("pilotCreation.stats.pending")}</strong>
                  <p>{t("pilotCreation.stats.pendingDescription")}</p>
                </div>
              </div>
            )}
          </section>

          <Button disabled={!isComplete || submitted} type="submit">
            {t("pilotCreation.confirm")}
          </Button>
        </form>
      </Panel>
    </main>
  );
}
