import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { App } from "../app/App";
import { colorModeStorageKey } from "../app/colorModeStorage";
import { PilotCreationScreen } from "../app/PilotCreationScreen";
import { WelcomeScreen } from "../app/WelcomeScreen";
import type { CompletedGame } from "../app/gameStorage";
import { createCareerHistory } from "../domain/career";
import { createInitialPilot } from "../domain/pilot";
import { createBoundedValue, type PilotDraft } from "../domain/types";
import { i18n } from "../i18n";

const completedPilot = createInitialPilot({
  aspiration: "commander",
  faction: "helic",
  id: "pilot:lena",
  name: "Lena Steel",
});
const completedGame = {
  state: {
    endReason: "no-eligible-events",
    history: createCareerHistory(),
    nicknameId: "nickname:guardian",
    pilot: {
      ...completedPilot,
      career: {
        ...completedPilot.career,
        fame: createBoundedValue(62),
        militaryRank: "captain",
      },
      potential: createBoundedValue(74),
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:command-wolf",
      },
    },
    screen: "final",
    titleId: "title:false-promise",
  },
} as const satisfies CompletedGame;

afterEach(() => {
  cleanup();
  document.documentElement.lang = "en";
  window.localStorage.clear();
  void i18n.changeLanguage("en");
});

