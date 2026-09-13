import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";

import { EventReviewPage } from "../app/EventReviewPage";

test("starts empty and lets the developer load a local CSV", () => {
  render(<EventReviewPage initialCsv="" />);

  expect(
    screen.getByRole("heading", { name: "Revisión de eventos" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Abrir CSV" })).toBeInTheDocument();
  expect(
    screen.getByText("Abre un CSV de eventos para empezar la revisión."),
  ).toBeInTheDocument();
});

test("derives stage ages from any event CSV", () => {
  const header =
    "event_id,age,title,introduction,choice_label,choice_description,kind";
  const rows = [1, 2, 3].map(
    (choice) =>
      `early-service-test,15-20,Test event,Test introduction,Choice ${choice},Description,safe`,
  );

  const { container } = render(
    <EventReviewPage initialCsv={[header, ...rows].join("\n")} />,
  );

  expect(
    within(container).getByRole("option", { name: "15-20" }),
  ).toBeInTheDocument();
  expect(
    within(container).getByRole("heading", { name: "Revisión de eventos" }),
  ).toBeInTheDocument();
});
