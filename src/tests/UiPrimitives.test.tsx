import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import { Badge, Button, Meter, Panel } from "../app/UiPrimitives";

const badgeLabel = "Cadet";
const buttonLabel = "Continue";
const meterLabel = "Potential";
const panelId = "panel-title";
const panelTitle = "Pilot status";

afterEach(cleanup);

describe("UI primitives", () => {
  test("provides accessible base components", () => {
    render(
      <Panel labelledBy={panelId}>
        <h2 id={panelId}>{panelTitle}</h2>
        <Badge>{badgeLabel}</Badge>
        <Button disabled>{buttonLabel}</Button>
      </Panel>,
    );

    expect(screen.getByRole("region", { name: panelTitle })).toHaveClass(
      "panel",
    );
    expect(screen.getByText(badgeLabel)).toHaveClass("badge");
    expect(screen.getByRole("button", { name: buttonLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: buttonLabel })).toHaveAttribute(
      "type",
      "button",
    );
  });

  test.each([
    [120, 100, 100, "100%"],
    [-5, 100, 0, "0%"],
    [5, -10, 0, "0%"],
  ])(
    "limits meter value %s with max %s",
    (value, max, expectedValue, expectedWidth) => {
      const { container } = render(
        <Meter label={meterLabel} max={max} value={value} />,
      );

      expect(
        screen.getByRole("progressbar", { name: meterLabel }),
      ).toHaveAttribute("aria-valuemax", String(Math.max(0, max)));
      expect(
        screen.getByRole("progressbar", { name: meterLabel }),
      ).toHaveAttribute("aria-valuenow", String(expectedValue));
      expect(container.querySelector(".meter__number")).toHaveTextContent(
        String(expectedValue),
      );
      expect(container.querySelector(".meter__value")).toHaveStyle({
        width: expectedWidth,
      });
    },
  );
});
