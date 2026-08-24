import { useEffect, useReducer, useRef, useState } from "react";

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
import type { Decision, PilotCreationGameState } from "../domain/types";
import { selectTitle } from "../domain/titles";
import { resolveYear } from "../domain/year";
import { AppControls } from "./AppControls";
import {
  loadColorModePreference,
  saveColorModePreference,
} from "./colorModeStorage";
import { DecisionScreen } from "./DecisionScreen";
import { FinalScreen } from "./FinalScreen";
import { type CompletedGame, loadGameData, saveGameData } from "./gameStorage";
import { type AppState, GameActionType, gameReducer } from "./gameReducer";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { ScreenTransition } from "./ScreenTransition";
import { WelcomeScreen } from "./WelcomeScreen";

export function App() {
  const [appState, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialAppState,
  );
  const [colorMode, setColorMode] = useState(loadColorModePreference);
  const [reducedMotion, setReducedMotion] = useState(false);
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

  function openCompletedGame(game: CompletedGame) {
    dispatch({ game, type: GameActionType.OpenCompletedGame });
  }

  function startGame() {
    dispatch({ type: GameActionType.StartGame });
  }

  function changePilotDraft(draft: PilotCreationGameState["draft"]) {
    dispatch({ draft, type: GameActionType.ChangePilotDraft });
  }

  function confirmPilot(configuration: PilotConfiguration) {
    if (gameState.screen !== "pilot-creation") {
      return;
    }

    const pilot = createInitialPilot({
      ...configuration,
      id: `pilot:${crypto.randomUUID()}`,
    });
    const history = createCareerHistory();
    const event = selectEvent(
      getEligibleEventIds(pilot.age, history.completedEventIds),
      randomRef.current,
    );

    dispatch({
      eventId: event.id,
      history,
      pilot,
      type: GameActionType.ConfirmPilot,
    });
  }

  function chooseDecision(decision: Decision) {
    if (gameState.screen !== "event" || gameState.phase !== "choosing") {
      return;
    }

    const event = getEvent(gameState.eventId);
    const result = resolveYear(
      decision,
      event,
      gameState.pilot,
      randomRef.current,
    );

    dispatch({ result, type: GameActionType.ChooseDecision });
  }

  function revealOutcome() {
    dispatch({ type: GameActionType.RevealOutcome });
  }

  function closeYear() {
    if (gameState.screen !== "event" || gameState.phase !== "outcome") {
      return;
    }

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

      dispatch({ state: finalState, type: GameActionType.CompleteCareer });
      return;
    }

    const event = selectEvent(eligibleEventIds, randomRef.current);

    dispatch({
      eventId: event.id,
      history,
      pilot,
      type: GameActionType.AdvanceYear,
    });
  }

  function restartGame() {
    dispatch({ type: GameActionType.RestartGame });
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

function createInitialAppState(): AppState {
  const storedData = loadGameData();

  return {
    completedGames: storedData.completedGames,
    gameState: storedData.activeGame ?? { screen: "welcome" },
  };
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
