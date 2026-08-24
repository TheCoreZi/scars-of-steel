import type {
  CareerHistory,
  EventId,
  FinalGameState,
  GameState,
  Pilot,
  PilotDraft,
  ResolvedYear,
} from "../domain/types";
import type { CompletedGame } from "./gameStorage";

export interface AppState {
  completedGames: readonly CompletedGame[];
  gameState: GameState;
}

export const GameActionType = {
  AdvanceYear: "advance-year",
  ChangePilotDraft: "change-pilot-draft",
  ChooseDecision: "choose-decision",
  CompleteCareer: "complete-career",
  ConfirmPilot: "confirm-pilot",
  OpenCompletedGame: "open-completed-game",
  RestartGame: "restart-game",
  RevealOutcome: "reveal-outcome",
  StartGame: "start-game",
} as const;

interface AdvanceYearAction {
  eventId: EventId;
  history: CareerHistory;
  pilot: Pilot;
  type: typeof GameActionType.AdvanceYear;
}

interface ChangePilotDraftAction {
  draft: PilotDraft;
  type: typeof GameActionType.ChangePilotDraft;
}

interface ChooseDecisionAction {
  result: ResolvedYear;
  type: typeof GameActionType.ChooseDecision;
}

interface CompleteCareerAction {
  state: FinalGameState;
  type: typeof GameActionType.CompleteCareer;
}

interface ConfirmPilotAction {
  eventId: EventId;
  history: CareerHistory;
  pilot: Pilot;
  type: typeof GameActionType.ConfirmPilot;
}

interface OpenCompletedGameAction {
  game: CompletedGame;
  type: typeof GameActionType.OpenCompletedGame;
}

interface RestartGameAction {
  type: typeof GameActionType.RestartGame;
}

interface RevealOutcomeAction {
  type: typeof GameActionType.RevealOutcome;
}

interface StartGameAction {
  type: typeof GameActionType.StartGame;
}

export type GameAction =
  | AdvanceYearAction
  | ChangePilotDraftAction
  | ChooseDecisionAction
  | CompleteCareerAction
  | ConfirmPilotAction
  | OpenCompletedGameAction
  | RestartGameAction
  | RevealOutcomeAction
  | StartGameAction;

export function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case GameActionType.AdvanceYear:
      return state.gameState.screen === "event" &&
        state.gameState.phase === "outcome" &&
        state.gameState.pilot.id === action.pilot.id
        ? {
            ...state,
            gameState: {
              eventId: action.eventId,
              history: action.history,
              phase: "choosing",
              pilot: action.pilot,
              screen: "event",
            },
          }
        : state;
    case GameActionType.ChangePilotDraft:
      return state.gameState.screen === "pilot-creation"
        ? {
            ...state,
            gameState: { ...state.gameState, draft: action.draft },
          }
        : state;
    case GameActionType.ChooseDecision:
      return state.gameState.screen === "event" &&
        state.gameState.phase === "choosing" &&
        state.gameState.pilot.id === action.result.pilotBefore.id &&
        state.gameState.pilot.id === action.result.pilotAfter.id
        ? {
            ...state,
            gameState: {
              eventId: state.gameState.eventId,
              history: state.gameState.history,
              ...(action.result.resolution.kind === "chance"
                ? {
                    phase: "animating" as const,
                    result: {
                      ...action.result,
                      resolution: action.result.resolution,
                    },
                  }
                : { phase: "outcome" as const, result: action.result }),
              pilot: action.result.pilotAfter,
              screen: "event",
            },
          }
        : state;
    case GameActionType.CompleteCareer:
      return state.gameState.screen === "event" &&
        state.gameState.phase === "outcome" &&
        state.gameState.pilot.id === action.state.pilot.id
        ? {
            completedGames: [
              { state: action.state },
              ...state.completedGames.filter(
                ({ state: completedState }) =>
                  completedState.pilot.id !== action.state.pilot.id,
              ),
            ],
            gameState: action.state,
          }
        : state;
    case GameActionType.ConfirmPilot:
      return state.gameState.screen === "pilot-creation"
        ? {
            ...state,
            gameState: {
              eventId: action.eventId,
              history: action.history,
              phase: "choosing",
              pilot: action.pilot,
              screen: "event",
            },
          }
        : state;
    case GameActionType.OpenCompletedGame:
      return state.gameState.screen === "welcome"
        ? { ...state, gameState: action.game.state }
        : state;
    case GameActionType.RestartGame:
      return state.gameState.screen === "welcome"
        ? state
        : { ...state, gameState: { screen: "welcome" } };
    case GameActionType.RevealOutcome:
      return state.gameState.screen === "event" &&
        state.gameState.phase === "animating"
        ? {
            ...state,
            gameState: { ...state.gameState, phase: "outcome" },
          }
        : state;
    case GameActionType.StartGame:
      return state.gameState.screen === "welcome"
        ? {
            ...state,
            gameState: {
              draft: { aspiration: null, faction: null, name: "" },
              screen: "pilot-creation",
            },
          }
        : state;
  }
}
