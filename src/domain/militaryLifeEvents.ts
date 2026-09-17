import { createDecisionEventFactory } from "./eventDefinitions";
const {
  chance,
  event: defineEvent,
  safe,
} = createDecisionEventFactory({
  ages: [21, 22, 23, 24, 25],
  factions: ["guylos", "helic"],
  idPrefix: "military-life-",
  translationPrefix: "military-life.",
  eventOptions: { requiresZoid: true },
});
export const militaryLifeEvents = [
  defineEvent("abandoned-hangar", [
    chance(40, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
    chance(25, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  defineEvent("empty-bunks", [
    chance(60, [
      {
        stat: "charisma",
        weight: 0.3,
      },
    ]),
    chance(70, [
      {
        stat: "tactics",
        weight: 0.2,
      },
      {
        stat: "charisma",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  defineEvent("field-trials", [
    chance(35, [
      {
        stat: "piloting",
        weight: 0.2,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
      {
        stat: "potential",
        weight: 0.1,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  defineEvent("forward-workshop", [
    chance(35, [
      {
        stat: "synchrony",
        weight: 0.2,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
      {
        stat: "potential",
        weight: 0.1,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.2,
      },
      {
        stat: "charisma",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  defineEvent("leave-letter", [
    chance(60, [
      {
        stat: "charisma",
        weight: 0.2,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
    chance(45, [
      {
        stat: "tactics",
        weight: 0.15,
      },
      {
        stat: "strength",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  defineEvent("relief-column", [
    chance(35, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ]),
    chance(60, [
      {
        stat: "strength",
        weight: 0.25,
      },
      {
        stat: "charisma",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  defineEvent("retiring-pilot", [
    chance(55, [
      {
        stat: "technique",
        weight: 0.2,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
      {
        stat: "potential",
        weight: 0.1,
      },
    ]),
    chance(40, [
      {
        stat: "synchrony",
        weight: 0.25,
      },
      {
        stat: "potential",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  defineEvent("silent-ridge", [
    chance(35, [
      {
        stat: "piloting",
        weight: 0.15,
      },
      {
        stat: "tactics",
        weight: 0.3,
      },
    ]),
    chance(10, [
      {
        stat: "synchrony",
        weight: 0.2,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
      {
        stat: "potential",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  defineEvent("squadron-friction", [
    chance(35, [
      {
        stat: "tactics",
        weight: 0.25,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    chance(60, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  defineEvent("trapped-core", [
    chance(35, [
      {
        stat: "synchrony",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.25,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.05,
      },
    ]),
    safe(),
  ]),
] as const;
