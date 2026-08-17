import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { App } from "../app/App";

test("shows the localized introduction", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Scars of Steel" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Your career as a pilot is about to begin."),
  ).toBeInTheDocument();
});
