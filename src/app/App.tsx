import { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
import {
  createSecureRandomGenerator,
  type RandomGenerator,
} from "../domain/random";
import type {
  Decision,
  EventId,
  PilotCreationGameState,
} from "../domain/types";
import { translate } from "../i18n";
import { selectTitle } from "../domain/titles";
import { resolveYear } from "../domain/year";
import { AppControls } from "./AppControls";
import {
  loadColorModePreference,
  saveColorModePreference,
} from "./colorModeStorage";
import { DecisionScreen } from "./DecisionScreen";
import { FanProjectFooter } from "./FanProjectFooter";
import { FinalScreen } from "./FinalScreen";
import { type CompletedGame, loadGameData, saveGameData } from "./gameStorage";
import { type AppState, GameActionType, gameReducer } from "./gameReducer";
import {
  PilotCreationScreen,
  type PilotConfiguration,
} from "./PilotCreationScreen";
import { ScreenTransition } from "./ScreenTransition";
import { WelcomeScreen } from "./WelcomeScreen";

const DEV_DECISION_RESULTS = {
  failure: "failure",
  random: "random",
  success: "success",
} as const;
const isDevMode = import.meta.env.DEV;

type DevDecisionResult =
  (typeof DEV_DECISION_RESULTS)[keyof typeof DEV_DECISION_RESULTS];

export function App() {
  const { t } = useTranslation("interface");
  const [appState, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialAppState,
  );
  const [colorMode, setColorMode] = useState(loadColorModePreference);
  const [decisionResult, setDecisionResult] =
    useState<DevDecisionResult>("random");
  const [nextEventId, setNextEventId] = useState<EventId | "">("");
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
      getEligibleEventIds(pilot, history.completedEventIds),
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
    const random = createDecisionRandom(
      randomRef.current,
      isDevMode && decision.kind === "chance" ? decisionResult : "random",
    );
    const result = resolveYear(decision, event, gameState.pilot, random);
    setDecisionResult("random");

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
    const pilot = advanceCareerYear(gameState.pilot, gameState.result.outcome);
    const eligibleEventIds = getEligibleEventIds(
      pilot,
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

    const event =
      isDevMode && nextEventId && eligibleEventIds.includes(nextEventId)
        ? getEvent(nextEventId)
        : selectEvent(eligibleEventIds, randomRef.current);
    setNextEventId("");

    dispatch({
      eventId: event.id,
      history,
      pilot,
      type: GameActionType.AdvanceYear,
    });
  }

  function restartGame() {
    setDecisionResult("random");
    setNextEventId("");
    dispatch({ type: GameActionType.RestartGame });
  }

  const faction =
    gameState.screen === "event" || gameState.screen === "final"
      ? gameState.pilot.faction
      : gameState.screen === "pilot-creation"
        ? gameState.draft.faction
        : null;

  const nextPilot =
    isDevMode && gameState.screen === "event" && gameState.phase === "outcome"
      ? advanceCareerYear(gameState.pilot, gameState.result.outcome)
      : null;
  const nextEventPool =
    nextPilot && gameState.screen === "event" && gameState.phase === "outcome"
      ? getEligibleEventIds(nextPilot, [
          ...gameState.history.completedEventIds,
          gameState.eventId,
        ])
      : [];
  const canSelectNextEvent =
    nextPilot &&
    gameState.screen === "event" &&
    gameState.phase === "outcome" &&
    !getCareerEndReason(nextPilot, nextEventPool, gameState.result.outcome);
  const canOverrideChanceDecision =
    isDevMode &&
    gameState.screen === "event" &&
    gameState.phase === "choosing" &&
    getEvent(gameState.eventId).decisions.some(
      (decision) => decision.kind === "chance",
    );

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
      <FanProjectFooter />
      {canOverrideChanceDecision ? (
        <aside aria-label={t("devEvents.chanceOutcome")}>
          <label className="dev-event-selector">
            <span>{t("devEvents.chanceOutcome")}</span>
            <select
              value={decisionResult}
              onChange={(event) =>
                setDecisionResult(event.target.value as DevDecisionResult)
              }
            >
              <option value={DEV_DECISION_RESULTS.random}>
                {t("devEvents.random")}
              </option>
              <option value={DEV_DECISION_RESULTS.success}>
                {t("devEvents.success")}
              </option>
              <option value={DEV_DECISION_RESULTS.failure}>
                {t("devEvents.failure")}
              </option>
            </select>
          </label>
        </aside>
      ) : null}
      {isDevMode && canSelectNextEvent ? (
        <aside aria-label={t("devEvents.next")}>
          <label className="dev-event-selector">
            <span>{t("devEvents.next")}</span>
            <select
              value={nextEventId}
              onChange={(event) =>
                setNextEventId(event.target.value as EventId | "")
              }
            >
              <option value="">{t("devEvents.random")}</option>
              {nextEventPool.map((id) => (
                <option key={id} value={id}>
                  {translate(getEvent(id).titleKey)}
                </option>
              ))}
            </select>
          </label>
        </aside>
      ) : null}
    </div>
  );
}

function createDecisionRandom(
  random: RandomGenerator,
  result: DevDecisionResult,
): RandomGenerator {
  if (result === "random") {
    return random;
  }

  let isDecisionRoll = true;

  return {
    ...random,
    probability: () => {
      if (!isDecisionRoll) {
        return random.probability();
      }

      isDecisionRoll = false;
      return result === "success" ? 0 : 1;
    },
  };
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
