import { describe, expect, test } from "vitest";

import { createDecisionEventFactory } from "../domain/eventDefinitions";

describe("event definitions", () => {
  test.each([2, 3, 4])("creates %i choices in declaration order", (count) => {
    const { event, safe } = createDecisionEventFactory();
    const result = event(
      "patrol",
      Array.from({ length: count }, () => safe()),
    );

    expect(result.decisions.map(({ id }) => id)).toEqual(
      Array.from(
        { length: count },
        (_, index) => `decision:patrol-${index + 1}`,
      ),
    );
  });

  test.each([0, 1])("rejects an event with %i choices", (count) => {
    const { event, safe } = createDecisionEventFactory();
    expect(() =>
      event(
        "patrol",
        Array.from({ length: count }, () => safe()),
      ),
    ).toThrow("must have at least two decisions");
  });

  test("overrides shared eligibility for a specific year", () => {
    const { event, safe } = createDecisionEventFactory({
      ages: [21, 22, 23],
      factions: ["helic"],
      idPrefix: "veteran-",
      translationPrefix: "veteran.",
    });
    const result = event("patrol", [safe(), safe()], {
      ages: [23],
      factions: ["guylos"],
      requiredCareerFlags: ["command"],
      requiresZoid: true,
    });

    expect(result).toMatchObject({
      ages: [23],
      factions: ["guylos"],
      id: "event:veteran-patrol",
      requiredCareerFlags: ["command"],
      requiresZoid: true,
      titleKey: "narrative:veteran.patrol.title",
    });
  });
});
