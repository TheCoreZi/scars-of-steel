import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import { CareerStatusBar } from "../app/CareerStatusBar";
import { createInitialPilot } from "../domain/pilot";
import {
  createBoundedValue,
  createWarState,
  type PilotWithZoid,
} from "../domain/types";

const pilot = createInitialPilot({
  aspiration: "zoid-ace",
  faction: "helic",
  id: "pilot:status-bar",
  name: "Lena",
});
const guylos = "guylos";
const helic = "helic";

afterEach(cleanup);

describe("career status bar", () => {
  test("shows the initial state without a Zoid", () => {
    const { container, rerender } = render(<CareerStatusBar pilot={pilot} />);
    const desktop = container.querySelector<HTMLElement>(
      ".career-status__desktop",
    );
    expect(desktop).not.toBeNull();

    expect(screen.getByLabelText("Career status")).toBeInTheDocument();
    const desktopIdentity = desktop!.querySelector<HTMLElement>(
      ".career-status__pilot",
    )!;
    expect(within(desktopIdentity).getByText("Cadet")).toHaveClass(
      "career-status__rank",
    );
    const pilotHeading = desktopIdentity.querySelector<HTMLElement>(
      ".career-status__pilot-heading",
    )!;
    expect(within(pilotHeading).getByText("Helic")).toBeInTheDocument();
    expect(within(desktopIdentity).getByText("Lena")).toBeInTheDocument();
    expect(
      desktopIdentity.querySelector(".career-status__metadata"),
    ).not.toHaveTextContent("Helic");
    expect(within(desktop!).getByText("Academy")).toBeInTheDocument();
    expect(within(desktop!).getByText("POT")).toHaveClass(
      "career-status__compact-label",
    );
    expect(within(desktop!).getByText("Potential")).toHaveClass(
      "career-status__full-label",
    );
    expect(within(desktop!).getByText("War")).toHaveClass(
      "career-status__compact-label",
    );
    expect(container.querySelector(".career-status__mobile")).toBeNull();
    expect(within(desktop!).getByText("Zoid")).toBeInTheDocument();
    expect(
      within(desktop!).queryByText("Zoid unassigned"),
    ).not.toBeInTheDocument();
    expect(
      within(desktop!).getByLabelText("Zoid unassigned"),
    ).toBeInTheDocument();
    const potential = within(desktop!).getByRole("progressbar", {
      name: "Potential: 0 of 100",
    });
    expect(potential).toHaveAttribute("aria-orientation", "vertical");
    expect(potential).toHaveStyle("--potential-percent: 0%");
    expect(
      screen.getByRole("progressbar", {
        name: "Fame: 0 of 100",
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".career-status__fan")).toHaveLength(0);
    expect(container.querySelector(".career-status__fans")).toHaveAttribute(
      "data-mood",
      "indifferent",
    );
    expect(
      screen.getByText("Fame").closest(".career-status__fans-label"),
    ).toHaveTextContent("Fame");
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
    expect(
      within(desktop!)
        .getByText("War state")
        .closest(".career-status__war-heading"),
    ).toBeInTheDocument();
    const warValues = desktop!.querySelector<HTMLElement>(
      ".career-status__war-values",
    )!;
    const helicValue = within(warValues).getByText("Helic", { exact: true });
    expect(helicValue.nextElementSibling).toHaveTextContent("50%");

    rerender(
      <CareerStatusBar
        pilot={{
          ...pilot,
          career: {
            ...pilot.career,
            fame: createBoundedValue(42),
            warState: createWarState(helic, 60, guylos, 40),
          },
        }}
      />,
    );
    expect(
      within(desktop!).getByRole("img", {
        name: "Territorial control: Helic 60%, Guylos 40%",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Fame: 42 of 100",
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".career-status__fan")).toHaveLength(21);
    expect(
      container.querySelectorAll(".career-status__fan-sprite"),
    ).toHaveLength(21);
    expect(
      container.querySelectorAll('.career-status__fan[data-entering="true"]'),
    ).toHaveLength(21);
    expect(
      container.querySelectorAll('.career-status__fan[data-speaking="true"]'),
    ).toHaveLength(8);

    rerender(
      <CareerStatusBar
        pilot={{
          ...pilot,
          career: { ...pilot.career, fame: createBoundedValue(100) },
        }}
      />,
    );
    expect(container.querySelectorAll(".career-status__fan")).toHaveLength(50);
    expect(
      container.querySelectorAll('.career-status__fan[data-speaking="true"]'),
    ).toHaveLength(50);
    expect(container.querySelector(".career-status__fans")).toHaveAttribute(
      "data-mood",
      "cheering",
    );
  });

  test("shows a special rank instead of the military rank", () => {
    const pilotWithSpecialRank = {
      ...pilot,
      career: { ...pilot.career, specialRank: "leo-master" },
    } as const;
    const { container } = render(
      <CareerStatusBar pilot={pilotWithSpecialRank} />,
    );
    const desktop = container.querySelector<HTMLElement>(
      ".career-status__desktop",
    );

    const identity = desktop!.querySelector<HTMLElement>(
      ".career-status__pilot",
    )!;
    expect(within(identity).getByText("Leo Master")).toHaveClass(
      "career-status__rank",
    );
    expect(within(identity).getByText("Lena")).toBeInTheDocument();
    expect(within(identity).queryByText("Cadet")).not.toBeInTheDocument();
  });

  test("shows a signature Zoid sprite when one exists", () => {
    const pilotWithZoid = {
      ...pilot,
      potential: createBoundedValue(35),
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:command-wolf",
      },
    } satisfies PilotWithZoid;

    const { container } = render(<CareerStatusBar pilot={pilotWithZoid} />);

    expect(screen.getByText("Command Wolf")).toBeInTheDocument();
    expect(
      container.querySelector(".career-status__desktop .career-status__zoid"),
    ).toHaveAttribute("src", "/images/zoids/command_wolf.png");
    expect(
      screen.getByRole("progressbar", {
        name: "Potential: 35 of 100",
      }),
    ).toBeInTheDocument();
  });

  test("uses the fallback for a Zoid without a sprite", () => {
    const pilotWithZoid = {
      ...pilot,
      potential: createBoundedValue(30),
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:arosaurer",
      },
    } satisfies PilotWithZoid;

    const { container } = render(<CareerStatusBar pilot={pilotWithZoid} />);

    expect(screen.getByText("Arosaurer")).toBeInTheDocument();
    expect(
      container.querySelector(
        ".career-status__desktop .career-status__zoid-fallback",
      ),
    ).toBeInTheDocument();
  });
});
