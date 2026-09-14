import { useId } from "react";
import type {
  Decision,
  DecisionEvent,
  EventGameState,
  ZoidId,
} from "../domain/types";
import { TacticalCareerPanel } from "./TacticalCareerPanel";
import { recordResolvedYear } from "../domain/career";
import { DecisionOutcomeScreen } from "./DecisionOutcomeScreen";
import { DecisionResolutionScreen } from "./DecisionResolutionScreen";
import { DecisionSelectionScreen } from "./DecisionSelectionScreen";
import { ScreenTransition } from "./ScreenTransition";
import { Panel } from "./UiPrimitives";

interface DecisionScreenProps {
  event: DecisionEvent;
  onAbandon: () => void;
  onCloseYear: () => void;
  onDecision: (decision: Decision) => void;
  onRevealOutcome: () => void;
  onSelectZoid?: (id: ZoidId) => void;
  reducedMotion: boolean;
  state: EventGameState;
}

export function DecisionScreen({
  event,
  onAbandon,
  onCloseYear,
  onDecision,
  onRevealOutcome,
  onSelectZoid,
  reducedMotion,
  state,
}: DecisionScreenProps) {
  const titleId = useId();
  const displayedPilot =
    state.phase === "animating" ? state.result.pilotBefore : state.pilot;
  const phaseTitleId = `${titleId}-${state.phase}`;

  return (
    <main className="decision-screen screen">
      <Panel className="decision-screen__panel" labelledBy={phaseTitleId}>
        <TacticalCareerPanel
          pilot={displayedPilot}
          history={
            state.phase === "outcome"
              ? recordResolvedYear(state.history, state.eventId, state.result)
              : state.history
          }
          onSelectZoid={state.phase === "choosing" ? onSelectZoid : undefined}
        />
        <div className="decision-screen__content">
          <ScreenTransition
            reducedMotion={reducedMotion}
            transitionKey={state.phase}
          >
            {state.phase === "choosing" ? (
              <DecisionSelectionScreen
                event={event}
                onDecision={onDecision}
                pilot={state.pilot}
                reducedMotion={reducedMotion}
                titleId={phaseTitleId}
              />
            ) : state.phase === "animating" ? (
              <DecisionResolutionScreen
                event={event}
                onRevealOutcome={onRevealOutcome}
                reducedMotion={reducedMotion}
                result={state.result}
                titleId={phaseTitleId}
              />
            ) : (
              <DecisionOutcomeScreen
                event={event}
                onAbandon={onAbandon}
                onCloseYear={onCloseYear}
                result={state.result}
                titleId={phaseTitleId}
              />
            )}
          </ScreenTransition>
        </div>
      </Panel>
    </main>
  );
}
