import { useRef, useState } from "react";

import { selectInitialEvent } from "../domain/eventPools";
import { getEvent, resolveDecision } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import { createSecureRandomGenerator } from "../domain/random";
import type {
  ChoosingEventGameState,
  Decision,
  Faction,
  ResolvingEventGameState,
  WelcomeGameState,
} from "../domain/types";
import { AppControls, type ColorMode } from "./AppControls";
import { DecisionScreen } from "./DecisionScreen";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { WelcomeScreen } from "./WelcomeScreen";

type IntroGameState =
  | ChoosingEventGameState
  | ResolvingEventGameState
  | { screen: "pilot-creation" }
  | WelcomeGameState;

export function App() {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [gameState, setGameState] = useState<IntroGameState>({
    screen: "welcome",
  });
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const hasResolvedDecisionRef = useRef(false);
  const hasCreatedPilotRef = useRef(false);
  const randomRef = useRef(createSecureRandomGenerator());

  function startGame() {
    hasResolvedDecisionRef.current = false;
    hasCreatedPilotRef.current = false;
    setSelectedFaction(null);
    setGameState((currentState) =>
      currentState.screen === "welcome"
        ? { screen: "pilot-creation" }
        : currentState,
    );
  }

  function confirmPilot(configuration: PilotConfiguration) {
    if (hasCreatedPilotRef.current) {
      return;
    }

    hasCreatedPilotRef.current = true;
    const pilot = createInitialPilot({
      ...configuration,
      id: `pilot:${crypto.randomUUID()}`,
    });
    const event = selectInitialEvent(randomRef.current);

    setGameState({
      eventId: event.id,
      phase: "choosing",
      pilot,
      screen: "event",
    });
  }

  function chooseDecision(decision: Decision) {
    if (
      hasResolvedDecisionRef.current ||
      gameState.screen !== "event" ||
      gameState.phase !== "choosing"
    ) {
      return;
    }

    hasResolvedDecisionRef.current = true;
    setGameState({
      ...gameState,
      phase: "resolving",
      resolution: resolveDecision(decision, gameState.pilot, randomRef.current),
    });
  }

  const faction =
    "pilot" in gameState ? gameState.pilot.faction : selectedFaction;

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
        <DecisionScreen
          event={getEvent(gameState.eventId)}
          onDecision={chooseDecision}
          pilot={gameState.pilot}
          resolution={
            gameState.phase === "resolving" ? gameState.resolution : undefined
          }
        />
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