describe("welcome screen", () => {
  test("shows the localized career scope", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { name: "Scars of Steel" });
    expect(heading).toBeInTheDocument();
    expect(heading.closest(".app-shell")).toHaveAttribute(
      "data-color-mode",
      "dark",
    );
    expect(
      screen.getByText(
        "On planet Zi, beyond the Milky Way, steel Zoids possess outstanding combat capabilities.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "In this world, every soldier starts at the bottom and makes the decisions that will forge their path to the top. This is your story.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Become a legend or fade into obscurity."),
    ).toBeInTheDocument();
    expect(screen.getByText("2").nextElementSibling).toHaveTextContent(
      "factions",
    );
    expect(screen.getByText("5").nextElementSibling).toHaveTextContent(
      "decisions",
    );
    expect(screen.getByText("21").nextElementSibling).toHaveTextContent(
      "possible paths",
    );
    expect(screen.getByText("1").nextElementSibling).toHaveTextContent(
      "war to decide",
    );
  });

  test("shows Spanish content", async () => {
    await i18n.changeLanguage("es");

    render(
      <WelcomeScreen
        completedGames={[]}
        onReducedMotionChange={() => undefined}
        onSelectGame={() => undefined}
        onStart={() => undefined}
        reducedMotion={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Cicatrices de Acero" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "En el planeta Zi, más allá de la Vía Láctea, existen Zoids de acero con destacada capacidad de combate.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "En este mundo, cada soldado comienza desde abajo y toma las decisiones que forjarán su camino hasta la cima. Esta es tu historia.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conviértete en leyenda o queda en el olvido."),
    ).toBeInTheDocument();
    expect(screen.getByText("guerra por decidir")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Inicia tu carrera" }),
    ).toBeInTheDocument();
  });

  test("shows compact service records without visible Zoid names", () => {
    const onSelectGame = vi.fn();
    render(
      <WelcomeScreen
        completedGames={[completedGame]}
        onReducedMotionChange={() => undefined}
        onSelectGame={onSelectGame}
        onStart={() => undefined}
        reducedMotion={false}
      />,
    );

    const record = screen.getByText("Lena Steel").closest("li");
    expect(record).not.toBeNull();
    expect(within(record!).getByText("Captain")).toBeInTheDocument();
    expect(
      within(record!).getByLabelText("Captain").querySelector("img"),
    ).toHaveAttribute("src", "/images/ranks/captain.png");
    expect(within(record!).getByText("Command Wolf")).toBeInTheDocument();
    const zoid = within(record!).getByLabelText("Zoid: Command Wolf");
    expect(zoid).toHaveClass("service-records__zoid");
    expect(zoid.querySelector("img")).toHaveAttribute(
      "src",
      "/images/zoids/command_wolf.png",
    );
    expect(
      within(record!).getByLabelText("False promise").querySelector("img"),
    ).toHaveAttribute("src", "/images/icons/titles/false-promise.png");
    expect(
      within(record!).getByLabelText("Potential: 74 of 100"),
    ).toHaveTextContent("⚡74");
    expect(within(record!).getByLabelText("Fame: 62 of 100")).toHaveTextContent(
      "★62",
    );
    const row = within(record!).getByRole("button", {
      name: "Open final card for Lena Steel",
    });
    expect(row).toHaveAttribute("data-faction", "helic");
    fireEvent.click(row);
    expect(onSelectGame).toHaveBeenCalledWith(completedGame);
    expect(
      screen
        .getByRole("button", { name: "Begin your career" })
        .compareDocumentPosition(screen.getByText("Service records")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("starts the flow only once", () => {
    const onStart = vi.fn();

    render(
      <WelcomeScreen
        completedGames={[]}
        onReducedMotionChange={() => undefined}
        onSelectGame={() => undefined}
        onStart={onStart}
        reducedMotion={false}
      />,
    );

    const button = screen.getByRole("button", { name: "Begin your career" });
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.click(button);
    fireEvent.click(button);

    expect(onStart).toHaveBeenCalledOnce();
    expect(button).toBeDisabled();
  });

  test("moves focus to pilot creation after starting", async () => {
    render(<App />);

    const heading = await startPilotCreation();
    expect(heading).toBeInTheDocument();
    await waitFor(() => expect(heading).toHaveFocus());
    expect(document.querySelector(".welcome__damage")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Light mode" }),
    ).toBeInTheDocument();
  });
});

describe("pilot creation", () => {
  test("shows the pilot configuration in Spanish", async () => {
    await i18n.changeLanguage("es");

    render(<PilotCreationTestScreen onConfirm={() => undefined} />);

    expect(
      screen.getByRole("heading", { name: "Solicitud de alistamiento" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Nombre del recluta" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Nación" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar solicitud" }),
    ).toBeInTheDocument();
  });

  test("requires a non-empty name, faction, and aspiration", async () => {
    render(<App />);
    await startPilotCreation();

    expect(screen.getByText("Assessment pending")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your initial aptitude profile will appear in this section.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("progressbar")).toHaveLength(0);
    expect(
      screen.getByText(
        "Aspires to command units, rise through the ranks, and shape the course of the war.",
      ),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".pilot-option__icon")).toHaveLength(4);

    const guylosOption = screen.getByRole("radio", {
      name: "Guylos Empire",
    });
    const helicOption = screen.getByRole("radio", {
      name: "Helic Republic",
    });
    expect(
      guylosOption.nextElementSibling?.querySelector("img"),
    ).toHaveAttribute("src", "/images/factions/guylos.png");
    expect(
      helicOption.nextElementSibling?.querySelector("img"),
    ).toHaveAttribute("src", "/images/factions/helic.png");

    const confirmButton = screen.getByRole("button", {
      name: "Submit enlistment",
    });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "   " },
    });
    fireEvent.click(guylosOption);
    fireEvent.click(screen.getByRole("radio", { name: "Commander" }));
    expect(confirmButton).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });
    expect(confirmButton).toBeEnabled();
  });

  test.each([
    [
      "Commander",
      {
        Charisma: 5,
        Piloting: 2,
        Strength: 3,
        Synchrony: 3,
        Tactics: 4,
        Technique: 3,
      },
    ],
    [
      "Shadow",
      {
        Charisma: 2,
        Piloting: 4,
        Strength: 3,
        Synchrony: 3,
        Tactics: 5,
        Technique: 3,
      },
    ],
    [
      "War hero",
      {
        Charisma: 3,
        Piloting: 5,
        Strength: 4,
        Synchrony: 2,
        Tactics: 3,
        Technique: 3,
      },
    ],
    [
      "Zoid Ace",
      {
        Charisma: 3,
        Piloting: 3,
        Strength: 2,
        Synchrony: 5,
        Tactics: 3,
        Technique: 4,
      },
    ],
  ])("previews the %s stats", (aspiration, expectedStats) => {
    render(<PilotCreationTestScreen onConfirm={() => undefined} />);

    const aspirationOption = screen.getByRole("radio", { name: aspiration });
    fireEvent.click(aspirationOption);

    expect(aspirationOption).toBeChecked();

    for (const [stat, value] of Object.entries(expectedStats)) {
      expect(screen.getByRole("progressbar", { name: stat })).toHaveAttribute(
        "aria-valuemax",
        "5",
      );
      expect(screen.getByRole("progressbar", { name: stat })).toHaveAttribute(
        "aria-valuenow",
        String(value),
      );
    }
  });

  test.each([
    ["Guylos Empire", "guylos"],
    ["Helic Republic", "helic"],
  ])("applies the %s faction theme", async (faction, theme) => {
    render(<App />);
    await startPilotCreation();

    const option = screen.getByRole("radio", { name: faction });
    option.focus();
    expect(option).toHaveFocus();
    fireEvent.click(option);

    expect(option).toBeChecked();
    const [otherOption] = screen
      .getAllByRole("radio")
      .filter(
        (radio) => radio.getAttribute("name") === "faction" && radio !== option,
      );
    expect(otherOption).not.toBeChecked();
    expect(
      screen
        .getByRole("heading", { name: "Cadet enlistment form" })
        .closest(".app-shell"),
    ).toHaveAttribute("data-faction", theme);
  });

  test("submits a complete configuration only once", () => {
    const onConfirm = vi.fn();
    render(<PilotCreationTestScreen onConfirm={onConfirm} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "  Le\u0301na  Steel  " },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "Zoid Ace" }));

    const form = screen
      .getByRole("button", { name: "Submit enlistment" })
      .closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledWith({
      aspiration: "zoid-ace",
      faction: "helic",
      name: "  Le\u0301na  Steel  ",
    });
  });

  test("creates the pilot and opens the initial event", async () => {
    render(<App />);
    await startPilotCreation();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "  Le\u0301na  Steel  " },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "Zoid Ace" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    await screen.findByText("Choose your response");
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveFocus();
    expect(screen.getByText("Choose your response")).toBeInTheDocument();
    expect(document.querySelectorAll(".decision-option")).toHaveLength(3);
    expect(screen.getByLabelText("Career status")).toBeInTheDocument();
    expect(screen.queryByText("Zoid unassigned")).not.toBeInTheDocument();
    expect(screen.getByText("Zoid")).toBeInTheDocument();
    expect(heading.closest(".app-shell")).toHaveAttribute(
      "data-faction",
      "helic",
    );
    expect(document.querySelector(".welcome__damage")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Light mode" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/choose.*zoid/iu)).not.toBeInTheDocument();
  });

  test("resolves a safe initial decision once and opens its outcome", async () => {
    const firstRender = render(<App />);
    await startPilotCreation();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "War hero" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    await screen.findByText("Choose your response");
    const decision = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".decision-option"),
    ).find((option) => option.ariaLabel?.includes(". Safe."));
    expect(decision).not.toBeNull();
    fireEvent.click(decision!);
    fireEvent.click(decision!);

    await waitFor(() => {
      expect(document.querySelectorAll(".decision-option")).toHaveLength(0);
      expect(document.querySelector(".decision-screen__choices")).toBeNull();
    });
    expect(document.querySelectorAll(".decision-screen__prompt")).toHaveLength(
      8,
    );
    await waitFor(() =>
      expect(document.querySelector(".outcome-screen h1")).toHaveFocus(),
    );
    expect(screen.getByLabelText("Career status")).toBeInTheDocument();

    const outcome = screen.getByRole("heading", { level: 1 }).textContent;
    firstRender.unmount();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      outcome!,
    );
    expect(
      screen.getByRole("button", { name: "Continue career" }),
    ).toBeInTheDocument();
  });

  test("restores the exact resolved chance roll", async () => {
    const firstRender = render(<App />);
    await startPilotCreation();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "War hero" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    await screen.findByText("Choose your response");
    const chanceDecision = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".decision-option"),
    ).find((option) => option.ariaLabel?.includes(". With risk."));
    fireEvent.click(chanceDecision!);

    const firstStatus = await screen.findByRole("status");
    const firstTarget = await screen.findByRole("img", {
      name: /Resolution target/u,
    });
    const result = firstStatus.dataset.result;
    const style = firstTarget.getAttribute("style");
    firstRender.unmount();
    render(<App />);

    expect(await screen.findByRole("status")).toHaveAttribute(
      "data-result",
      result,
    );
    expect(
      await screen.findByRole("img", { name: /Resolution target/u }),
    ).toHaveAttribute("style", style);
  });

  test("restores pilot creation after remounting", async () => {
    const firstRender = render(<App />);
    expect(await startPilotCreation()).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });

    firstRender.unmount();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Cadet enlistment form" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Recruit name" })).toHaveValue(
      "Lena",
    );
  });

  test("abandons an active run after confirmation", async () => {
    const firstRender = render(<App />);
    await startPilotCreation();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "War hero" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    await screen.findByText("Choose your response");
    const safeDecision = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".decision-option"),
    ).find((option) => option.ariaLabel?.includes(". Safe."));
    fireEvent.click(safeDecision!);
    fireEvent.click(await screen.findByRole("button", { name: "Abandon run" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Abandon run",
      }),
    );

    expect(
      await screen.findByRole("button", { name: "Begin your career" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Service records" }),
    ).toBeNull();

    firstRender.unmount();
    render(<App />);
    expect(
      screen.getByRole("button", { name: "Begin your career" }),
    ).toBeInTheDocument();
  });

  test("ends the run when the next event pool is empty", async () => {
    render(<App />);
    await startPilotCreation();
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "Lena" },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "War hero" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    await screen.findByText("Choose your response");
    const safeDecision = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".decision-option"),
    ).find((option) => option.ariaLabel?.includes(". Safe."));
    expect(safeDecision).toBeDefined();
    fireEvent.click(safeDecision!);
    fireEvent.click(
      await screen.findByRole("button", { name: "Continue career" }),
    );

    expect(
      await screen.findByRole("heading", { name: "False promise" }),
    ).toHaveFocus();
    expect(
      screen.getByText("You fought for 1 year. Your career ended at age 13."),
    ).toBeInTheDocument();
    expect(screen.getByText("Signature Zoid")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download PNG" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "New run" })).toBeInTheDocument();
    cleanup();
    render(<App />);

    expect(
      await screen.findByRole("button", { name: "Begin your career" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Service records" }),
    ).toBeInTheDocument();
    const record = screen.getByText("Lena").closest("li");
    expect(record).not.toBeNull();
    expect(within(record!).getByLabelText("Cadet")).toBeInTheDocument();
    expect(within(record!).getByLabelText(/Potential:/u)).toBeInTheDocument();
    expect(within(record!).getByLabelText(/Fame:/u)).toBeInTheDocument();
    fireEvent.click(within(record!).getByRole("button"));
    expect(
      await screen.findByRole("heading", { name: "False promise" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main").closest(".app-shell")).toHaveAttribute(
      "data-faction",
      "helic",
    );
  });
});

async function startPilotCreation() {
  fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));

  return screen.findByRole("heading", { name: "Cadet enlistment form" });
}

