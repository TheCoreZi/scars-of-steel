import { useRef, useState } from "react";

import { selectInitialEvent } from "../domain/eventPools";
import { getEvent } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import { createSecureRandomGenerator } from "../domain/random";
import type {
  Decision,
  EventGameState,
  PilotCreationGameState,
  WelcomeGameState,
} from "../domain/types";
import { resolveYear } from "../domain/year";
import { AppControls, type ColorMode } from "./AppControls";
import { DecisionScreen } from "./DecisionScreen";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { ScreenTransition } from "./ScreenTransition";
import { WelcomeScreen } from "./WelcomeScreen";

type IntroGameState =
  EventGameState | PilotCreationGameState | WelcomeGameState;

export function App() {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [gameState, setGameState] = useState<IntroGameState>({
    screen: "welcome",
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasResolvedDecisionRef = useRef(false);
  const hasCreatedPilotRef = useRef(false);
  const randomRef = useRef(createSecureRandomGenerator());

  function startGame() {
    hasResolvedDecisionRef.current = false;
    hasCreatedPilotRef.current = false;
    setGameState((currentState) =>
      currentState.screen === "welcome"
        ? {
            draft: { aspiration: null, faction: null, name: "" },
            screen: "pilot-creation",
          }
        : currentState,
    );
  }

  function changePilotDraft(draft: PilotCreationGameState["draft"]) {
    setGameState((currentState) =>
      currentState.screen === "pilot-creation"
        ? { ...currentState, draft }
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

    const event = getEvent(gameState.eventId);
    const result = resolveYear(
      decision,
      event,
      gameState.pilot,
      randomRef.current,
    );

    hasResolvedDecisionRef.current = true;
    setGameState({
      eventId: gameState.eventId,
      ...(result.resolution.kind === "chance"
        ? {
            phase: "animating" as const,
            result: { ...result, resolution: result.resolution },
          }
        : { phase: "outcome" as const, result }),
      screen: "event",
      pilot: result.pilotAfter,
    });
  }

  function revealOutcome() {
    setGameState((currentState) =>
      currentState.screen === "event" && currentState.phase === "animating"
        ? {
            eventId: currentState.eventId,
            phase: "outcome",
            pilot: currentState.pilot,
            result: currentState.result,
            screen: "event",
          }
        : currentState,
    );
  }

  function closeYear() {
    setGameState((currentState) =>
      currentState.screen === "event" && currentState.phase === "outcome"
        ? {
            eventId: currentState.eventId,
            phase: "closed",
            pilot: currentState.pilot,
            result: currentState.result,
            screen: "event",
          }
        : currentState,
    );
  }

  const faction =
    gameState.screen === "event"
      ? gameState.pilot.faction
      : gameState.screen === "pilot-creation"
        ? gameState.draft.faction
        : null;

  return (
    <div
      className="app-shell"
      data-color-mode={colorMode}
      data-faction={faction ?? "neutral"}
      data-reduced-motion={reducedMotion || undefined}
    >
      <BackgroundDamage />
      <AppControls colorMode={colorMode} onColorModeChange={setColorMode} />
      <ScreenTransition
        reducedMotion={reducedMotion}
        transitionKey={gameState.screen}
      >
        {gameState.screen === "welcome" ? (
          <WelcomeScreen
            onReducedMotionChange={setReducedMotion}
            onStart={startGame}
            reducedMotion={reducedMotion}
          />
        ) : gameState.screen === "pilot-creation" ? (
          <PilotCreationScreen
            draft={gameState.draft}
            onDraftChange={changePilotDraft}
            onConfirm={confirmPilot}
            onReducedMotionChange={setReducedMotion}
            reducedMotion={reducedMotion}
          />
        ) : (
          <DecisionScreen
            event={getEvent(gameState.eventId)}
            onCloseYear={closeYear}
            onDecision={chooseDecision}
            onReducedMotionChange={setReducedMotion}
            onRevealOutcome={revealOutcome}
            reducedMotion={reducedMotion}
            state={gameState}
          />
        )}
      </ScreenTransition>
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
