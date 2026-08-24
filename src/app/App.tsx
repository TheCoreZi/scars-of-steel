import { useEffect, useRef, useState } from "react";

import { getEligibleEventIds, selectEvent } from "../domain/eventPools";
import { getEvent } from "../domain/events";
import {
  advanceCareerYear,
  createCareerHistory,
  getCareerEndReason,
  recordResolvedYear,
} from "../domain/career";
import { selectNickname } from "../domain/nicknames";
import { createInitialPilot } from "../domain/pilot";
import { createSecureRandomGenerator } from "../domain/random";
import type {
  Decision,
  GameState,
  PilotCreationGameState,
} from "../domain/types";
import { selectTitle } from "../domain/titles";
import { resolveYear } from "../domain/year";
import { AppControls } from "./AppControls";
import {
  loadColorModePreference,
  saveColorModePreference,
} from "./colorModeStorage";
import { DecisionScreen } from "./DecisionScreen";
import { FinalScreen } from "./FinalScreen";
import {
  type CompletedGame,
  createCompletedGame,
  loadGameData,
  saveGameData,
} from "./gameStorage";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { ScreenTransition } from "./ScreenTransition";
import { WelcomeScreen } from "./WelcomeScreen";

export function App() {
  const [appState, setAppState] = useState<{
    completedGames: readonly CompletedGame[];
    gameState: GameState;
  }>(() => {
    const storedData = loadGameData();

    return {
      completedGames: storedData.completedGames,
      gameState: storedData.activeGame ?? ({ screen: "welcome" } as const),
    };
  });
  const [colorMode, setColorMode] = useState(loadColorModePreference);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasResolvedDecisionRef = useRef(false);
  const hasClosedYearRef = useRef(false);
  const hasCreatedPilotRef = useRef(false);
  const randomRef = useRef(createSecureRandomGenerator());
  const { gameState } = appState;

  useEffect(() => {
    saveGameData({
      activeGame:
        appState.gameState.screen === "event" ||
        appState.gameState.screen === "pilot-creation"
          ? appState.gameState
          : null,
      completedGames: appState.completedGames,
      version: 2,
    });
  }, [appState]);

  useEffect(() => {
    saveColorModePreference(colorMode);
  }, [colorMode]);

  function updateGameState(
    update: GameState | ((currentState: GameState) => GameState),
  ) {
    setAppState((currentState) => ({
      ...currentState,
      gameState:
        typeof update === "function" ? update(currentState.gameState) : update,
    }));
  }

  function openCompletedGame(game: CompletedGame) {
    updateGameState(game.state);
  }

  function startGame() {
    hasClosedYearRef.current = false;
    hasResolvedDecisionRef.current = false;
    hasCreatedPilotRef.current = false;
    updateGameState((currentState) =>
      currentState.screen === "welcome"
        ? {
            draft: { aspiration: null, faction: null, name: "" },
            screen: "pilot-creation",
          }
        : currentState,
    );
  }

  function changePilotDraft(draft: PilotCreationGameState["draft"]) {
    updateGameState((currentState) =>
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
    const history = createCareerHistory();
    const event = selectEvent(
      getEligibleEventIds(pilot.age, history.completedEventIds),
      randomRef.current,
    );

    updateGameState({
      eventId: event.id,
      history,
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
    hasClosedYearRef.current = false;
    updateGameState({
      eventId: gameState.eventId,
      history: gameState.history,
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
    updateGameState((currentState) =>
      currentState.screen === "event" && currentState.phase === "animating"
        ? {
            eventId: currentState.eventId,
            history: currentState.history,
            phase: "outcome",
            pilot: currentState.pilot,
            result: currentState.result,
            screen: "event",
          }
        : currentState,
    );
  }

  function closeYear() {
    if (
      hasClosedYearRef.current ||
      gameState.screen !== "event" ||
      gameState.phase !== "outcome"
    ) {
      return;
    }

    hasClosedYearRef.current = true;
    const history = recordResolvedYear(
      gameState.history,
      gameState.eventId,
      gameState.result,
    );
    const pilot = advanceCareerYear(gameState.pilot);
    const eligibleEventIds = getEligibleEventIds(
      pilot.age,
      history.completedEventIds,
    );
    const endReason = getCareerEndReason(
      pilot,
      eligibleEventIds,
      gameState.result.outcome,
    );

    if (endReason) {
      const finalState = {
        endReason,
        history,
        nicknameId: selectNickname(pilot.stats, randomRef.current),
        pilot,
        screen: "final",
        titleId: selectTitle(pilot, history, endReason),
      } as const;

      setAppState((currentState) => ({
        completedGames: [
          createCompletedGame(finalState),
          ...currentState.completedGames.filter(
            ({ state }) => state.pilot.id !== pilot.id,
          ),
        ],
        gameState: finalState,
      }));
      return;
    }

    hasClosedYearRef.current = false;
    hasResolvedDecisionRef.current = false;
    const event = selectEvent(eligibleEventIds, randomRef.current);

    updateGameState({
      eventId: event.id,
      history,
      phase: "choosing",
      pilot,
      screen: "event",
    });
  }

  function restartGame() {
    hasClosedYearRef.current = false;
    hasCreatedPilotRef.current = false;
    hasResolvedDecisionRef.current = false;
    updateGameState({ screen: "welcome" });
  }

  const faction =
    gameState.screen === "event" || gameState.screen === "final"
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
            completedGames={appState.completedGames}
            onReducedMotionChange={setReducedMotion}
            onSelectGame={openCompletedGame}
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
        ) : gameState.screen === "event" ? (
          <DecisionScreen
            event={getEvent(gameState.eventId)}
            onAbandon={restartGame}
            onCloseYear={closeYear}
            onDecision={chooseDecision}
            onReducedMotionChange={setReducedMotion}
            onRevealOutcome={revealOutcome}
            reducedMotion={reducedMotion}
            state={gameState}
          />
        ) : (
          <FinalScreen
            colorMode={colorMode}
            onRestart={restartGame}
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
