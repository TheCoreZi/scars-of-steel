import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { createInitialPilot } from "../domain/pilot";
import type {
  ChoosingAcademyEventGameState,
  Faction,
  WelcomeGameState,
} from "../domain/types";
import { AppControls, type ColorMode } from "./AppControls";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { Badge, Panel } from "./UiPrimitives";
import { WelcomeScreen } from "./WelcomeScreen";

type IntroGameState =
  | ChoosingAcademyEventGameState
  | { screen: "pilot-creation" }
  | WelcomeGameState;

export function App() {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [gameState, setGameState] = useState<IntroGameState>({
    screen: "welcome",
  });
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const pilotCreatedRef = useRef(false);

  function startGame() {
    pilotCreatedRef.current = false;
    setSelectedFaction(null);
    setGameState((currentState) =>
      currentState.screen === "welcome"
        ? { screen: "pilot-creation" }
        : currentState,
    );
  }

  function confirmPilot(configuration: PilotConfiguration) {
    if (pilotCreatedRef.current) {
      return;
    }

    pilotCreatedRef.current = true;
    const pilot = createInitialPilot({
      ...configuration,
      id: `pilot:${crypto.randomUUID()}`,
    });

    setGameState({
      eventId: "academy-event:first-exercises",
      phase: "choosing",
      pilot,
      screen: "academy-event",
    });
  }

  const faction =
    gameState.screen === "academy-event"
      ? gameState.pilot.faction
      : selectedFaction;

  return (
    <div
      className="app-shell"
      data-color-mode={colorMode}
      data-faction={faction ?? "neutral"}
    >
      <BackgroundDamage />
      <AppControls colorMode={colorMode} onColorModeChange={setColorMode} />
      {gameState.screen === "welcome" ? (
        <WelcomeScreen onStart={startGame} />
      ) : gameState.screen === "pilot-creation" ? (
        <PilotCreationScreen
          onConfirm={confirmPilot}
          onFactionChange={setSelectedFaction}
        />
      ) : (
        <AcademyEventStart pilotName={gameState.pilot.name} />
      )}
    </div>
  );
}

function BackgroundDamage() {
  return (
    <div aria-hidden="true" className="welcome__damage">
      <div className="welcome__claws">
        <span />
        <span />
        <span />
      </div>
      <div className="welcome__bullets">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

interface AcademyEventStartProps {
  pilotName: string;
}

function AcademyEventStart({ pilotName }: AcademyEventStartProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const { t } = useTranslation("interface");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="screen screen--centered">
      <Panel className="academy-event-start" labelledBy={titleId}>
        <Badge>{t("academyEvent.badge")}</Badge>
        <h1 id={titleId} ref={headingRef} tabIndex={-1}>
          {t("academyEvent.title")}
        </h1>
        <p>{t("academyEvent.description", { name: pilotName })}</p>
      </Panel>
    </main>
  );
}
