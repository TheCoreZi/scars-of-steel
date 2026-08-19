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
import { eventCatalog } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import type { SafeDecisionResolution } from "../domain/types";
import { i18n } from "../i18n";

const event = eventCatalog.firstExercises;
const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:decision-screen",
  name: "Lena",
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  void i18n.changeLanguage("en");
});

describe("general decision screen", () => {
  test("types the incoming transmission", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    const { container } = render(
      <DecisionScreen
        event={event}
        onDecision={() => undefined}
        pilot={pilot}
      />,
    );
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
    render(
      <DecisionScreen
        event={event}
        onDecision={() => undefined}
        pilot={pilot}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(document.querySelector(".decision-option__number")).toBeNull();
    expect(
      screen.getByText("War command // secure transmission"),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("heading", { level: 1 })
        .closest(".decision-screen__terminal-line"),
    ).toBeInTheDocument();
    const chanceButton = screen.getByRole("button", {
      name: /Take the rare Zoid/u,
    });
    expect(
      within(chanceButton).getByRole("img", {
        name: "Success 56%, failure 44%",
      }),
    ).toHaveStyle("--success-percent: 56%");
    expect(screen.queryByText("Success 56%")).not.toBeInTheDocument();
    expect(screen.queryByText("Failure 44%")).not.toBeInTheDocument();
  });

  test("keeps safe and chance explanations inside their decisions", () => {
    const { container } = render(
      <DecisionScreen
        event={event}
        onDecision={() => undefined}
        pilot={pilot}
      />,
    );

    const safeButton = screen.getByRole("button", {
      name: /Take a basic Zoid/u,
    });
    expect(within(safeButton).getByText("Safe")).toBeInTheDocument();
    expect(within(safeButton).queryByRole("img")).not.toBeInTheDocument();

    const chanceButton = screen.getByRole("button", {
      name: /Take the rare Zoid/u,
    });
    expect(within(chanceButton).getByText("With risk")).toBeInTheDocument();
    expect(
      within(chanceButton).getByRole("img", {
        name: "Success 56%, failure 44%",
      }),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        ".decision-screen__panel > .decision-probability",
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        ".decision-screen__panel > .career-status:first-child",
      ),
    ).toBeInTheDocument();
  });

  test("reports a choice and locks the other options", () => {
    const onDecision = vi.fn();
    const selectedDecision = event.decisions[0];
    const resolution = {
      decisionId: selectedDecision.id,
      kind: "safe",
      outcomeId: selectedDecision.outcome.id,
    } satisfies SafeDecisionResolution;
    const { rerender } = render(
      <DecisionScreen event={event} onDecision={onDecision} pilot={pilot} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Take a basic Zoid/u }));
    expect(onDecision).toHaveBeenCalledOnce();

    rerender(
      <DecisionScreen
        event={event}
        onDecision={onDecision}
        pilot={pilot}
        resolution={resolution}
      />,
    );

    const selectedButton = screen.getByRole("button", {
      name: /Take a basic Zoid/u,
    });
    expect(selectedButton).toBeEnabled();
    expect(selectedButton).toHaveAttribute("aria-pressed", "true");
    for (const button of screen
      .getAllByRole("button")
      .filter((option) => option !== selectedButton)) {
      expect(button).toBeDisabled();
    }
    expect(
      screen.getByText(
        "Decision confirmed: Take a basic Zoid. The other options are locked.",
      ),
    ).toBeInTheDocument();
  });

  test("localizes the reusable interface in Spanish", async () => {
    await i18n.changeLanguage("es");

    render(
      <DecisionScreen
        event={event}
        onDecision={() => undefined}
        pilot={pilot}
      />,
    );

    expect(screen.getByText("Elige tu respuesta")).toBeInTheDocument();
    expect(
      screen.getByText("Comando de guerra // transmisión segura"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tomar un Zoid básico/u }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tomar el Zoid raro/u }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Solicitar otro Zoid/u }),
    ).toBeInTheDocument();
    expect(screen.getByText("Son la base del ejército.")).toBeInTheDocument();
    expect(
      screen.getByText("Estás seguro de poder dominarlo."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ninguno encaja con tu estilo."),
    ).toBeInTheDocument();
  });
});
