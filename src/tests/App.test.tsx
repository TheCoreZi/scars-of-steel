import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { App } from "../app/App";

test("shows the game title", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Cicatrices de Acero" }),
  ).toBeInTheDocument();
});
