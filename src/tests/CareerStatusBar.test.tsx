import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import { CareerStatusBar } from "../app/CareerStatusBar";
import { createInitialPilot } from "../domain/pilot";
import { createWarState, type PilotWithZoid } from "../domain/types";

const pilot = createInitialPilot({
  aspiration: "zoid-ace",
  faction: "helic",
  id: "pilot:status-bar",
  name: "Lena",
});

afterEach(cleanup);

describe("career status bar", () => {
  test("shows the initial state without a Zoid", () => {
    const { container, rerender } = render(<CareerStatusBar pilot={pilot} />);
    const desktop = container.querySelector<HTMLElement>(
      ".career-status__desktop",
    );
    expect(desktop).not.toBeNull();

    expect(screen.getByLabelText("Career status")).toBeInTheDocument();
    expect(within(desktop!).getByText("Lena")).toBeInTheDocument();
    expect(within(desktop!).getByText("Academy")).toBeInTheDocument();
    expect(within(desktop!).getByText("Zoid")).toBeInTheDocument();
    expect(
      within(desktop!).queryByText("Zoid unassigned"),
    ).not.toBeInTheDocument();
    expect(
      within(desktop!).getByLabelText("Zoid unassigned"),
    ).toBeInTheDocument();
    expect(
      within(desktop!).getByRole("progressbar", {
        name: "Combat power: 0 of 100",
      }),
    ).toHaveStyle("--power-percent: 0%");
    expect(
      desktop!.querySelector(".career-status__zoid-panel"),
    ).toBeInTheDocument();
    expect(
      desktop!.querySelectorAll(".career-status__war-scale img"),
    ).toHaveLength(2);
    const warTrack = within(desktop!).getByRole("img", {
      name: "Territorial control: Helic 50%, Guylos 50%",
    });
    expect(warTrack).toBeInTheDocument();
    expect(within(desktop!).getByText("War state")).toHaveClass(
      "career-status__war-heading",
    );
    const helicValue = within(desktop!).getByText("Helic", { exact: true });
    expect(helicValue.nextElementSibling).toHaveTextContent("50%");

    rerender(
      <CareerStatusBar
        pilot={{
          ...pilot,
          career: { ...pilot.career, warState: createWarState(60, 40) },
        }}
      />,
    );
    expect(
      within(desktop!).getByRole("img", {
        name: "Territorial control: Helic 60%, Guylos 40%",
      }),
    ).toBeInTheDocument();
  });

  test("shows a signature Zoid sprite when one exists", () => {
    const pilotWithZoid = {
      ...pilot,
      zoids: {
        reserveIds: [],
        signatureId: "zoid:command-wolf",
      },
    } satisfies PilotWithZoid;

    const { container } = render(<CareerStatusBar pilot={pilotWithZoid} />);

    expect(screen.getAllByText("Command Wolf")).toHaveLength(2);
    expect(
      container.querySelector(".career-status__desktop .career-status__zoid"),
    ).toHaveAttribute("src", "/images/zoids/command_wolf.png");
    expect(
      screen.getAllByRole("progressbar", {
        name: "Combat power: 35 of 100",
      }),
    ).toHaveLength(2);
  });

  test("uses the fallback for a Zoid without a sprite", () => {
    const pilotWithZoid = {
      ...pilot,
      zoids: {
        reserveIds: [],
        signatureId: "zoid:arosaurer",
      },
    } satisfies PilotWithZoid;

    const { container } = render(<CareerStatusBar pilot={pilotWithZoid} />);

    expect(screen.getAllByText("Arosaurer")).toHaveLength(2);
    expect(
      container.querySelector(
        ".career-status__desktop .career-status__zoid-fallback",
      ),
    ).toBeInTheDocument();
  });
});
