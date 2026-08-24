import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DecisionScreen } from "../app/DecisionScreen";
import { createCareerHistory } from "../domain/career";
import { eventCatalog } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import type { RandomGenerator } from "../domain/random";
import {
  createWarState,
  type AnimatingEventGameState,
  type Decision,
  type DecisionEvent,
  type EventGameState,
} from "../domain/types";
import { resolveYear } from "../domain/year";
import { i18n } from "../i18n";

const event = eventCatalog.firstExercises;
const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:decision-screen",
  name: "Lena",
});
const history = createCareerHistory();
const choosingState = {
  eventId: event.id,
  history,
  phase: "choosing",
  pilot,
  screen: "event",
} as const satisfies EventGameState;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  void i18n.changeLanguage("en");
});

describe("general decision screen", () => {
  test("types the incoming transmission", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const { container } = renderScreen(choosingState);
    const heading = screen.getByRole("heading", { level: 1 });
    const description = container.querySelector(
      ".decision-screen__terminal-line p",
    );
    const fullDescription = description?.getAttribute("aria-label") ?? "";
    const fullTitle = heading.getAttribute("aria-label") ?? "";

    expect(heading).toBeEmptyDOMElement();

    act(() => {
      vi.advanceTimersByTime(
        (fullDescription.length + fullTitle.length + 1) * 8,
      );
    });

    expect(heading).toHaveTextContent(fullTitle);
    expect(description).toHaveTextContent(fullDescription);
  });

  test("shows three decisions and an exact accessible target", () => {
    renderScreen(choosingState);

    expect(document.querySelectorAll(".decision-option")).toHaveLength(3);
    expect(document.querySelector(".decision-option__number")).toBeNull();
    expect(
      screen.getByText("War command // secure transmission"),
    ).toBeInTheDocument();
    const chanceButton = screen.getByRole("button", {
      name: /Take the rare Zoid/u,
    });
    expect(
      within(chanceButton).getByRole("img", {
        name: "Success 44%, failure 56%",
      }),
    ).toHaveStyle("--success-percent: 44%");
  });

  test("keeps safe and chance explanations inside their decisions", () => {
    const { container } = renderScreen(choosingState);
    const safeButton = screen.getByRole("button", {
      name: /Take a basic Zoid/u,
    });
    const chanceButton = screen.getByRole("button", {
      name: /Take the rare Zoid/u,
    });

    expect(within(safeButton).getByText("Safe")).toBeInTheDocument();
    expect(within(safeButton).queryByRole("img")).not.toBeInTheDocument();
    expect(within(chanceButton).getByText("With risk")).toBeInTheDocument();
    expect(within(chanceButton).getByText("With risk · 44%")).toHaveClass(
      "decision-option__risk-compact",
    );
    expect(
      container.querySelector(".decision-screen__panel > .career-status"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".decision-screen__content > .animation-toggle"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".career-status .animation-toggle"),
    ).toBeNull();
  });

  test("reports the selected decision", () => {
    const onDecision = vi.fn();
    renderScreen(choosingState, { onDecision });

    fireEvent.click(screen.getByRole("button", { name: /Take a basic Zoid/u }));

    expect(onDecision).toHaveBeenCalledOnce();
    expect(onDecision).toHaveBeenCalledWith(event.decisions[0]);
  });

  test("localizes the reusable interface in Spanish", async () => {
    await i18n.changeLanguage("es");
    renderScreen(choosingState);

    expect(screen.getByText("Elige tu respuesta")).toBeInTheDocument();
    expect(
      screen.getByText("Comando de guerra // transmisión segura"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tomar el Zoid raro/u }),
    ).toBeInTheDocument();
  });
});

