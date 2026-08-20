import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { ScreenTransition } from "../app/ScreenTransition";

const firstKey = "first";
const firstScreen = "First screen";
const secondKey = "second";
const secondScreen = "Second screen";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("collapses the old content and deploys the new content", () => {
  vi.useFakeTimers();
  stubReducedMotion(false);
  const view = render(
    <ScreenTransition reducedMotion={false} transitionKey={firstKey}>
      <p>{firstScreen}</p>
    </ScreenTransition>,
  );

  expect(view.container.firstElementChild).toHaveStyle(
    "--screen-transition-duration: 320ms",
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
