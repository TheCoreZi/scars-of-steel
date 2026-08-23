import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { FinalScreen } from "../app/FinalScreen";
import { createFinalCardBlob } from "../app/finalCard";
import {
  advanceCareerYear,
  createCareerHistory,
  recordResolvedYear,
} from "../domain/career";
import { eventCatalog } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import { createSeededRandomGenerator } from "../domain/random";
import type { FinalGameState } from "../domain/types";
import { resolveYear } from "../domain/year";
import { i18n } from "../i18n";

vi.mock("../app/finalCard", () => ({
  createFinalCardBlob: vi.fn(
    async () => new Blob(["png"], { type: "image/png" }),
  ),
}));

const event = eventCatalog.mechanicsProgram;
const initialPilot = createInitialPilot({
  aspiration: "commander",
  faction: "helic",
  id: "pilot:final-screen",
  name: "Lena Steel",
});
const result = resolveYear(
  event.decisions[0],
  event,
  initialPilot,
  createSeededRandomGenerator(4),
);

if (!result.pilotAfter.zoids) {
  throw new TypeError("The final screen fixture requires a signature Zoid.");
}

const state = {
  endReason: "no-eligible-events",
  history: recordResolvedYear(createCareerHistory(), event.id, result),
  nicknameId: "nickname:guardian",
  pilot: advanceCareerYear(result.pilotAfter),
  screen: "final",
  titleId: "title:false-promise",
} as const satisfies FinalGameState;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  void i18n.changeLanguage("en");
});

describe("final screen", () => {
  test("shows the complete localized final summary", async () => {
    await i18n.changeLanguage("es");
    render(<FinalScreen onRestart={() => undefined} state={state} />);

    expect(
      screen.getByRole("heading", { name: "Promesa falsa" }),
    ).toHaveFocus();
    expect(
      screen.getByText(
        "Luchaste durante 1 año. Tu carrera terminó a los 13 años.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Nacido en el taller")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Entraste al programa mecánico y aprendiste a comprender cada máquina desde dentro.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Récord de batallas")).toBeInTheDocument();
    expect(screen.getByText("Fama")).toBeInTheDocument();
    expect(screen.getByText("Confianza de la facción")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Lena Steel “El Guardián” de la República llegó con potencial, pero esta vida quizá no era para ti.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Stats finales")).toBeInTheDocument();
    expect(
      document.querySelectorAll('.final-screen__stats [role="progressbar"]'),
    ).toHaveLength(6);
    expect(
      document.querySelectorAll(".final-screen__achievement-icon"),
    ).toHaveLength(1);
    expect(document.querySelector(".final-screen__title-icon")).toHaveAttribute(
      "data-icon-path",
      "/images/icons/titles/false-promise.png",
    );
    expect(
      document.querySelectorAll(".final-screen__spotlights span"),
    ).toHaveLength(3);
    const rank = document.querySelector(".final-screen__rank");
    expect(rank?.firstElementChild).toHaveClass("rank-insignia");
    expect(rank?.lastElementChild).toHaveTextContent("Cadete");
    expect(rank).not.toHaveClass("final-screen__zoid-label");
    expect(screen.getByText("Cadete")).not.toHaveClass("sr-only");
  });

  test("shows that the career ended without a Zoid", () => {
    const stateWithoutZoid = {
      ...state,
      pilot: { ...state.pilot, zoids: null },
    } satisfies FinalGameState;

    render(
      <FinalScreen onRestart={() => undefined} state={stateWithoutZoid} />,
    );

    expect(screen.getByText("Career ended without a Zoid")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  test("uses a distinct icon for each achievement", () => {
    const stateWithEveryAchievement = {
      ...state,
      history: {
        ...state.history,
        achievementIds: [
          "achievement:born-in-workshop",
          "achievement:not-on-my-watch",
          "achievement:true-soldier",
        ],
      },
    } satisfies FinalGameState;

    render(
      <FinalScreen
        onRestart={() => undefined}
        state={stateWithEveryAchievement}
      />,
    );

    expect(
      [
        ...document.querySelectorAll(
          ".final-screen__achievements .final-screen__achievement-icon",
        ),
      ].map((icon) => icon.getAttribute("data-icon-path")),
    ).toEqual([
      "/images/icons/achievements/wrench.svg",
      "/images/icons/achievements/gavel.svg",
      "/images/icons/achievements/heart.svg",
    ]);
  });

  test("downloads a PNG with a safe pilot filename", async () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    const createObjectURL = vi.fn(() => "blob:final-card");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    render(<FinalScreen onRestart={() => undefined} state={state} />);

    fireEvent.click(screen.getByRole("button", { name: "Download PNG" }));

    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(createFinalCardBlob).toHaveBeenCalledWith(
      expect.objectContaining({
        ageLabel: "You fought for 1 year. Your career ended at age 13.",
        battleLosses: state.history.battles.losses,
        battleWins: state.history.battles.wins,
        pilotName: "Lena Steel",
        titleDescription:
          "Lena Steel “The Guardian” of the Republic arrived with potential, but perhaps this life was not for you.",
        titleName: "False promise",
      }),
    );
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:final-card");
  });

  test("shares the PNG when file sharing is supported", async () => {
    const share = vi
      .fn<(data: ShareData) => Promise<void>>()
      .mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      canShare: vi.fn(() => true),
      share,
    });
    render(<FinalScreen onRestart={() => undefined} state={state} />);

    const shareButton = screen.getByRole("button", { name: "Share" });
    expect(shareButton).toHaveClass("final-screen__export");
    fireEvent.click(shareButton);

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    expect(share.mock.calls[0][0]).toMatchObject({
      files: [expect.any(File)],
      title: "False promise",
    });
  });

  test("keeps download and hides share when Web Share is unavailable", () => {
    render(<FinalScreen onRestart={() => undefined} state={state} />);

    expect(screen.getByRole("button", { name: "Download PNG" })).toHaveClass(
      "final-screen__export",
    );
    expect(screen.queryByRole("button", { name: "Share" })).toBeNull();
    expect(screen.getByRole("button", { name: "New run" })).toHaveClass(
      "final-screen__restart",
    );
    expect(screen.getByRole("button", { name: "New run" })).not.toHaveClass(
      "final-screen__export",
    );
  });

  test("ignores share cancellation and reports other share failures", async () => {
    const share = vi
      .fn()
      .mockRejectedValueOnce(new DOMException("Canceled", "AbortError"))
      .mockRejectedValueOnce(new TypeError("Share failed"));
    vi.stubGlobal("navigator", {
      ...navigator,
      canShare: vi.fn(() => true),
      share,
    });
    render(<FinalScreen onRestart={() => undefined} state={state} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "The image could not be shared",
      ),
    );
  });

  test("starts a new run from the final screen", () => {
    const onRestart = vi.fn();
    render(<FinalScreen onRestart={onRestart} state={state} />);

    fireEvent.click(screen.getByRole("button", { name: "New run" }));

    expect(onRestart).toHaveBeenCalledOnce();
  });
});
