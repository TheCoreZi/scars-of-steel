import type { DecisionEvent } from "./types.ts";

export const academyEvents = [
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-synchrony-test.1.description",
        id: "decision:academy-synchrony-test-1",
        kind: "chance",
        labelKey: "decisions:academy-synchrony-test.1.label",
        baseSuccessChance: 65,
        probabilityStats: [
          {
            stat: "synchrony",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-synchrony-test-1-failure",
        successOutcomeId: "outcome:academy-synchrony-test-1-success",
      },
      {
        descriptionKey: "decisions:academy-synchrony-test.2.description",
        id: "decision:academy-synchrony-test-2",
        kind: "safe",
        labelKey: "decisions:academy-synchrony-test.2.label",
        outcomeId: "outcome:academy-synchrony-test-2-success",
      },
      {
        descriptionKey: "decisions:academy-synchrony-test.3.description",
        id: "decision:academy-synchrony-test-3",
        kind: "chance",
        labelKey: "decisions:academy-synchrony-test.3.label",
        baseSuccessChance: 25,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-synchrony-test-3-failure",
        successOutcomeId: "outcome:academy-synchrony-test-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-synchrony-test",
    introductionKey: "narrative:academy-synchrony-test.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-synchrony-test.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-convoy-detail.1.description",
        id: "decision:academy-convoy-detail-1",
        kind: "chance",
        labelKey: "decisions:academy-convoy-detail.1.label",
        baseSuccessChance: 55,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "piloting",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-convoy-detail-1-failure",
        successOutcomeId: "outcome:academy-convoy-detail-1-success",
      },
      {
        descriptionKey: "decisions:academy-convoy-detail.2.description",
        id: "decision:academy-convoy-detail-2",
        kind: "safe",
        labelKey: "decisions:academy-convoy-detail.2.label",
        outcomeId: "outcome:academy-convoy-detail-2-success",
      },
      {
        descriptionKey: "decisions:academy-convoy-detail.3.description",
        id: "decision:academy-convoy-detail-3",
        kind: "chance",
        labelKey: "decisions:academy-convoy-detail.3.label",
        baseSuccessChance: 55,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-convoy-detail-3-failure",
        successOutcomeId: "outcome:academy-convoy-detail-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-convoy-detail",
    introductionKey: "narrative:academy-convoy-detail.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-convoy-detail.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-wild-migration.1.description",
        id: "decision:academy-wild-migration-1",
        kind: "chance",
        labelKey: "decisions:academy-wild-migration.1.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "synchrony",
            weight: 0.3,
          },
          {
            stat: "piloting",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-wild-migration-1-failure",
        successOutcomeId: "outcome:academy-wild-migration-1-success",
      },
      {
        descriptionKey: "decisions:academy-wild-migration.2.description",
        id: "decision:academy-wild-migration-2",
        kind: "safe",
        labelKey: "decisions:academy-wild-migration.2.label",
        outcomeId: "outcome:academy-wild-migration-2-success",
      },
      {
        descriptionKey: "decisions:academy-wild-migration.3.description",
        id: "decision:academy-wild-migration-3",
        kind: "chance",
        labelKey: "decisions:academy-wild-migration.3.label",
        baseSuccessChance: 35,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-wild-migration-3-failure",
        successOutcomeId: "outcome:academy-wild-migration-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-wild-migration",
    introductionKey: "narrative:academy-wild-migration.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-wild-migration.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-ruins-survey.1.description",
        id: "decision:academy-ruins-survey-1",
        kind: "safe",
        labelKey: "decisions:academy-ruins-survey.1.label",
        outcomeId: "outcome:academy-ruins-survey-1-success",
      },
      {
        descriptionKey: "decisions:academy-ruins-survey.2.description",
        id: "decision:academy-ruins-survey-2",
        kind: "chance",
        labelKey: "decisions:academy-ruins-survey.2.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.25,
          },
          {
            stat: "technique",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-ruins-survey-2-failure",
        successOutcomeId: "outcome:academy-ruins-survey-2-success",
      },
      {
        descriptionKey: "decisions:academy-ruins-survey.3.description",
        id: "decision:academy-ruins-survey-3",
        kind: "chance",
        labelKey: "decisions:academy-ruins-survey.3.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-ruins-survey-3-failure",
        successOutcomeId: "outcome:academy-ruins-survey-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-ruins-survey",
    introductionKey: "narrative:academy-ruins-survey.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-ruins-survey.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-red-rust-storm.1.description",
        id: "decision:academy-red-rust-storm-1",
        kind: "chance",
        labelKey: "decisions:academy-red-rust-storm.1.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-red-rust-storm-1-failure",
        successOutcomeId: "outcome:academy-red-rust-storm-1-success",
      },
      {
        descriptionKey: "decisions:academy-red-rust-storm.2.description",
        id: "decision:academy-red-rust-storm-2",
        kind: "chance",
        labelKey: "decisions:academy-red-rust-storm.2.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "synchrony",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-red-rust-storm-2-failure",
        successOutcomeId: "outcome:academy-red-rust-storm-2-success",
      },
      {
        descriptionKey: "decisions:academy-red-rust-storm.3.description",
        id: "decision:academy-red-rust-storm-3",
        kind: "safe",
        labelKey: "decisions:academy-red-rust-storm.3.label",
        outcomeId: "outcome:academy-red-rust-storm-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-red-rust-storm",
    introductionKey: "narrative:academy-red-rust-storm.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-red-rust-storm.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-rival-challenge.1.description",
        id: "decision:academy-rival-challenge-1",
        kind: "chance",
        labelKey: "decisions:academy-rival-challenge.1.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "potential",
            weight: 0.3,
          },
          {
            stat: "piloting",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-rival-challenge-1-failure",
        successOutcomeId: "outcome:academy-rival-challenge-1-success",
      },
      {
        descriptionKey: "decisions:academy-rival-challenge.2.description",
        id: "decision:academy-rival-challenge-2",
        kind: "chance",
        labelKey: "decisions:academy-rival-challenge.2.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-rival-challenge-2-failure",
        successOutcomeId: "outcome:academy-rival-challenge-2-success",
      },
      {
        descriptionKey: "decisions:academy-rival-challenge.3.description",
        id: "decision:academy-rival-challenge-3",
        kind: "safe",
        labelKey: "decisions:academy-rival-challenge.3.label",
        outcomeId: "outcome:academy-rival-challenge-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-rival-challenge",
    introductionKey: "narrative:academy-rival-challenge.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-rival-challenge.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-night-infiltration.1.description",
        id: "decision:academy-night-infiltration-1",
        kind: "chance",
        labelKey: "decisions:academy-night-infiltration.1.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-night-infiltration-1-failure",
        successOutcomeId: "outcome:academy-night-infiltration-1-success",
      },
      {
        descriptionKey: "decisions:academy-night-infiltration.2.description",
        id: "decision:academy-night-infiltration-2",
        kind: "chance",
        labelKey: "decisions:academy-night-infiltration.2.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-night-infiltration-2-failure",
        successOutcomeId: "outcome:academy-night-infiltration-2-success",
      },
      {
        descriptionKey: "decisions:academy-night-infiltration.3.description",
        id: "decision:academy-night-infiltration-3",
        kind: "safe",
        labelKey: "decisions:academy-night-infiltration.3.label",
        outcomeId: "outcome:academy-night-infiltration-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-night-infiltration",
    introductionKey: "narrative:academy-night-infiltration.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-night-infiltration.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-salvo-malfunction.1.description",
        id: "decision:academy-salvo-malfunction-1",
        kind: "chance",
        labelKey: "decisions:academy-salvo-malfunction.1.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.25,
          },
          {
            stat: "strength",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-salvo-malfunction-1-failure",
        successOutcomeId: "outcome:academy-salvo-malfunction-1-success",
      },
      {
        descriptionKey: "decisions:academy-salvo-malfunction.2.description",
        id: "decision:academy-salvo-malfunction-2",
        kind: "chance",
        labelKey: "decisions:academy-salvo-malfunction.2.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-salvo-malfunction-2-failure",
        successOutcomeId: "outcome:academy-salvo-malfunction-2-success",
      },
      {
        descriptionKey: "decisions:academy-salvo-malfunction.3.description",
        id: "decision:academy-salvo-malfunction-3",
        kind: "safe",
        labelKey: "decisions:academy-salvo-malfunction.3.label",
        outcomeId: "outcome:academy-salvo-malfunction-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-salvo-malfunction",
    introductionKey: "narrative:academy-salvo-malfunction.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-salvo-malfunction.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-core-fever.1.description",
        id: "decision:academy-core-fever-1",
        kind: "safe",
        labelKey: "decisions:academy-core-fever.1.label",
        outcomeId: "outcome:academy-core-fever-1-success",
      },
      {
        descriptionKey: "decisions:academy-core-fever.2.description",
        id: "decision:academy-core-fever-2",
        kind: "chance",
        labelKey: "decisions:academy-core-fever.2.label",
        baseSuccessChance: 65,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-core-fever-2-failure",
        successOutcomeId: "outcome:academy-core-fever-2-success",
      },
      {
        descriptionKey: "decisions:academy-core-fever.3.description",
        id: "decision:academy-core-fever-3",
        kind: "safe",
        labelKey: "decisions:academy-core-fever.3.label",
        outcomeId: "outcome:academy-core-fever-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-core-fever",
    introductionKey: "narrative:academy-core-fever.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-core-fever.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-refugee-train.1.description",
        id: "decision:academy-refugee-train-1",
        kind: "chance",
        labelKey: "decisions:academy-refugee-train.1.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-refugee-train-1-failure",
        successOutcomeId: "outcome:academy-refugee-train-1-success",
      },
      {
        descriptionKey: "decisions:academy-refugee-train.2.description",
        id: "decision:academy-refugee-train-2",
        kind: "chance",
        labelKey: "decisions:academy-refugee-train.2.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-refugee-train-2-failure",
        successOutcomeId: "outcome:academy-refugee-train-2-success",
      },
      {
        descriptionKey: "decisions:academy-refugee-train.3.description",
        id: "decision:academy-refugee-train-3",
        kind: "safe",
        labelKey: "decisions:academy-refugee-train.3.label",
        outcomeId: "outcome:academy-refugee-train-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-refugee-train",
    introductionKey: "narrative:academy-refugee-train.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-refugee-train.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-salvage-yard.1.description",
        id: "decision:academy-salvage-yard-1",
        kind: "safe",
        labelKey: "decisions:academy-salvage-yard.1.label",
        outcomeId: "outcome:academy-salvage-yard-1-success",
      },
      {
        descriptionKey: "decisions:academy-salvage-yard.2.description",
        id: "decision:academy-salvage-yard-2",
        kind: "chance",
        labelKey: "decisions:academy-salvage-yard.2.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.25,
          },
        ],
        failureOutcomeId: "outcome:academy-salvage-yard-2-failure",
        successOutcomeId: "outcome:academy-salvage-yard-2-success",
      },
      {
        descriptionKey: "decisions:academy-salvage-yard.3.description",
        id: "decision:academy-salvage-yard-3",
        kind: "chance",
        labelKey: "decisions:academy-salvage-yard.3.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-salvage-yard-3-failure",
        successOutcomeId: "outcome:academy-salvage-yard-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-salvage-yard",
    introductionKey: "narrative:academy-salvage-yard.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-salvage-yard.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-intercepted-signal.1.description",
        id: "decision:academy-intercepted-signal-1",
        kind: "safe",
        labelKey: "decisions:academy-intercepted-signal.1.label",
        outcomeId: "outcome:academy-intercepted-signal-1-success",
      },
      {
        descriptionKey: "decisions:academy-intercepted-signal.2.description",
        id: "decision:academy-intercepted-signal-2",
        kind: "chance",
        labelKey: "decisions:academy-intercepted-signal.2.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.1,
          },
          {
            stat: "tactics",
            weight: 0.25,
          },
        ],
        failureOutcomeId: "outcome:academy-intercepted-signal-2-failure",
        successOutcomeId: "outcome:academy-intercepted-signal-2-success",
      },
      {
        descriptionKey: "decisions:academy-intercepted-signal.3.description",
        id: "decision:academy-intercepted-signal-3",
        kind: "chance",
        labelKey: "decisions:academy-intercepted-signal.3.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.4,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-intercepted-signal-3-failure",
        successOutcomeId: "outcome:academy-intercepted-signal-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-intercepted-signal",
    introductionKey: "narrative:academy-intercepted-signal.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-intercepted-signal.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-amphibious-course.1.description",
        id: "decision:academy-amphibious-course-1",
        kind: "safe",
        labelKey: "decisions:academy-amphibious-course.1.label",
        outcomeId: "outcome:academy-amphibious-course-1-success",
      },
      {
        descriptionKey: "decisions:academy-amphibious-course.2.description",
        id: "decision:academy-amphibious-course-2",
        kind: "chance",
        labelKey: "decisions:academy-amphibious-course.2.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "strength",
            weight: 0.2,
          },
          {
            stat: "piloting",
            weight: 0.3,
          },
        ],
        failureOutcomeId: "outcome:academy-amphibious-course-2-failure",
        successOutcomeId: "outcome:academy-amphibious-course-2-success",
      },
      {
        descriptionKey: "decisions:academy-amphibious-course.3.description",
        id: "decision:academy-amphibious-course-3",
        kind: "chance",
        labelKey: "decisions:academy-amphibious-course.3.label",
        baseSuccessChance: 55,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-amphibious-course-3-failure",
        successOutcomeId: "outcome:academy-amphibious-course-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-amphibious-course",
    introductionKey: "narrative:academy-amphibious-course.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-amphibious-course.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-flight-selection.1.description",
        id: "decision:academy-flight-selection-1",
        kind: "chance",
        labelKey: "decisions:academy-flight-selection.1.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-flight-selection-1-failure",
        successOutcomeId: "outcome:academy-flight-selection-1-success",
      },
      {
        descriptionKey: "decisions:academy-flight-selection.2.description",
        id: "decision:academy-flight-selection-2",
        kind: "chance",
        labelKey: "decisions:academy-flight-selection.2.label",
        baseSuccessChance: 70,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.25,
          },
          {
            stat: "charisma",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-flight-selection-2-failure",
        successOutcomeId: "outcome:academy-flight-selection-2-success",
      },
      {
        descriptionKey: "decisions:academy-flight-selection.3.description",
        id: "decision:academy-flight-selection-3",
        kind: "safe",
        labelKey: "decisions:academy-flight-selection.3.label",
        outcomeId: "outcome:academy-flight-selection-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-flight-selection",
    introductionKey: "narrative:academy-flight-selection.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-flight-selection.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-command-simulation.1.description",
        id: "decision:academy-command-simulation-1",
        kind: "chance",
        labelKey: "decisions:academy-command-simulation.1.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.2,
          },
          {
            stat: "tactics",
            weight: 0.3,
          },
        ],
        failureOutcomeId: "outcome:academy-command-simulation-1-failure",
        successOutcomeId: "outcome:academy-command-simulation-1-success",
      },
      {
        descriptionKey: "decisions:academy-command-simulation.2.description",
        id: "decision:academy-command-simulation-2",
        kind: "chance",
        labelKey: "decisions:academy-command-simulation.2.label",
        baseSuccessChance: 55,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-command-simulation-2-failure",
        successOutcomeId: "outcome:academy-command-simulation-2-success",
      },
      {
        descriptionKey: "decisions:academy-command-simulation.3.description",
        id: "decision:academy-command-simulation-3",
        kind: "safe",
        labelKey: "decisions:academy-command-simulation.3.label",
        outcomeId: "outcome:academy-command-simulation-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-command-simulation",
    introductionKey: "narrative:academy-command-simulation.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-command-simulation.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-order-of-fire.1.description",
        id: "decision:academy-order-of-fire-1",
        kind: "chance",
        labelKey: "decisions:academy-order-of-fire.1.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-order-of-fire-1-failure",
        successOutcomeId: "outcome:academy-order-of-fire-1-success",
      },
      {
        descriptionKey: "decisions:academy-order-of-fire.2.description",
        id: "decision:academy-order-of-fire-2",
        kind: "safe",
        labelKey: "decisions:academy-order-of-fire.2.label",
        outcomeId: "outcome:academy-order-of-fire-2-success",
      },
      {
        descriptionKey: "decisions:academy-order-of-fire.3.description",
        id: "decision:academy-order-of-fire-3",
        kind: "chance",
        labelKey: "decisions:academy-order-of-fire.3.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "charisma",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-order-of-fire-3-failure",
        successOutcomeId: "outcome:academy-order-of-fire-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-order-of-fire",
    introductionKey: "narrative:academy-order-of-fire.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-order-of-fire.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-captured-cadet.1.description",
        id: "decision:academy-captured-cadet-1",
        kind: "safe",
        labelKey: "decisions:academy-captured-cadet.1.label",
        outcomeId: "outcome:academy-captured-cadet-1-success",
      },
      {
        descriptionKey: "decisions:academy-captured-cadet.2.description",
        id: "decision:academy-captured-cadet-2",
        kind: "chance",
        labelKey: "decisions:academy-captured-cadet.2.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.2,
          },
          {
            stat: "tactics",
            weight: 0.25,
          },
        ],
        failureOutcomeId: "outcome:academy-captured-cadet-2-failure",
        successOutcomeId: "outcome:academy-captured-cadet-2-success",
      },
      {
        descriptionKey: "decisions:academy-captured-cadet.3.description",
        id: "decision:academy-captured-cadet-3",
        kind: "chance",
        labelKey: "decisions:academy-captured-cadet.3.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-captured-cadet-3-failure",
        successOutcomeId: "outcome:academy-captured-cadet-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-captured-cadet",
    introductionKey: "narrative:academy-captured-cadet.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-captured-cadet.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-black-market.1.description",
        id: "decision:academy-black-market-1",
        kind: "chance",
        labelKey: "decisions:academy-black-market.1.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-black-market-1-failure",
        successOutcomeId: "outcome:academy-black-market-1-success",
      },
      {
        descriptionKey: "decisions:academy-black-market.2.description",
        id: "decision:academy-black-market-2",
        kind: "chance",
        labelKey: "decisions:academy-black-market.2.label",
        baseSuccessChance: 65,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-black-market-2-failure",
        successOutcomeId: "outcome:academy-black-market-2-success",
      },
      {
        descriptionKey: "decisions:academy-black-market.3.description",
        id: "decision:academy-black-market-3",
        kind: "safe",
        labelKey: "decisions:academy-black-market.3.label",
        outcomeId: "outcome:academy-black-market-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-black-market",
    introductionKey: "narrative:academy-black-market.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-black-market.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-organoid-rumor.1.description",
        id: "decision:academy-organoid-rumor-1",
        kind: "chance",
        labelKey: "decisions:academy-organoid-rumor.1.label",
        baseSuccessChance: 80,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-organoid-rumor-1-failure",
        successOutcomeId: "outcome:academy-organoid-rumor-1-success",
      },
      {
        descriptionKey: "decisions:academy-organoid-rumor.2.description",
        id: "decision:academy-organoid-rumor-2",
        kind: "chance",
        labelKey: "decisions:academy-organoid-rumor.2.label",
        baseSuccessChance: 20,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.25,
          },
          {
            stat: "synchrony",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-organoid-rumor-2-failure",
        successOutcomeId: "outcome:academy-organoid-rumor-2-success",
      },
      {
        descriptionKey: "decisions:academy-organoid-rumor.3.description",
        id: "decision:academy-organoid-rumor-3",
        kind: "safe",
        labelKey: "decisions:academy-organoid-rumor.3.label",
        outcomeId: "outcome:academy-organoid-rumor-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-organoid-rumor",
    introductionKey: "narrative:academy-organoid-rumor.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-organoid-rumor.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-magnetic-front.1.description",
        id: "decision:academy-magnetic-front-1",
        kind: "chance",
        labelKey: "decisions:academy-magnetic-front.1.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-magnetic-front-1-failure",
        successOutcomeId: "outcome:academy-magnetic-front-1-success",
      },
      {
        descriptionKey: "decisions:academy-magnetic-front.2.description",
        id: "decision:academy-magnetic-front-2",
        kind: "chance",
        labelKey: "decisions:academy-magnetic-front.2.label",
        baseSuccessChance: 70,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-magnetic-front-2-failure",
        successOutcomeId: "outcome:academy-magnetic-front-2-success",
      },
      {
        descriptionKey: "decisions:academy-magnetic-front.3.description",
        id: "decision:academy-magnetic-front-3",
        kind: "safe",
        labelKey: "decisions:academy-magnetic-front.3.label",
        outcomeId: "outcome:academy-magnetic-front-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-magnetic-front",
    introductionKey: "narrative:academy-magnetic-front.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-magnetic-front.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-minefield.1.description",
        id: "decision:academy-minefield-1",
        kind: "chance",
        labelKey: "decisions:academy-minefield.1.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.25,
          },
          {
            stat: "piloting",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-minefield-1-failure",
        successOutcomeId: "outcome:academy-minefield-1-success",
      },
      {
        descriptionKey: "decisions:academy-minefield.2.description",
        id: "decision:academy-minefield-2",
        kind: "safe",
        labelKey: "decisions:academy-minefield.2.label",
        outcomeId: "outcome:academy-minefield-2-success",
      },
      {
        descriptionKey: "decisions:academy-minefield.3.description",
        id: "decision:academy-minefield-3",
        kind: "chance",
        labelKey: "decisions:academy-minefield.3.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.2,
          },
          {
            stat: "tactics",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-minefield-3-failure",
        successOutcomeId: "outcome:academy-minefield-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-minefield",
    introductionKey: "narrative:academy-minefield.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-minefield.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-zi-tournament.1.description",
        id: "decision:academy-zi-tournament-1",
        kind: "chance",
        labelKey: "decisions:academy-zi-tournament.1.label",
        baseSuccessChance: 20,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.25,
          },
          {
            stat: "synchrony",
            weight: 0.25,
          },
        ],
        failureOutcomeId: "outcome:academy-zi-tournament-1-failure",
        successOutcomeId: "outcome:academy-zi-tournament-1-success",
      },
      {
        descriptionKey: "decisions:academy-zi-tournament.2.description",
        id: "decision:academy-zi-tournament-2",
        kind: "chance",
        labelKey: "decisions:academy-zi-tournament.2.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-zi-tournament-2-failure",
        successOutcomeId: "outcome:academy-zi-tournament-2-success",
      },
      {
        descriptionKey: "decisions:academy-zi-tournament.3.description",
        id: "decision:academy-zi-tournament-3",
        kind: "safe",
        labelKey: "decisions:academy-zi-tournament.3.label",
        outcomeId: "outcome:academy-zi-tournament-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-zi-tournament",
    introductionKey: "narrative:academy-zi-tournament.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-zi-tournament.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-joint-rescue.1.description",
        id: "decision:academy-joint-rescue-1",
        kind: "chance",
        labelKey: "decisions:academy-joint-rescue.1.label",
        baseSuccessChance: 70,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-joint-rescue-1-failure",
        successOutcomeId: "outcome:academy-joint-rescue-1-success",
      },
      {
        descriptionKey: "decisions:academy-joint-rescue.2.description",
        id: "decision:academy-joint-rescue-2",
        kind: "safe",
        labelKey: "decisions:academy-joint-rescue.2.label",
        outcomeId: "outcome:academy-joint-rescue-2-success",
      },
      {
        descriptionKey: "decisions:academy-joint-rescue.3.description",
        id: "decision:academy-joint-rescue-3",
        kind: "chance",
        labelKey: "decisions:academy-joint-rescue.3.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "charisma",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-joint-rescue-3-failure",
        successOutcomeId: "outcome:academy-joint-rescue-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-joint-rescue",
    introductionKey: "narrative:academy-joint-rescue.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-joint-rescue.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-prototype-test.1.description",
        id: "decision:academy-prototype-test-1",
        kind: "chance",
        labelKey: "decisions:academy-prototype-test.1.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-prototype-test-1-failure",
        successOutcomeId: "outcome:academy-prototype-test-1-success",
      },
      {
        descriptionKey: "decisions:academy-prototype-test.2.description",
        id: "decision:academy-prototype-test-2",
        kind: "chance",
        labelKey: "decisions:academy-prototype-test.2.label",
        baseSuccessChance: 75,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-prototype-test-2-failure",
        successOutcomeId: "outcome:academy-prototype-test-2-success",
      },
      {
        descriptionKey: "decisions:academy-prototype-test.3.description",
        id: "decision:academy-prototype-test-3",
        kind: "safe",
        labelKey: "decisions:academy-prototype-test.3.label",
        outcomeId: "outcome:academy-prototype-test-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-prototype-test",
    introductionKey: "narrative:academy-prototype-test.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-prototype-test.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-sleeper-hunt.1.description",
        id: "decision:academy-sleeper-hunt-1",
        kind: "chance",
        labelKey: "decisions:academy-sleeper-hunt.1.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "technique",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-sleeper-hunt-1-failure",
        successOutcomeId: "outcome:academy-sleeper-hunt-1-success",
      },
      {
        descriptionKey: "decisions:academy-sleeper-hunt.2.description",
        id: "decision:academy-sleeper-hunt-2",
        kind: "chance",
        labelKey: "decisions:academy-sleeper-hunt.2.label",
        baseSuccessChance: 35,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-sleeper-hunt-2-failure",
        successOutcomeId: "outcome:academy-sleeper-hunt-2-success",
      },
      {
        descriptionKey: "decisions:academy-sleeper-hunt.3.description",
        id: "decision:academy-sleeper-hunt-3",
        kind: "safe",
        labelKey: "decisions:academy-sleeper-hunt.3.label",
        outcomeId: "outcome:academy-sleeper-hunt-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-sleeper-hunt",
    introductionKey: "narrative:academy-sleeper-hunt.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-sleeper-hunt.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-two-seat-drill.1.description",
        id: "decision:academy-two-seat-drill-1",
        kind: "chance",
        labelKey: "decisions:academy-two-seat-drill.1.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "charisma",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-two-seat-drill-1-failure",
        successOutcomeId: "outcome:academy-two-seat-drill-1-success",
      },
      {
        descriptionKey: "decisions:academy-two-seat-drill.2.description",
        id: "decision:academy-two-seat-drill-2",
        kind: "chance",
        labelKey: "decisions:academy-two-seat-drill.2.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-two-seat-drill-2-failure",
        successOutcomeId: "outcome:academy-two-seat-drill-2-success",
      },
      {
        descriptionKey: "decisions:academy-two-seat-drill.3.description",
        id: "decision:academy-two-seat-drill-3",
        kind: "safe",
        labelKey: "decisions:academy-two-seat-drill.3.label",
        outcomeId: "outcome:academy-two-seat-drill-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-two-seat-drill",
    introductionKey: "narrative:academy-two-seat-drill.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-two-seat-drill.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-reconstruction-detail.1.description",
        id: "decision:academy-reconstruction-detail-1",
        kind: "chance",
        labelKey: "decisions:academy-reconstruction-detail.1.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-reconstruction-detail-1-failure",
        successOutcomeId: "outcome:academy-reconstruction-detail-1-success",
      },
      {
        descriptionKey: "decisions:academy-reconstruction-detail.2.description",
        id: "decision:academy-reconstruction-detail-2",
        kind: "chance",
        labelKey: "decisions:academy-reconstruction-detail.2.label",
        baseSuccessChance: 75,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "strength",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-reconstruction-detail-2-failure",
        successOutcomeId: "outcome:academy-reconstruction-detail-2-success",
      },
      {
        descriptionKey: "decisions:academy-reconstruction-detail.3.description",
        id: "decision:academy-reconstruction-detail-3",
        kind: "safe",
        labelKey: "decisions:academy-reconstruction-detail.3.label",
        outcomeId: "outcome:academy-reconstruction-detail-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-reconstruction-detail",
    introductionKey: "narrative:academy-reconstruction-detail.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-reconstruction-detail.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-desert-survival.1.description",
        id: "decision:academy-desert-survival-1",
        kind: "chance",
        labelKey: "decisions:academy-desert-survival.1.label",
        baseSuccessChance: 65,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.25,
          },
          {
            stat: "strength",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-desert-survival-1-failure",
        successOutcomeId: "outcome:academy-desert-survival-1-success",
      },
      {
        descriptionKey: "decisions:academy-desert-survival.2.description",
        id: "decision:academy-desert-survival-2",
        kind: "chance",
        labelKey: "decisions:academy-desert-survival.2.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "synchrony",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-desert-survival-2-failure",
        successOutcomeId: "outcome:academy-desert-survival-2-success",
      },
      {
        descriptionKey: "decisions:academy-desert-survival.3.description",
        id: "decision:academy-desert-survival-3",
        kind: "safe",
        labelKey: "decisions:academy-desert-survival.3.label",
        outcomeId: "outcome:academy-desert-survival-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-desert-survival",
    introductionKey: "narrative:academy-desert-survival.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-desert-survival.title",
  },
  {
    ages: [14],
    decisions: [
      {
        descriptionKey: "decisions:academy-front-observer.1.description",
        id: "decision:academy-front-observer-1",
        kind: "chance",
        labelKey: "decisions:academy-front-observer.1.label",
        baseSuccessChance: 10,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.3,
          },
          {
            stat: "piloting",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-front-observer-1-failure",
        successOutcomeId: "outcome:academy-front-observer-1-success",
      },
      {
        descriptionKey: "decisions:academy-front-observer.2.description",
        id: "decision:academy-front-observer-2",
        kind: "chance",
        labelKey: "decisions:academy-front-observer.2.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-front-observer-2-failure",
        successOutcomeId: "outcome:academy-front-observer-2-success",
      },
      {
        descriptionKey: "decisions:academy-front-observer.3.description",
        id: "decision:academy-front-observer-3",
        kind: "safe",
        labelKey: "decisions:academy-front-observer.3.label",
        outcomeId: "outcome:academy-front-observer-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-front-observer",
    introductionKey: "narrative:academy-front-observer.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-front-observer.title",
  },
  {
    ages: [14],
    decisions: [
      {
        descriptionKey: "decisions:academy-final-board.1.description",
        id: "decision:academy-final-board-1",
        kind: "chance",
        labelKey: "decisions:academy-final-board.1.label",
        baseSuccessChance: 30,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.3,
          },
          {
            stat: "synchrony",
            weight: 0.25,
          },
        ],
        failureOutcomeId: "outcome:academy-final-board-1-failure",
        successOutcomeId: "outcome:academy-final-board-1-success",
      },
      {
        descriptionKey: "decisions:academy-final-board.2.description",
        id: "decision:academy-final-board-2",
        kind: "chance",
        labelKey: "decisions:academy-final-board.2.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-final-board-2-failure",
        successOutcomeId: "outcome:academy-final-board-2-success",
      },
      {
        descriptionKey: "decisions:academy-final-board.3.description",
        id: "decision:academy-final-board-3",
        kind: "chance",
        labelKey: "decisions:academy-final-board.3.label",
        baseSuccessChance: 70,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.2,
          },
          {
            stat: "technique",
            weight: 0.3,
          },
        ],
        failureOutcomeId: "outcome:academy-final-board-3-failure",
        successOutcomeId: "outcome:academy-final-board-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-final-board",
    introductionKey: "narrative:academy-final-board.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-final-board.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-date-invitation.1.description",
        id: "decision:academy-date-invitation-1",
        kind: "chance",
        labelKey: "decisions:academy-date-invitation.1.label",
        baseSuccessChance: 35,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.3,
          },
        ],
        failureOutcomeId: "outcome:academy-date-invitation-1-failure",
        successOutcomeId: "outcome:academy-date-invitation-1-success",
      },
      {
        descriptionKey: "decisions:academy-date-invitation.2.description",
        id: "decision:academy-date-invitation-2",
        kind: "chance",
        labelKey: "decisions:academy-date-invitation.2.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "technique",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-date-invitation-2-failure",
        successOutcomeId: "outcome:academy-date-invitation-2-success",
      },
      {
        descriptionKey: "decisions:academy-date-invitation.3.description",
        id: "decision:academy-date-invitation-3",
        kind: "safe",
        labelKey: "decisions:academy-date-invitation.3.label",
        outcomeId: "outcome:academy-date-invitation-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-date-invitation",
    introductionKey: "narrative:academy-date-invitation.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-date-invitation.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-instructor-conflict.1.description",
        id: "decision:academy-instructor-conflict-1",
        kind: "chance",
        labelKey: "decisions:academy-instructor-conflict.1.label",
        baseSuccessChance: 70,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.2,
          },
          {
            stat: "charisma",
            weight: 0.3,
          },
        ],
        failureOutcomeId: "outcome:academy-instructor-conflict-1-failure",
        successOutcomeId: "outcome:academy-instructor-conflict-1-success",
      },
      {
        descriptionKey: "decisions:academy-instructor-conflict.2.description",
        id: "decision:academy-instructor-conflict-2",
        kind: "chance",
        labelKey: "decisions:academy-instructor-conflict.2.label",
        baseSuccessChance: 45,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "piloting",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-instructor-conflict-2-failure",
        successOutcomeId: "outcome:academy-instructor-conflict-2-success",
      },
      {
        descriptionKey: "decisions:academy-instructor-conflict.3.description",
        id: "decision:academy-instructor-conflict-3",
        kind: "safe",
        labelKey: "decisions:academy-instructor-conflict.3.label",
        outcomeId: "outcome:academy-instructor-conflict-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-instructor-conflict",
    introductionKey: "narrative:academy-instructor-conflict.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-instructor-conflict.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-cadet-conflict.1.description",
        id: "decision:academy-cadet-conflict-1",
        kind: "chance",
        labelKey: "decisions:academy-cadet-conflict.1.label",
        baseSuccessChance: 40,
        probabilityStats: [
          {
            stat: "charisma",
            weight: 0.25,
          },
          {
            stat: "strength",
            weight: 0.15,
          },
        ],
        failureOutcomeId: "outcome:academy-cadet-conflict-1-failure",
        successOutcomeId: "outcome:academy-cadet-conflict-1-success",
      },
      {
        descriptionKey: "decisions:academy-cadet-conflict.2.description",
        id: "decision:academy-cadet-conflict-2",
        kind: "chance",
        labelKey: "decisions:academy-cadet-conflict.2.label",
        baseSuccessChance: 60,
        probabilityStats: [
          {
            stat: "piloting",
            weight: 0.25,
          },
          {
            stat: "synchrony",
            weight: 0.2,
          },
        ],
        failureOutcomeId: "outcome:academy-cadet-conflict-2-failure",
        successOutcomeId: "outcome:academy-cadet-conflict-2-success",
      },
      {
        descriptionKey: "decisions:academy-cadet-conflict.3.description",
        id: "decision:academy-cadet-conflict-3",
        kind: "safe",
        labelKey: "decisions:academy-cadet-conflict.3.label",
        outcomeId: "outcome:academy-cadet-conflict-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-cadet-conflict",
    introductionKey: "narrative:academy-cadet-conflict.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-cadet-conflict.title",
  },
  {
    ages: [13, 14],
    decisions: [
      {
        descriptionKey: "decisions:academy-cheating-witness.1.description",
        id: "decision:academy-cheating-witness-1",
        kind: "safe",
        labelKey: "decisions:academy-cheating-witness.1.label",
        outcomeId: "outcome:academy-cheating-witness-1-success",
      },
      {
        descriptionKey: "decisions:academy-cheating-witness.2.description",
        id: "decision:academy-cheating-witness-2",
        kind: "chance",
        labelKey: "decisions:academy-cheating-witness.2.label",
        baseSuccessChance: 75,
        probabilityStats: [
          {
            stat: "technique",
            weight: 0.3,
          },
          {
            stat: "tactics",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-cheating-witness-2-failure",
        successOutcomeId: "outcome:academy-cheating-witness-2-success",
      },
      {
        descriptionKey: "decisions:academy-cheating-witness.3.description",
        id: "decision:academy-cheating-witness-3",
        kind: "chance",
        labelKey: "decisions:academy-cheating-witness.3.label",
        baseSuccessChance: 50,
        probabilityStats: [
          {
            stat: "tactics",
            weight: 0.2,
          },
          {
            stat: "charisma",
            weight: 0.1,
          },
        ],
        failureOutcomeId: "outcome:academy-cheating-witness-3-failure",
        successOutcomeId: "outcome:academy-cheating-witness-3-success",
      },
    ],
    factions: ["guylos", "helic"],
    id: "event:academy-cheating-witness",
    introductionKey: "narrative:academy-cheating-witness.introduction",
    requiresZoid: true,
    titleKey: "narrative:academy-cheating-witness.title",
  },
] as unknown as readonly DecisionEvent[];