describe("decision resolution", () => {
  test("shows only the selected decision and target while animating", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const onRevealOutcome = vi.fn();
    const state = createAnimatingState(0.2);
    const { container } = renderScreen(state, { onRevealOutcome });

    expect(screen.getByText("Take the rare Zoid")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Resolution target/u })).toHaveStyle(
      "--success-percent: 44%",
    );
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    const reservedIndicator = container.querySelector(
      ".resolution-screen__indicator",
    );
    expect(reservedIndicator).toBeInTheDocument();
    expect(reservedIndicator).not.toHaveAttribute("data-visible");
    expect(container.querySelectorAll(".decision-option")).toHaveLength(0);
    expect(container.querySelector(".decision-screen__prompt")).toBeNull();
    expect(screen.getByLabelText("Career status")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(999));
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText("Success")).toHaveAttribute(
      "data-result",
      "success",
    );
    expect(reservedIndicator).toHaveAttribute("data-visible", "true");
    act(() => vi.advanceTimersByTime(799));
    expect(onRevealOutcome).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onRevealOutcome).toHaveBeenCalledOnce();
  });

  test("holds the completed shot before the outcome with reduced motion", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const onRevealOutcome = vi.fn();
    renderScreen(createAnimatingState(0.8), {
      onRevealOutcome,
      reducedMotion: true,
    });

    expect(screen.getByText("Failure")).toHaveAttribute(
      "data-result",
      "failure",
    );
    expect(document.querySelector(".resolution-screen__impact")).toBeVisible();
    act(() => vi.advanceTimersByTime(1999));

    expect(onRevealOutcome).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));

    expect(onRevealOutcome).toHaveBeenCalledOnce();
    expect(document.querySelector(".resolution-screen")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });

  test("updates the status animations only when the outcome appears", () => {
    vi.useFakeTimers();
    stubReducedMotion(false);
    const state = createAnimatingState(0.2);
    const view = renderScreen(state);

    expect(
      screen.getByRole("progressbar", { name: "Potential: 0 of 100" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Territorial control: Helic 50%, Guylos 50%",
      }),
    ).toBeInTheDocument();
    const outcomeState = { ...state, phase: "outcome" } as const;

    view.rerender(
      <DecisionScreen
        event={event}
        onAbandon={() => undefined}
        onCloseYear={() => undefined}
        onDecision={() => undefined}
        onReducedMotionChange={() => undefined}
        onRevealOutcome={() => undefined}
        reducedMotion={false}
        state={outcomeState}
      />,
    );

    const [firstSide, secondSide] = state.pilot.career.warState.sides;
    expect(
      screen.getByRole("progressbar", {
        name: `Potential: ${state.pilot.potential} of 100`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: `Territorial control: Helic ${firstSide.control}%, Guylos ${secondSide.control}%`,
      }),
    ).toBeInTheDocument();
  });

  test("shows the outcome as terminal output with animated stat bars", () => {
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createRandom(0),
    );
    const state = {
      eventId: event.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result,
      screen: "event",
    } as const satisfies EventGameState;
    renderScreen(state);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Decision · Without risk",
    });
    expect(heading).toHaveFocus();
    expect(document.querySelector(".outcome-screen__result")).toBeNull();
    expect(screen.getByText("Take a basic Zoid")).toHaveClass(
      "outcome-screen__decision",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Battles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Pilot progress" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Career archive // secure transmission"),
    ).toBeInTheDocument();
    expect(screen.getByText("Zoid obtained")).toBeInTheDocument();
    expect(
      screen.getByText("You did not participate in any battles this year."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Helic Republic status")).not.toBeInTheDocument();
    expect(screen.queryByText("Age")).not.toBeInTheDocument();
    expect(screen.queryByText("Rank")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Academy does not assign regular battles/u),
    ).not.toBeInTheDocument();
    const report = document.querySelector(".outcome-screen__report");
    expect(report?.children[0]).toHaveClass("outcome-screen__terminal");
    expect(report?.children[1]).toHaveClass("outcome-screen__stats");
    expect(document.querySelectorAll(".outcome-screen__stat")).toHaveLength(6);
    const pilotingProgress = screen.getByRole("progressbar", {
      name: "Piloting: 7 total",
    });
    expect(pilotingProgress).toHaveStyle({
      "--stat-current": "7%",
      "--stat-previous": "5%",
    });
    const pilotingStat = pilotingProgress.closest<HTMLElement>(
      ".outcome-screen__stat",
    )!;
    expect(within(pilotingStat).getByText("7")).toHaveClass(
      "outcome-screen__stat-total",
    );
    expect(
      screen.getByRole("progressbar", {
        name: "Synchrony: 5 total",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Charisma: 3 total",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You improved significantly as a pilot this year."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue career" }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".decision-screen__prompt")).toHaveLength(
      8,
    );
  });

  test.each([
    [0.2, "Decision · With risk · Success"],
    [0.8, "Decision · With risk · Failure"],
  ] as const)(
    "includes the risk and result in the decision heading",
    (probability, heading) => {
      const animatingState = createAnimatingState(probability);
      renderScreen({ ...animatingState, phase: "outcome" });

      expect(
        screen.getByRole("heading", { level: 1, name: heading }),
      ).toBeInTheDocument();
      expect(document.querySelector(".outcome-screen__result")).toBeNull();
    },
  );

  test("shows an earned achievement and closes the year", () => {
    const mechanicsEvent = eventCatalog.mechanicsProgram;
    const result = resolveYear(
      mechanicsEvent.decisions[0],
      mechanicsEvent,
      pilot,
      createRandom(0),
    );
    const onCloseYear = vi.fn();
    const state = {
      eventId: mechanicsEvent.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result,
      screen: "event",
    } as const satisfies EventGameState;
    renderScreen(state, { event: mechanicsEvent, onCloseYear });

    expect(screen.getByText("Achievement earned")).toBeInTheDocument();
    expect(screen.getByText("Born in the workshop")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue career" }));
    expect(onCloseYear).toHaveBeenCalledOnce();
  });

  test("confirms before abandoning the run", () => {
    const onAbandon = vi.fn();
    renderScreen(
      { ...createAnimatingState(0.2), phase: "outcome" },
      {
        onAbandon,
      },
    );

    const abandonButton = screen.getByRole("button", { name: "Abandon run" });
    expect(abandonButton).toHaveClass("button--secondary");
    fireEvent.click(abandonButton);

    const dialog = screen.getByRole("alertdialog", {
      name: "Abandon this run?",
    });
    const cancel = within(dialog).getByRole("button", {
      name: "Keep playing",
    });
    expect(cancel).toHaveFocus();
    fireEvent.click(cancel);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(onAbandon).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Abandon run" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Abandon run",
      }),
    );
    expect(onAbandon).toHaveBeenCalledOnce();
  });

  test("shows effective stat changes as compact outcome tags", () => {
    const mechanicsEvent = eventCatalog.mechanicsProgram;
    const result = resolveYear(
      mechanicsEvent.decisions[2],
      mechanicsEvent,
      pilot,
      createRandom(0),
    );
    const state = {
      eventId: mechanicsEvent.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result,
      screen: "event",
    } as const satisfies EventGameState;
    const { container } = renderScreen(state, { event: mechanicsEvent });
    const changes = container.querySelector<HTMLElement>(
      ".outcome-screen__terminal-changes",
    )!;

    expect(
      within(changes).getByText("Piloting").closest("li"),
    ).toHaveTextContent("+2Piloting");
    expect(
      within(changes).getByText("Synchrony").closest("li"),
    ).toHaveTextContent("+2Synchrony");
    expect(
      within(changes).getByText("Technique").closest("li"),
    ).toHaveTextContent("+4Technique");
    expect(within(changes).queryByText("Helic Republic status")).toBeNull();
  });

  test("describes participation in the faction battle report", () => {
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createRandom(0),
    );
    const state = {
      eventId: event.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result: {
        ...result,
        battleRecord: {
          assigned: 5,
          available: 20,
          injured: false,
          killed: false,
          losses: 2,
          participated: 5,
          wins: 3,
          zoidDamaged: false,
          zoidDestroyed: false,
        },
      },
      screen: "event",
    } as const satisfies EventGameState;
    renderScreen(state);

    expect(
      screen.getByText(
        "Of 20 battles for the Helic Republic, you participated in 5 and won 3.",
      ),
    ).toBeInTheDocument();
  });

  test.each([
    [51, "Helic Republic gained territory this year.", "minor"],
    [
      30,
      "Guylos Empire expanded its territorial control. Helic Republic is losing ground quickly.",
      "major",
    ],
    [
      19,
      "Critical advance by Guylos Empire. Helic Republic's defenses are near their limit.",
      "critical",
    ],
    [50, "The war remained stale this year.", "stale"],
  ] as const)(
    "reports territorial movement with %s%% Helic control",
    (helicControl, message, urgency) => {
      const result = resolveYear(
        event.decisions[0],
        event,
        pilot,
        createRandom(0),
      );
      const state = {
        eventId: event.id,
        history,
        phase: "outcome",
        pilot: result.pilotAfter,
        result: {
          ...result,
          pilotAfter: {
            ...result.pilotAfter,
            career: {
              ...result.pilotAfter.career,
              warState: createWarState(
                "helic",
                helicControl,
                "guylos",
                100 - helicControl,
              ),
            },
          },
        },
        screen: "event",
      } as const satisfies EventGameState;
      renderScreen(state);

      expect(screen.getByText(message)).toHaveAttribute(
        "data-urgency",
        urgency,
      );
    },
  );

  test.each([
    [
      eventCatalog.firstExercises,
      2,
      "You improved as a pilot, and your training produced results.",
    ],
    [
      eventCatalog.mechanicsProgram,
      2,
      "Your progress was exceptional. You improved tremendously as a pilot.",
    ],
    [eventCatalog.veteranOffer, 0, "You barely improved as a pilot this year."],
  ] as const)(
    "summarizes the pilot growth from the net stat change",
    (growthEvent, decisionIndex, message) => {
      const result = resolveYear(
        growthEvent.decisions[decisionIndex],
        growthEvent,
        pilot,
        createRandom(0),
      );
      const state = {
        eventId: growthEvent.id,
        history,
        phase: "outcome",
        pilot: result.pilotAfter,
        result,
        screen: "event",
      } as const satisfies EventGameState;
      renderScreen(state, { event: growthEvent });

      expect(screen.getByText(message)).toBeInTheDocument();
    },
  );

  test("shows every Zoid reward inside the terminal only when present", () => {
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createRandom(0),
    );
    const state = {
      eventId: event.id,
      history,
      phase: "outcome",
      pilot: result.pilotAfter,
      result: {
        ...result,
        zoidIds: ["zoid:godos", "zoid:guysack"],
      },
      screen: "event",
    } as const satisfies EventGameState;
    const view = renderScreen(state);

    expect(screen.getAllByText("Zoid obtained")).toHaveLength(2);
    expect(screen.getByText("Godos")).toBeInTheDocument();
    expect(screen.getByText("Guysack")).toBeInTheDocument();

    view.rerender(
      <DecisionScreen
        event={event}
        onAbandon={() => undefined}
        onCloseYear={() => undefined}
        onDecision={() => undefined}
        onReducedMotionChange={() => undefined}
        onRevealOutcome={() => undefined}
        reducedMotion={false}
        state={{
          ...state,
          result: { ...result, zoidIds: [] },
        }}
      />,
    );
    expect(screen.queryByText("Zoid obtained")).not.toBeInTheDocument();
  });
});

