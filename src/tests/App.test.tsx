import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { App } from "../app/App";
import { WelcomeScreen } from "../app/WelcomeScreen";
import { i18n } from "../i18n";

const defaultColorMode = "dark";

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

    render(
      <WelcomeScreen
        colorMode={defaultColorMode}
        onColorModeChange={() => undefined}
        onStart={() => undefined}
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

  test("starts the flow only once", () => {
    const onStart = vi.fn();

    render(
      <WelcomeScreen
        colorMode={defaultColorMode}
        onColorModeChange={() => undefined}
        onStart={onStart}
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

  test("moves focus to pilot creation after starting", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Begin your career" }));

    const heading = screen.getByRole("heading", {
      name: "Your career begins now",
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveFocus();
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
