import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { App } from "../app/App";
import { PilotCreationScreen } from "../app/PilotCreationScreen";
import { WelcomeScreen } from "../app/WelcomeScreen";
import { i18n } from "../i18n";

afterEach(() => {
  cleanup();
  document.documentElement.lang = "en";
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

    render(<WelcomeScreen onStart={() => undefined} />);

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

  test("starts the flow only once", () => {
    const onStart = vi.fn();

    render(<WelcomeScreen onStart={onStart} />);

    const button = screen.getByRole("button", { name: "Begin your career" });
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.click(button);
    fireEvent.click(button);

    expect(onStart).toHaveBeenCalledOnce();
    expect(button).toBeDisabled();
  });

  test("moves focus to pilot creation after starting", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));

    const heading = screen.getByRole("heading", {
      name: "Cadet enlistment form",
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveFocus();
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

    render(
      <PilotCreationScreen
        onConfirm={() => undefined}
        onFactionChange={() => undefined}
      />,
    );

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

  test("requires a non-empty name, faction, and aspiration", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));

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
    render(
      <PilotCreationScreen
        onConfirm={() => undefined}
        onFactionChange={() => undefined}
      />,
    );

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
  ])("applies the %s faction theme", (faction, theme) => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));

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
    render(
      <PilotCreationScreen
        onConfirm={onConfirm}
        onFactionChange={() => undefined}
      />,
    );

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

  test("creates the pilot and opens the initial Academy event", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Recruit name" }), {
      target: { value: "  Le\u0301na  Steel  " },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Helic Republic" }));
    fireEvent.click(screen.getByRole("radio", { name: "Zoid Ace" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit enlistment" }));

    const heading = screen.getByRole("heading", {
      name: "Your first assignment",
    });
    expect(heading).toHaveFocus();
    expect(
      screen.getByText("Cadet Léna Steel, report for your first exercises."),
    ).toBeInTheDocument();
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

  test("starts again at the welcome screen after remounting", () => {
    const firstRender = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));
    expect(
      screen.getByRole("heading", { name: "Cadet enlistment form" }),
    ).toBeInTheDocument();

    firstRender.unmount();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Scars of Steel" }),
    ).toBeInTheDocument();
  });
});

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
