import { createDecisionEventFactory } from "./eventDefinitions";

const ages = [15, 16, 17, 18, 19, 20] as const;
const {
  chance,
  event: defineEvent,
  safe,
} = createDecisionEventFactory({
  ages,
  factions: ["guylos", "helic"],
  idPrefix: "early-service-",
  translationPrefix: "early-service.",
});

export const earlyServiceEvents = [
  defineEvent("barracks-duty", [
    chance(30, [
      { stat: "synchrony", weight: 0.3 },
      { stat: "piloting", weight: 0.15 },
    ]),
    safe(),
    chance(50, [
      { stat: "tactics", weight: 0.3 },
      { stat: "charisma", weight: 0.15 },
    ]),
  ]),
  defineEvent("red-river", [
    chance(50, [
      { stat: "piloting", weight: 0.3 },
      { stat: "synchrony", weight: 0.15 },
    ]),
    chance(65, [
      { stat: "tactics", weight: 0.3 },
      { stat: "technique", weight: 0.15 },
    ]),
    safe(),
  ]),
  defineEvent("mount-olympus", [
    chance(25, [
      { stat: "piloting", weight: 0.5 },
      { stat: "synchrony", weight: 0.2 },
    ]),
    chance(55, [
      { stat: "technique", weight: 0.35 },
      { stat: "piloting", weight: 0.05 },
    ]),
    safe(),
  ]),
  defineEvent("under-our-fire", [
    chance(60, [
      { stat: "charisma", weight: 0.25 },
      { stat: "tactics", weight: 0.2 },
    ]),
    safe(),
    chance(35, [
      { stat: "piloting", weight: 0.3 },
      { stat: "tactics", weight: 0.15 },
    ]),
  ]),
  defineEvent("enemy-informant", [
    chance(55, [
      { stat: "tactics", weight: 0.3 },
      { stat: "charisma", weight: 0.15 },
    ]),
    chance(70, [
      { stat: "technique", weight: 0.3 },
      { stat: "tactics", weight: 0.15 },
    ]),
    safe(),
  ]),
  defineEvent(
    "line-collapses",
    [
      chance(45, [
        { stat: "tactics", weight: 0.3 },
        { stat: "charisma", weight: 0.15 },
      ]),
      chance(25, [
        { stat: "synchrony", weight: 0.35 },
        { stat: "strength", weight: 0.1 },
      ]),
      safe(),
    ],
    { requiresZoid: true },
  ),
  defineEvent("no-one-left-behind", [
    chance(30, [
      { stat: "tactics", weight: 0.3 },
      { stat: "technique", weight: 0.15 },
    ]),
    chance(60, [
      { stat: "charisma", weight: 0.3 },
      { stat: "tactics", weight: 0.1 },
    ]),
    safe(),
  ]),
  defineEvent("moonbay-contract", [
    chance(65, [
      { stat: "technique", weight: 0.25 },
      { stat: "charisma", weight: 0.15 },
    ]),
    chance(40, [
      { stat: "charisma", weight: 0.3 },
      { stat: "tactics", weight: 0.1 },
    ]),
    safe(),
  ]),
  defineEvent(
    "impossible-part",
    [
      chance(50, [
        { stat: "technique", weight: 0.3 },
        { stat: "synchrony", weight: 0.15 },
      ]),
      safe(),
      chance(70, [
        { stat: "charisma", weight: 0.3 },
        { stat: "tactics", weight: 0.1 },
      ]),
    ],
    { requiredCareerFlags: ["engineering"] },
  ),
  defineEvent(
    "two-orders",
    [
      safe(),
      chance(40, [
        { stat: "charisma", weight: 0.3 },
        { stat: "tactics", weight: 0.15 },
      ]),
      chance(60, [
        { stat: "synchrony", weight: 0.25 },
        { stat: "tactics", weight: 0.15 },
      ]),
    ],
    { requiredCareerFlags: ["command"] },
  ),
] as const;