interface RenderOverrides {
  event?: DecisionEvent;
  onAbandon?: () => void;
  onCloseYear?: () => void;
  onDecision?: (decision: Decision) => void;
  onReducedMotionChange?: (reducedMotion: boolean) => void;
  onRevealOutcome?: () => void;
  reducedMotion?: boolean;
}

function renderScreen(state: EventGameState, overrides: RenderOverrides = {}) {
  return render(
    <DecisionScreen
      event={overrides.event ?? event}
      onAbandon={overrides.onAbandon ?? (() => undefined)}
      onCloseYear={overrides.onCloseYear ?? (() => undefined)}
      onDecision={overrides.onDecision ?? (() => undefined)}
      onReducedMotionChange={
        overrides.onReducedMotionChange ?? (() => undefined)
      }
      onRevealOutcome={overrides.onRevealOutcome ?? (() => undefined)}
      reducedMotion={overrides.reducedMotion ?? false}
      state={state}
    />,
  );
}

function createAnimatingState(probability: number): AnimatingEventGameState {
  const result = resolveYear(
    event.decisions[1],
    event,
    pilot,
    createRandom(probability),
  );

  if (result.resolution.kind !== "chance") {
    throw new TypeError("The test decision must use chance.");
  }

  return {
    eventId: event.id,
    history,
    phase: "animating",
    pilot: result.pilotAfter,
    result: { ...result, resolution: result.resolution },
    screen: "event",
  };
}

function createRandom(probability: number): RandomGenerator {
  return {
    chance: vi.fn(() => false),
    integer: vi.fn((min) => min),
    probability: vi.fn(() => probability),
    weighted: vi.fn((entries) => entries[0].value),
  };
}

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches })),
  );
}
