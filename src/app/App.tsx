import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { PilotCreationGameState, WelcomeGameState } from "../domain/types";
import { Badge, Panel } from "./UiPrimitives";
import { WelcomeScreen } from "./WelcomeScreen";

type ColorMode = "dark" | "light";
type IntroGameState = PilotCreationGameState | WelcomeGameState;

export function App() {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [gameState, setGameState] = useState<IntroGameState>({
    screen: "welcome",
  });
  function startGame() {
    setGameState((currentState) =>
      currentState.screen === "welcome"
        ? {
            draft: {
              aspiration: null,
              faction: null,
              name: "",
            },
            screen: "pilot-creation",
          }
        : currentState,
    );
  }

  return (
    <div
      className="app-shell"
      data-color-mode={colorMode}
      data-faction="neutral"
    >
      {gameState.screen === "welcome" ? (
        <WelcomeScreen
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          onStart={startGame}
        />
      ) : (
        <PilotCreationStart />
      )}
    </div>
  );
}

function PilotCreationStart() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const { t } = useTranslation("interface");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="screen screen--centered">
      <Panel className="pilot-start" labelledBy={titleId}>
        <Badge>{t("pilotCreation.badge")}</Badge>
        <h1 id={titleId} ref={headingRef} tabIndex={-1}>
          {t("pilotCreation.title")}
        </h1>
        <p>{t("pilotCreation.description")}</p>
      </Panel>
    </main>
  );
}
