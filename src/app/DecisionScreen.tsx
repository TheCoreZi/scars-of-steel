import { useId } from "react";

import type { Decision, DecisionEvent, EventGameState } from "../domain/types";
import { AnimationToggle } from "./AppControls";
import { CareerStatusBar } from "./CareerStatusBar";
import { DecisionOutcomeScreen } from "./DecisionOutcomeScreen";
import { DecisionResolutionScreen } from "./DecisionResolutionScreen";
import { DecisionSelectionScreen } from "./DecisionSelectionScreen";
import { ScreenTransition } from "./ScreenTransition";
import { Panel } from "./UiPrimitives";

interface DecisionScreenProps {
  event: DecisionEvent;
  onCloseYear: () => void;
  onDecision: (decision: Decision) => void;
  onReducedMotionChange: (reducedMotion: boolean) => void;
  onRevealOutcome: () => void;
  reducedMotion: boolean;
  state: EventGameState;
}

export function DecisionScreen({
  event,
  onCloseYear,
  onDecision,
  onReducedMotionChange,
  onRevealOutcome,
  reducedMotion,
  state,
}: DecisionScreenProps) {
  const titleId = useId();
  const displayedPilot =
    state.phase === "animating" ? state.result.pilotBefore : state.pilot;
  const transitionKey = state.phase === "closed" ? "outcome" : state.phase;
  const phaseTitleId = `${titleId}-${transitionKey}`;

  return (
    <main className="decision-screen screen">
      <Panel className="decision-screen__panel" labelledBy={phaseTitleId}>
        <CareerStatusBar pilot={displayedPilot} />
        <div className="decision-screen__content">
          <AnimationToggle
            onReducedMotionChange={onReducedMotionChange}
            reducedMotion={reducedMotion}
          />
          <ScreenTransition
            reducedMotion={reducedMotion}
            transitionKey={transitionKey}
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
                closed={state.phase === "closed"}
                event={event}
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
