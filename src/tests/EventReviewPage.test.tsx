import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { EventReviewPage } from "../app/EventReviewPage";

test("starts empty and lets the developer load a local CSV", () => {
  render(<EventReviewPage initialCsv="" />);

  expect(
    screen.getByRole("heading", { name: "Revisión de eventos de academia" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Abrir CSV" })).toBeInTheDocument();
  expect(
    screen.getByText("Abre un CSV de eventos para empezar la revisión."),
  ).toBeInTheDocument();
});
