import { createDecisionEventFactory } from "./eventDefinitions.ts";

const { chance, event, safe } = createDecisionEventFactory({
  ages: [13, 14],
  eventOptions: { requiresZoid: true },
  factions: ["guylos", "helic"],
});

export const academyEvents = [
  event("academy-synchrony-test", [
    chance(65, [
      {
        stat: "synchrony",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    safe(),
    chance(25, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
    ]),
  ]),
  event("academy-convoy-detail", [
    chance(55, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ]),
    safe(),
    chance(55, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
  ]),
  event("academy-wild-migration", [
    chance(30, [
      {
        stat: "synchrony",
        weight: 0.3,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ]),
    safe(),
    chance(35, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-ruins-survey", [
    safe(),
    chance(40, [
      {
        stat: "tactics",
        weight: 0.25,
      },
      {
        stat: "technique",
        weight: 0.2,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-red-rust-storm", [
    chance(60, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    chance(30, [
      {
        stat: "synchrony",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-rival-challenge", [
    chance(30, [
      {
        stat: "potential",
        weight: 0.3,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ]),
    chance(50, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-night-infiltration", [
    chance(50, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    chance(30, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-salvo-malfunction", [
    chance(40, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.2,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-core-fever", [
    safe(),
    chance(65, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-refugee-train", [
    chance(45, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
    chance(60, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-salvage-yard", [
    safe(),
    chance(40, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.25,
      },
    ]),
    chance(50, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-intercepted-signal", [
    safe(),
    chance(45, [
      {
        stat: "charisma",
        weight: 0.1,
      },
      {
        stat: "tactics",
        weight: 0.25,
      },
    ]),
    chance(30, [
      {
        stat: "technique",
        weight: 0.4,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
  ]),
  event("academy-amphibious-course", [
    safe(),
    chance(30, [
      {
        stat: "strength",
        weight: 0.2,
      },
      {
        stat: "piloting",
        weight: 0.3,
      },
    ]),
    chance(55, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-flight-selection", [
    chance(45, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
    chance(70, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "charisma",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-command-simulation", [
    chance(30, [
      {
        stat: "piloting",
        weight: 0.2,
      },
      {
        stat: "tactics",
        weight: 0.3,
      },
    ]),
    chance(55, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-order-of-fire", [
    chance(40, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    safe(),
    chance(60, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "charisma",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-captured-cadet", [
    safe(),
    chance(50, [
      {
        stat: "charisma",
        weight: 0.2,
      },
      {
        stat: "tactics",
        weight: 0.25,
      },
    ]),
    chance(40, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-black-market", [
    chance(45, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    chance(65, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-organoid-rumor", [
    chance(80, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
    chance(20, [
      {
        stat: "tactics",
        weight: 0.25,
      },
      {
        stat: "synchrony",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-magnetic-front", [
    chance(45, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "tactics",
        weight: 0.2,
      },
    ]),
    chance(70, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-minefield", [
    chance(50, [
      {
        stat: "technique",
        weight: 0.25,
      },
      {
        stat: "piloting",
        weight: 0.2,
      },
    ]),
    safe(),
    chance(30, [
      {
        stat: "technique",
        weight: 0.2,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
  ]),
  event("academy-zi-tournament", [
    chance(20, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "synchrony",
        weight: 0.25,
      },
    ]),
    chance(50, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-joint-rescue", [
    chance(70, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    safe(),
    chance(50, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "charisma",
        weight: 0.15,
      },
    ]),
  ]),
  event("academy-prototype-test", [
    chance(30, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ]),
    chance(75, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-sleeper-hunt", [
    chance(50, [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    chance(35, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-two-seat-drill", [
    chance(60, [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "charisma",
        weight: 0.15,
      },
    ]),
    chance(60, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-reconstruction-detail", [
    chance(50, [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
    ]),
    chance(75, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event("academy-desert-survival", [
    chance(65, [
      {
        stat: "tactics",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.2,
      },
    ]),
    chance(30, [
      {
        stat: "synchrony",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
    safe(),
  ]),
  event(
    "academy-front-observer",
    [
      chance(10, [
        {
          stat: "tactics",
          weight: 0.3,
        },
        {
          stat: "piloting",
          weight: 0.15,
        },
      ]),
      chance(40, [
        {
          stat: "charisma",
          weight: 0.3,
        },
        {
          stat: "tactics",
          weight: 0.2,
        },
      ]),
      safe(),
    ],
    {
      ages: [14],
    },
  ),
  event(
    "academy-final-board",
    [
      chance(30, [
        {
          stat: "piloting",
          weight: 0.3,
        },
        {
          stat: "synchrony",
          weight: 0.25,
        },
      ]),
      chance(50, [
        {
          stat: "charisma",
          weight: 0.3,
        },
        {
          stat: "tactics",
          weight: 0.15,
        },
      ]),
      chance(70, [
        {
          stat: "piloting",
          weight: 0.2,
        },
        {
          stat: "technique",
          weight: 0.3,
        },
      ]),
    ],
    {
      ages: [14],
    },
  ),
  event("academy-date-invitation", [
    chance(35, [
      {
        stat: "charisma",
        weight: 0.3,
      },
    ]),
    chance(60, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "technique",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-instructor-conflict", [
    chance(70, [
      {
        stat: "piloting",
        weight: 0.2,
      },
      {
        stat: "charisma",
        weight: 0.3,
      },
    ]),
    chance(45, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ]),
    safe(),
  ]),
  event("academy-cadet-conflict", [
    chance(40, [
      {
        stat: "charisma",
        weight: 0.25,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ]),
    chance(60, [
      {
        stat: "piloting",
        weight: 0.25,
      },
      {
        stat: "synchrony",
        weight: 0.2,
      },
    ]),
    safe(),
  ]),
  event("academy-cheating-witness", [
    safe(),
    chance(75, [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.1,
      },
    ]),
    chance(50, [
      {
        stat: "tactics",
        weight: 0.2,
      },
      {
        stat: "charisma",
        weight: 0.1,
      },
    ]),
  ]),
];
