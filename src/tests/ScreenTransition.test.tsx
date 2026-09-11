import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { ScreenTransition } from "../app/ScreenTransition";

const firstKey = "first";
const firstScreen = "First screen";
const secondKey = "second";
const secondScreen = "Second screen";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("crossfades the old and new content", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );

  expect(view.container.firstElementChild).toHaveStyle(
    "--screen-transition-duration: 220ms",
  );

  view.rerender(
    <ScreenTransition reducedMotion={false} transitionKey={secondKey}>
      <p>{secondScreen}</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(0));

  expect(screen.getByText(firstScreen).parentElement).toHaveAttribute(
    "data-motion",
    "outgoing",
  );
  expect(screen.getByText(firstScreen).parentElement).toHaveAttribute("inert");
  expect(screen.getByText(secondScreen).parentElement).toHaveAttribute(
    "data-motion",
    "incoming",
  );

  act(() => vi.runAllTimers());

  expect(screen.queryByText(firstScreen)).not.toBeInTheDocument();
  expect(screen.getByText(secondScreen).parentElement).toHaveAttribute(
    "data-motion",
    "current",
  );
});

test("keeps the outgoing height until the fade ends", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.textContent === firstScreen ? 800 : 300;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    height: 18,
    top: 0,
  } as DOMRect);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );
  expect(view.container.firstElementChild).toHaveStyle("height: 800px");
  view.rerender(
    <ScreenTransition reducedMotion={false} transitionKey={secondKey}>
      <p>{secondScreen}</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(0));
  expect(view.container.firstElementChild).toHaveStyle("height: 800px");
  expect(view.container.firstElementChild).toHaveAttribute(
    "data-transitioning",
    "true",
  );
  act(() => vi.advanceTimersByTime(219));
  expect(view.container.firstElementChild).toHaveStyle("height: 800px");
  act(() => vi.runAllTimers());
  expect(view.container.firstElementChild).toHaveStyle("height: 300px");
  expect(view.container.firstElementChild).not.toHaveAttribute(
    "data-transitioning",
  );
});

test("scrolls to the panel start when changing screens below the fold", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  const scrollTo = vi
    .spyOn(window, "scrollTo")
    .mockImplementation(() => undefined);
  vi.stubGlobal("scrollY", 500);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: -300,
  } as DOMRect);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );
  expect(scrollTo).not.toHaveBeenCalled();
  view.rerender(
    <ScreenTransition reducedMotion={false} transitionKey={secondKey}>
      <p>{secondScreen}</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(0));
  expect(scrollTo).toHaveBeenCalledWith({ top: 200, behavior: "smooth" });
});

test("finishes the transition when the incoming content updates", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );
  view.rerender(
    <ScreenTransition reducedMotion={false} transitionKey={secondKey}>
      <p>{secondScreen}</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(100));
  view.rerender(
    <ScreenTransition reducedMotion={false} transitionKey={secondKey}>
      <p>{secondScreen}!</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(120));
  expect(screen.queryByText(firstScreen)).not.toBeInTheDocument();
  expect(
    view.container.querySelectorAll(".screen-transition__layer"),
  ).toHaveLength(1);
});

test("replaces the content immediately with reduced motion", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );

  view.rerender(
    <ScreenTransition reducedMotion transitionKey={secondKey}>
      <p>{secondScreen}</p>
    </ScreenTransition>,
  );
  act(() => vi.advanceTimersByTime(0));

  expect(screen.queryByText(firstScreen)).not.toBeInTheDocument();
  expect(screen.getByText(secondScreen).parentElement).toHaveAttribute(
    "data-motion",
    "current",
  );
});

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches })),
  );
}
