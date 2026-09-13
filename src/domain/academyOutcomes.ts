import {
  createOutcomeFactory,
  type OutcomeDefinition,
} from "./outcomeDefinitions";

const { catalog } = createOutcomeFactory();

const outcomes = [
  {
    path: "academy-synchrony-test.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        indicator: "fame",
        kind: "change-career-indicator",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-synchrony-test.2",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-synchrony-test.3",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        kind: "injure-pilot",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-convoy-detail.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
  },
  {
    path: "academy-convoy-detail.2",
    success: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-convoy-detail.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-wild-migration.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        indicator: "fame",
        kind: "change-career-indicator",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        kind: "grant-zoid",
        poolId: "herd",
      },
    ],
  },
  {
    path: "academy-wild-migration.2",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-wild-migration.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        kind: "injure-pilot",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
  },
  {
    path: "academy-ruins-survey.1",
    success: [
      {
        amount: 2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-ruins-survey.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-ruins-survey.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-red-rust-storm.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-red-rust-storm.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-red-rust-storm.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-rival-challenge.1",
    failure: [
      {
        amount: -2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-rival-challenge.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-rival-challenge.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-night-infiltration.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-night-infiltration.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-night-infiltration.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-salvo-malfunction.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-salvo-malfunction.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-salvo-malfunction.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-core-fever.1",
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-core-fever.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-core-fever.3",
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -4,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "replace-signature-zoid",
        poolId: "academy-replacement",
      },
    ],
  },
  {
    path: "academy-refugee-train.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-refugee-train.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-refugee-train.3",
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        indicator: "fame",
        kind: "change-career-indicator",
      },
    ],
  },
  {
    path: "academy-salvage-yard.1",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-salvage-yard.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-salvage-yard.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        kind: "damage-signature-zoid",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-zoid-upgrades",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-intercepted-signal.1",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-intercepted-signal.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-intercepted-signal.3",
    failure: [
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-amphibious-course.1",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-amphibious-course.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        kind: "injure-pilot",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-amphibious-course.3",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-flight-selection.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        kind: "grant-zoid",
        poolId: "aerial-academy",
      },
    ],
  },
  {
    path: "academy-flight-selection.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-flight-selection.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-command-simulation.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-command-simulation.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-command-simulation.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-order-of-fire.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-order-of-fire.2",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-order-of-fire.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-captured-cadet.1",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-captured-cadet.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-captured-cadet.3",
    failure: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-black-market.1",
    failure: [
      {
        amount: -2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        indicator: "fame",
        kind: "change-career-indicator",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-black-market.2",
    failure: [
      {
        amount: 1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -4,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-black-market.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-organoid-rumor.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-organoid-rumor.2",
    failure: [
      {
        amount: -2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        bonusId: "organoid",
        kind: "grant-bonus",
      },
    ],
  },
  {
    path: "academy-organoid-rumor.3",
    success: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-magnetic-front.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-magnetic-front.2",
    failure: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-magnetic-front.3",
    success: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-minefield.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-minefield.2",
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-minefield.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-zi-tournament.1",
    failure: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 4,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        kind: "grant-zoid",
        poolId: "rare",
      },
    ],
  },
  {
    path: "academy-zi-tournament.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-zi-tournament.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-joint-rescue.1",
    failure: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-joint-rescue.2",
    success: [
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-joint-rescue.3",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-prototype-test.1",
    failure: [
      {
        amount: -4,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "injure-pilot",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-potential",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 1,
        kind: "change-zoid-upgrades",
      },
    ],
  },
  {
    path: "academy-prototype-test.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-prototype-test.3",
    success: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-sleeper-hunt.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-sleeper-hunt.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
    ],
  },
  {
    path: "academy-sleeper-hunt.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-two-seat-drill.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-two-seat-drill.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "technique",
      },
    ],
  },
  {
    path: "academy-two-seat-drill.3",
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-reconstruction-detail.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-reconstruction-detail.2",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-reconstruction-detail.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-desert-survival.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-desert-survival.2",
    failure: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-desert-survival.3",
    success: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "technique",
      },
    ],
  },
  {
    path: "academy-front-observer.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        kind: "injure-pilot",
      },
      {
        kind: "damage-signature-zoid",
      },
    ],
    success: [
      {
        amount: 3,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 2,
        kind: "change-potential",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
    ],
  },
  {
    path: "academy-front-observer.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 4,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-potential",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-front-observer.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-final-board.1",
    failure: [
      {
        amount: -2,
        kind: "change-potential",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "end-career",
        reason: "non-operational",
      },
    ],
    success: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 2,
        kind: "change-potential",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-final-board.2",
    failure: [
      {
        amount: -2,
        kind: "change-potential",
      },
      {
        amount: -1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 1,
        kind: "change-potential",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-final-board.3",
    failure: [
      {
        amount: -2,
        kind: "change-potential",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
    ],
    success: [
      {
        amount: 1,
        kind: "change-potential",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-date-invitation.1",
    failure: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 5,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        achievementId: "achievement:first-romance",
        kind: "grant-achievement",
      },
    ],
  },
  {
    path: "academy-date-invitation.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "technique",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-date-invitation.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-instructor-conflict.1",
    failure: [
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-instructor-conflict.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
    success: [
      {
        amount: 2,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "piloting",
      },
    ],
  },
  {
    path: "academy-instructor-conflict.3",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-cadet-conflict.1",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-cadet-conflict.2",
    failure: [
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
    ],
  },
  {
    path: "academy-cadet-conflict.3",
    success: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 5,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
  {
    path: "academy-cheating-witness.1",
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        achievementId: "achievement:snitch",
        kind: "grant-achievement",
      },
    ],
  },
  {
    path: "academy-cheating-witness.2",
    failure: [
      {
        amount: -3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 2,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "charisma",
      },
    ],
  },
  {
    path: "academy-cheating-witness.3",
    failure: [
      {
        amount: -3,
        indicator: "faction-trust",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    success: [
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
  },
] as const satisfies readonly OutcomeDefinition[];

export const academyOutcomeCatalog = catalog(outcomes);
