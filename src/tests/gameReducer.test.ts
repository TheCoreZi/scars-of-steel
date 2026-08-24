import { describe, expect, test } from "vitest";

import {
  type AppState,
  type GameAction,
  GameActionType,
  gameReducer,
} from "../app/gameReducer";
import { createCompletedGame } from "../app/gameStorage";
import { advanceCareerYear, createCareerHistory } from "../domain/career";
import { eventCatalog } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import { createSeededRandomGenerator } from "../domain/random";
import type { FinalGameState, OutcomeEventGameState } from "../domain/types";
import { resolveYear } from "../domain/year";

const history = createCareerHistory();
const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:reducer",
  name: "Lena",
});
const welcomeState = {
  completedGames: [],
  gameState: { screen: "welcome" },
} as const satisfies AppState;

function createChoosingState(): AppState {
  return {
    completedGames: [],
    gameState: {
      eventId: eventCatalog.firstExercises.id,
      history,
      phase: "choosing",
      pilot,
      screen: "event",
    },
  };
}

function createOutcomeState(): AppState & {
  gameState: OutcomeEventGameState;
} {
  const result = resolveYear(
    eventCatalog.firstExercises.decisions[0],
    eventCatalog.firstExercises,
    pilot,
    createSeededRandomGenerator(1),
  );

  return {
    completedGames: [],
    gameState: {
      eventId: eventCatalog.firstExercises.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result,
      screen: "event",
    },
  };
}

function createFinalState(
  outcomeState: ReturnType<typeof createOutcomeState>,
): FinalGameState {
  return {
    endReason: "no-eligible-events",
    history: outcomeState.gameState.history,
    nicknameId: "nickname:guardian",
    pilot: advanceCareerYear(outcomeState.gameState.pilot),
    screen: "final",
    titleId: "title:false-promise",
  };
}

describe("game reducer", () => {
  test("starts the game and changes the pilot draft", () => {
    const started = gameReducer(welcomeState, {
      type: GameActionType.StartGame,
    });
    const draft = {
      aspiration: "war-hero",
      faction: "helic",
      name: "Lena",
    } as const;
    const changed = gameReducer(started, {
      draft,
      type: GameActionType.ChangePilotDraft,
    });

    expect(started.gameState).toEqual({
      draft: { aspiration: null, faction: null, name: "" },
      screen: "pilot-creation",
    });
    expect(changed.gameState).toEqual({
      draft,
      screen: "pilot-creation",
    });
  });

  test("confirms a pilot only once", () => {
    const started = gameReducer(welcomeState, {
      type: GameActionType.StartGame,
    });
    const action = {
      eventId: eventCatalog.firstExercises.id,
      history,
      pilot,
      type: GameActionType.ConfirmPilot,
    } as const satisfies GameAction;
    const confirmed = gameReducer(started, action);

    expect(confirmed.gameState).toMatchObject({
      eventId: eventCatalog.firstExercises.id,
      phase: "choosing",
      pilot,
      screen: "event",
    });
    expect(gameReducer(confirmed, action)).toBe(confirmed);
  });

  test("resolves a safe decision only once", () => {
    const state = createChoosingState();
    const action = {
      result: resolveYear(
        eventCatalog.firstExercises.decisions[0],
        eventCatalog.firstExercises,
        pilot,
        createSeededRandomGenerator(1),
      ),
      type: GameActionType.ChooseDecision,
    } as const satisfies GameAction;
    const resolved = gameReducer(state, action);

    expect(resolved.gameState).toMatchObject({
      phase: "outcome",
      screen: "event",
    });
    expect(gameReducer(resolved, action)).toBe(resolved);
  });

  test("animates a chance decision before revealing its outcome", () => {
    const state = createChoosingState();
    const resolved = gameReducer(state, {
      result: resolveYear(
        eventCatalog.firstExercises.decisions[1],
        eventCatalog.firstExercises,
        pilot,
        createSeededRandomGenerator(1),
      ),
      type: GameActionType.ChooseDecision,
    });
    const revealed = gameReducer(resolved, {
      type: GameActionType.RevealOutcome,
    });

    expect(resolved.gameState).toMatchObject({
      phase: "animating",
      screen: "event",
    });
    expect(revealed.gameState).toMatchObject({
      phase: "outcome",
      screen: "event",
    });
    expect(gameReducer(revealed, { type: GameActionType.RevealOutcome })).toBe(
      revealed,
    );
  });

  test("advances from an outcome to the next event", () => {
    const state = createOutcomeState();
    const nextPilot = advanceCareerYear(state.gameState.pilot);
    const advanced = gameReducer(state, {
      eventId: eventCatalog.strayZoid.id,
      history: state.gameState.history,
      pilot: nextPilot,
      type: GameActionType.AdvanceYear,
    });

    expect(advanced.gameState).toEqual({
      eventId: eventCatalog.strayZoid.id,
      history: state.gameState.history,
      phase: "choosing",
      pilot: nextPilot,
      screen: "event",
    });
  });

  test("completes a career atomically and replaces its previous record", () => {
    const state = createOutcomeState();
    const finalState = createFinalState(state);
    const otherFinalState = {
      ...finalState,
      pilot: { ...finalState.pilot, id: "pilot:other" },
    } as const satisfies FinalGameState;
    const stateWithRecords = {
      ...state,
      completedGames: [
        createCompletedGame({ ...finalState, titleId: "title:living-legend" }),
        createCompletedGame(otherFinalState),
      ],
    };
    const completed = gameReducer(stateWithRecords, {
      state: finalState,
      type: GameActionType.CompleteCareer,
    });

    expect(completed.gameState).toBe(finalState);
    expect(completed.completedGames).toEqual([
      createCompletedGame(finalState),
      createCompletedGame(otherFinalState),
    ]);
    expect(
      gameReducer(completed, {
        state: finalState,
        type: GameActionType.CompleteCareer,
      }),
    ).toBe(completed);
  });

  test("opens a completed game and restarts at the welcome screen", () => {
    const finalState = createFinalState(createOutcomeState());
    const game = createCompletedGame(finalState);
    const state = { ...welcomeState, completedGames: [game] };
    const opened = gameReducer(state, {
      game,
      type: GameActionType.OpenCompletedGame,
    });
    const restarted = gameReducer(opened, {
      type: GameActionType.RestartGame,
    });

    expect(opened.gameState).toBe(finalState);
    expect(restarted).toEqual({
      completedGames: [game],
      gameState: { screen: "welcome" },
    });
  });

  test("rejects transitions from invalid screens and mismatched pilots", () => {
    const outcomeState = createOutcomeState();
    const wrongPilot = { ...pilot, id: "pilot:other" as const };

    expect(
      gameReducer(welcomeState, {
        draft: { aspiration: null, faction: null, name: "" },
        type: GameActionType.ChangePilotDraft,
      }),
    ).toBe(welcomeState);
    expect(
      gameReducer(outcomeState, {
        eventId: eventCatalog.strayZoid.id,
        history,
        pilot: wrongPilot,
        type: GameActionType.AdvanceYear,
      }),
    ).toBe(outcomeState);
    expect(
      gameReducer(welcomeState, { type: GameActionType.RevealOutcome }),
    ).toBe(welcomeState);
    expect(
      gameReducer(welcomeState, { type: GameActionType.RestartGame }),
    ).toBe(welcomeState);
  });
});