test("changes between dark and light modes", () => {
  render(<App />);

  const colorModeSwitch = screen.getByRole("switch", { name: "Light mode" });
  expect(colorModeSwitch).not.toBeChecked();
  fireEvent.click(colorModeSwitch);

  const app = screen
    .getByRole("heading", { name: "Scars of Steel" })
    .closest(".app-shell");
  expect(colorModeSwitch).toBeChecked();
  expect(app).toHaveAttribute("data-color-mode", "light");
  expect(window.localStorage.getItem(colorModeStorageKey)).toBe("light");
});

test("loads the saved color mode", () => {
  window.localStorage.setItem(colorModeStorageKey, "light");

  render(<App />);

  expect(screen.getByRole("switch", { name: "Light mode" })).toBeChecked();
  expect(
    screen
      .getByRole("heading", { name: "Scars of Steel" })
      .closest(".app-shell"),
  ).toHaveAttribute("data-color-mode", "light");
});

test("turns animations on and off", () => {
  render(<App />);

  const animationSwitch = screen.getByRole("switch", {
    name: "Animations ON",
  });
  const app = screen
    .getByRole("heading", { name: "Scars of Steel" })
    .closest(".app-shell");

  expect(animationSwitch).toBeChecked();
  expect(animationSwitch.parentElement).toHaveClass("welcome__panel");
  expect(
    animationSwitch.querySelector(".animation-toggle__icon"),
  ).toBeInTheDocument();
  expect(app).not.toHaveAttribute("data-reduced-motion");

  fireEvent.click(animationSwitch);

  expect(animationSwitch).not.toBeChecked();
  expect(animationSwitch).toHaveAccessibleName("Animations OFF");
  expect(app).toHaveAttribute("data-reduced-motion", "true");
});

test("changes the interface language", async () => {
  render(<App />);

  const languageSelector = screen.getByRole("group", { name: "Language" });
  const englishButton = screen.getByRole("button", { name: "English" });
  expect(languageSelector).toBeInTheDocument();
  expect(englishButton).toHaveAttribute("aria-pressed", "true");

  fireEvent.click(screen.getByRole("button", { name: "Spanish" }));

  expect(
    await screen.findByRole("heading", { name: "Cicatrices de Acero" }),
  ).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute("lang", "es");
});

interface PilotCreationTestScreenProps {
  onConfirm: React.ComponentProps<typeof PilotCreationScreen>["onConfirm"];
}

function PilotCreationTestScreen({ onConfirm }: PilotCreationTestScreenProps) {
  const [draft, setDraft] = useState<PilotDraft>({
    aspiration: null,
    faction: null,
    name: "",
  });

  return (
    <PilotCreationScreen
      draft={draft}
      onConfirm={onConfirm}
      onDraftChange={setDraft}
      onReducedMotionChange={() => undefined}
      reducedMotion={false}
    />
  );
}
