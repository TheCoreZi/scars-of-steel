import type { Outcome, OutcomeId } from "./types";

export const academyOutcomeCatalog = {
  "outcome:academy-synchrony-test-1-failure": {
    effects: [
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
    id: "outcome:academy-synchrony-test-1-failure",
    narrativeKey: "outcomes:academy-synchrony-test.1.failure",
  },
  "outcome:academy-synchrony-test-1-success": {
    effects: [
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
    id: "outcome:academy-synchrony-test-1-success",
    narrativeKey: "outcomes:academy-synchrony-test.1.success",
  },
  "outcome:academy-synchrony-test-2-success": {
    effects: [
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
    id: "outcome:academy-synchrony-test-2-success",
    narrativeKey: "outcomes:academy-synchrony-test.2.success",
  },
  "outcome:academy-synchrony-test-3-failure": {
    effects: [
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
    id: "outcome:academy-synchrony-test-3-failure",
    narrativeKey: "outcomes:academy-synchrony-test.3.failure",
  },
  "outcome:academy-synchrony-test-3-success": {
    effects: [
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
    id: "outcome:academy-synchrony-test-3-success",
    narrativeKey: "outcomes:academy-synchrony-test.3.success",
  },
  "outcome:academy-convoy-detail-1-failure": {
    effects: [
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
    id: "outcome:academy-convoy-detail-1-failure",
    narrativeKey: "outcomes:academy-convoy-detail.1.failure",
  },
  "outcome:academy-convoy-detail-1-success": {
    effects: [
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
    id: "outcome:academy-convoy-detail-1-success",
    narrativeKey: "outcomes:academy-convoy-detail.1.success",
  },
  "outcome:academy-convoy-detail-2-success": {
    effects: [
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
    id: "outcome:academy-convoy-detail-2-success",
    narrativeKey: "outcomes:academy-convoy-detail.2.success",
  },
  "outcome:academy-convoy-detail-3-failure": {
    effects: [
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
    id: "outcome:academy-convoy-detail-3-failure",
    narrativeKey: "outcomes:academy-convoy-detail.3.failure",
  },
  "outcome:academy-convoy-detail-3-success": {
    effects: [
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
    id: "outcome:academy-convoy-detail-3-success",
    narrativeKey: "outcomes:academy-convoy-detail.3.success",
  },
  "outcome:academy-wild-migration-1-failure": {
    effects: [
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
    id: "outcome:academy-wild-migration-1-failure",
    narrativeKey: "outcomes:academy-wild-migration.1.failure",
  },
  "outcome:academy-wild-migration-1-success": {
    effects: [
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
    id: "outcome:academy-wild-migration-1-success",
    narrativeKey: "outcomes:academy-wild-migration.1.success",
  },
  "outcome:academy-wild-migration-2-success": {
    effects: [
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
    id: "outcome:academy-wild-migration-2-success",
    narrativeKey: "outcomes:academy-wild-migration.2.success",
  },
  "outcome:academy-wild-migration-3-failure": {
    effects: [
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
    id: "outcome:academy-wild-migration-3-failure",
    narrativeKey: "outcomes:academy-wild-migration.3.failure",
  },
  "outcome:academy-wild-migration-3-success": {
    effects: [
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
    id: "outcome:academy-wild-migration-3-success",
    narrativeKey: "outcomes:academy-wild-migration.3.success",
  },
  "outcome:academy-ruins-survey-1-success": {
    effects: [
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
    id: "outcome:academy-ruins-survey-1-success",
    narrativeKey: "outcomes:academy-ruins-survey.1.success",
  },
  "outcome:academy-ruins-survey-2-failure": {
    effects: [
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
    id: "outcome:academy-ruins-survey-2-failure",
    narrativeKey: "outcomes:academy-ruins-survey.2.failure",
  },
  "outcome:academy-ruins-survey-2-success": {
    effects: [
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
    id: "outcome:academy-ruins-survey-2-success",
    narrativeKey: "outcomes:academy-ruins-survey.2.success",
  },
  "outcome:academy-ruins-survey-3-failure": {
    effects: [
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
    id: "outcome:academy-ruins-survey-3-failure",
    narrativeKey: "outcomes:academy-ruins-survey.3.failure",
  },
  "outcome:academy-ruins-survey-3-success": {
    effects: [
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
    id: "outcome:academy-ruins-survey-3-success",
    narrativeKey: "outcomes:academy-ruins-survey.3.success",
  },
  "outcome:academy-red-rust-storm-1-failure": {
    effects: [
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
    id: "outcome:academy-red-rust-storm-1-failure",
    narrativeKey: "outcomes:academy-red-rust-storm.1.failure",
  },
  "outcome:academy-red-rust-storm-1-success": {
    effects: [
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
    id: "outcome:academy-red-rust-storm-1-success",
    narrativeKey: "outcomes:academy-red-rust-storm.1.success",
  },
  "outcome:academy-red-rust-storm-2-failure": {
    effects: [
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
    id: "outcome:academy-red-rust-storm-2-failure",
    narrativeKey: "outcomes:academy-red-rust-storm.2.failure",
  },
  "outcome:academy-red-rust-storm-2-success": {
    effects: [
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
    id: "outcome:academy-red-rust-storm-2-success",
    narrativeKey: "outcomes:academy-red-rust-storm.2.success",
  },
  "outcome:academy-red-rust-storm-3-success": {
    effects: [
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
    id: "outcome:academy-red-rust-storm-3-success",
    narrativeKey: "outcomes:academy-red-rust-storm.3.success",
  },
  "outcome:academy-rival-challenge-1-failure": {
    effects: [
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
    id: "outcome:academy-rival-challenge-1-failure",
    narrativeKey: "outcomes:academy-rival-challenge.1.failure",
  },
  "outcome:academy-rival-challenge-1-success": {
    effects: [
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
    id: "outcome:academy-rival-challenge-1-success",
    narrativeKey: "outcomes:academy-rival-challenge.1.success",
  },
  "outcome:academy-rival-challenge-2-failure": {
    effects: [
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
    id: "outcome:academy-rival-challenge-2-failure",
    narrativeKey: "outcomes:academy-rival-challenge.2.failure",
  },
  "outcome:academy-rival-challenge-2-success": {
    effects: [
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
    id: "outcome:academy-rival-challenge-2-success",
    narrativeKey: "outcomes:academy-rival-challenge.2.success",
  },
  "outcome:academy-rival-challenge-3-success": {
    effects: [
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
    id: "outcome:academy-rival-challenge-3-success",
    narrativeKey: "outcomes:academy-rival-challenge.3.success",
  },
  "outcome:academy-night-infiltration-1-failure": {
    effects: [
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
    id: "outcome:academy-night-infiltration-1-failure",
    narrativeKey: "outcomes:academy-night-infiltration.1.failure",
  },
  "outcome:academy-night-infiltration-1-success": {
    effects: [
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
    id: "outcome:academy-night-infiltration-1-success",
    narrativeKey: "outcomes:academy-night-infiltration.1.success",
  },
  "outcome:academy-night-infiltration-2-failure": {
    effects: [
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
    id: "outcome:academy-night-infiltration-2-failure",
    narrativeKey: "outcomes:academy-night-infiltration.2.failure",
  },
  "outcome:academy-night-infiltration-2-success": {
    effects: [
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
    id: "outcome:academy-night-infiltration-2-success",
    narrativeKey: "outcomes:academy-night-infiltration.2.success",
  },
  "outcome:academy-night-infiltration-3-success": {
    effects: [
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
    id: "outcome:academy-night-infiltration-3-success",
    narrativeKey: "outcomes:academy-night-infiltration.3.success",
  },
  "outcome:academy-salvo-malfunction-1-failure": {
    effects: [
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
    id: "outcome:academy-salvo-malfunction-1-failure",
    narrativeKey: "outcomes:academy-salvo-malfunction.1.failure",
  },
  "outcome:academy-salvo-malfunction-1-success": {
    effects: [
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
    id: "outcome:academy-salvo-malfunction-1-success",
    narrativeKey: "outcomes:academy-salvo-malfunction.1.success",
  },
  "outcome:academy-salvo-malfunction-2-failure": {
    effects: [
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
    id: "outcome:academy-salvo-malfunction-2-failure",
    narrativeKey: "outcomes:academy-salvo-malfunction.2.failure",
  },
  "outcome:academy-salvo-malfunction-2-success": {
    effects: [
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
    id: "outcome:academy-salvo-malfunction-2-success",
    narrativeKey: "outcomes:academy-salvo-malfunction.2.success",
  },
  "outcome:academy-salvo-malfunction-3-success": {
    effects: [
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
    id: "outcome:academy-salvo-malfunction-3-success",
    narrativeKey: "outcomes:academy-salvo-malfunction.3.success",
  },
  "outcome:academy-core-fever-1-success": {
    effects: [
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
    id: "outcome:academy-core-fever-1-success",
    narrativeKey: "outcomes:academy-core-fever.1.success",
  },
  "outcome:academy-core-fever-2-failure": {
    effects: [
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
    id: "outcome:academy-core-fever-2-failure",
    narrativeKey: "outcomes:academy-core-fever.2.failure",
  },
  "outcome:academy-core-fever-2-success": {
    effects: [
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
    id: "outcome:academy-core-fever-2-success",
    narrativeKey: "outcomes:academy-core-fever.2.success",
  },
  "outcome:academy-core-fever-3-success": {
    effects: [
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
    id: "outcome:academy-core-fever-3-success",
    narrativeKey: "outcomes:academy-core-fever.3.success",
  },
  "outcome:academy-refugee-train-1-failure": {
    effects: [
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
    id: "outcome:academy-refugee-train-1-failure",
    narrativeKey: "outcomes:academy-refugee-train.1.failure",
  },
  "outcome:academy-refugee-train-1-success": {
    effects: [
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
    id: "outcome:academy-refugee-train-1-success",
    narrativeKey: "outcomes:academy-refugee-train.1.success",
  },
  "outcome:academy-refugee-train-2-failure": {
    effects: [
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
    id: "outcome:academy-refugee-train-2-failure",
    narrativeKey: "outcomes:academy-refugee-train.2.failure",
  },
  "outcome:academy-refugee-train-2-success": {
    effects: [
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
    id: "outcome:academy-refugee-train-2-success",
    narrativeKey: "outcomes:academy-refugee-train.2.success",
  },
  "outcome:academy-refugee-train-3-success": {
    effects: [
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
    id: "outcome:academy-refugee-train-3-success",
    narrativeKey: "outcomes:academy-refugee-train.3.success",
  },
  "outcome:academy-salvage-yard-1-success": {
    effects: [
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
    id: "outcome:academy-salvage-yard-1-success",
    narrativeKey: "outcomes:academy-salvage-yard.1.success",
  },
  "outcome:academy-salvage-yard-2-failure": {
    effects: [
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
    id: "outcome:academy-salvage-yard-2-failure",
    narrativeKey: "outcomes:academy-salvage-yard.2.failure",
  },
  "outcome:academy-salvage-yard-2-success": {
    effects: [
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
    id: "outcome:academy-salvage-yard-2-success",
    narrativeKey: "outcomes:academy-salvage-yard.2.success",
  },
  "outcome:academy-salvage-yard-3-failure": {
    effects: [
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
    id: "outcome:academy-salvage-yard-3-failure",
    narrativeKey: "outcomes:academy-salvage-yard.3.failure",
  },
  "outcome:academy-salvage-yard-3-success": {
    effects: [
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
    id: "outcome:academy-salvage-yard-3-success",
    narrativeKey: "outcomes:academy-salvage-yard.3.success",
  },
  "outcome:academy-intercepted-signal-1-success": {
    effects: [
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
    id: "outcome:academy-intercepted-signal-1-success",
    narrativeKey: "outcomes:academy-intercepted-signal.1.success",
  },
  "outcome:academy-intercepted-signal-2-failure": {
    effects: [
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
    id: "outcome:academy-intercepted-signal-2-failure",
    narrativeKey: "outcomes:academy-intercepted-signal.2.failure",
  },
  "outcome:academy-intercepted-signal-2-success": {
    effects: [
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
    id: "outcome:academy-intercepted-signal-2-success",
    narrativeKey: "outcomes:academy-intercepted-signal.2.success",
  },
  "outcome:academy-intercepted-signal-3-failure": {
    effects: [
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
    id: "outcome:academy-intercepted-signal-3-failure",
    narrativeKey: "outcomes:academy-intercepted-signal.3.failure",
  },
  "outcome:academy-intercepted-signal-3-success": {
    effects: [
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
    id: "outcome:academy-intercepted-signal-3-success",
    narrativeKey: "outcomes:academy-intercepted-signal.3.success",
  },
  "outcome:academy-amphibious-course-1-success": {
    effects: [
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
    id: "outcome:academy-amphibious-course-1-success",
    narrativeKey: "outcomes:academy-amphibious-course.1.success",
  },
  "outcome:academy-amphibious-course-2-failure": {
    effects: [
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
    id: "outcome:academy-amphibious-course-2-failure",
    narrativeKey: "outcomes:academy-amphibious-course.2.failure",
  },
  "outcome:academy-amphibious-course-2-success": {
    effects: [
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
    id: "outcome:academy-amphibious-course-2-success",
    narrativeKey: "outcomes:academy-amphibious-course.2.success",
  },
  "outcome:academy-amphibious-course-3-failure": {
    effects: [
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
    id: "outcome:academy-amphibious-course-3-failure",
    narrativeKey: "outcomes:academy-amphibious-course.3.failure",
  },
  "outcome:academy-amphibious-course-3-success": {
    effects: [
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
    id: "outcome:academy-amphibious-course-3-success",
    narrativeKey: "outcomes:academy-amphibious-course.3.success",
  },
  "outcome:academy-flight-selection-1-failure": {
    effects: [
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
    id: "outcome:academy-flight-selection-1-failure",
    narrativeKey: "outcomes:academy-flight-selection.1.failure",
  },
  "outcome:academy-flight-selection-1-success": {
    effects: [
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
    id: "outcome:academy-flight-selection-1-success",
    narrativeKey: "outcomes:academy-flight-selection.1.success",
  },
  "outcome:academy-flight-selection-2-failure": {
    effects: [
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
    id: "outcome:academy-flight-selection-2-failure",
    narrativeKey: "outcomes:academy-flight-selection.2.failure",
  },
  "outcome:academy-flight-selection-2-success": {
    effects: [
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
    id: "outcome:academy-flight-selection-2-success",
    narrativeKey: "outcomes:academy-flight-selection.2.success",
  },
  "outcome:academy-flight-selection-3-success": {
    effects: [
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
    id: "outcome:academy-flight-selection-3-success",
    narrativeKey: "outcomes:academy-flight-selection.3.success",
  },
  "outcome:academy-command-simulation-1-failure": {
    effects: [
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
    id: "outcome:academy-command-simulation-1-failure",
    narrativeKey: "outcomes:academy-command-simulation.1.failure",
  },
  "outcome:academy-command-simulation-1-success": {
    effects: [
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
    id: "outcome:academy-command-simulation-1-success",
    narrativeKey: "outcomes:academy-command-simulation.1.success",
  },
  "outcome:academy-command-simulation-2-failure": {
    effects: [
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
    id: "outcome:academy-command-simulation-2-failure",
    narrativeKey: "outcomes:academy-command-simulation.2.failure",
  },
  "outcome:academy-command-simulation-2-success": {
    effects: [
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
    id: "outcome:academy-command-simulation-2-success",
    narrativeKey: "outcomes:academy-command-simulation.2.success",
  },
  "outcome:academy-command-simulation-3-success": {
    effects: [
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
    id: "outcome:academy-command-simulation-3-success",
    narrativeKey: "outcomes:academy-command-simulation.3.success",
  },
  "outcome:academy-order-of-fire-1-failure": {
    effects: [
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
    id: "outcome:academy-order-of-fire-1-failure",
    narrativeKey: "outcomes:academy-order-of-fire.1.failure",
  },
  "outcome:academy-order-of-fire-1-success": {
    effects: [
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
    id: "outcome:academy-order-of-fire-1-success",
    narrativeKey: "outcomes:academy-order-of-fire.1.success",
  },
  "outcome:academy-order-of-fire-2-success": {
    effects: [
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
    id: "outcome:academy-order-of-fire-2-success",
    narrativeKey: "outcomes:academy-order-of-fire.2.success",
  },
  "outcome:academy-order-of-fire-3-failure": {
    effects: [
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
    id: "outcome:academy-order-of-fire-3-failure",
    narrativeKey: "outcomes:academy-order-of-fire.3.failure",
  },
  "outcome:academy-order-of-fire-3-success": {
    effects: [
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
    id: "outcome:academy-order-of-fire-3-success",
    narrativeKey: "outcomes:academy-order-of-fire.3.success",
  },
  "outcome:academy-captured-cadet-1-success": {
    effects: [
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
    id: "outcome:academy-captured-cadet-1-success",
    narrativeKey: "outcomes:academy-captured-cadet.1.success",
  },
  "outcome:academy-captured-cadet-2-failure": {
    effects: [
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
    id: "outcome:academy-captured-cadet-2-failure",
    narrativeKey: "outcomes:academy-captured-cadet.2.failure",
  },
  "outcome:academy-captured-cadet-2-success": {
    effects: [
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
    id: "outcome:academy-captured-cadet-2-success",
    narrativeKey: "outcomes:academy-captured-cadet.2.success",
  },
  "outcome:academy-captured-cadet-3-failure": {
    effects: [
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
    id: "outcome:academy-captured-cadet-3-failure",
    narrativeKey: "outcomes:academy-captured-cadet.3.failure",
  },
  "outcome:academy-captured-cadet-3-success": {
    effects: [
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
    id: "outcome:academy-captured-cadet-3-success",
    narrativeKey: "outcomes:academy-captured-cadet.3.success",
  },
  "outcome:academy-black-market-1-failure": {
    effects: [
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
    id: "outcome:academy-black-market-1-failure",
    narrativeKey: "outcomes:academy-black-market.1.failure",
  },
  "outcome:academy-black-market-1-success": {
    effects: [
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
    id: "outcome:academy-black-market-1-success",
    narrativeKey: "outcomes:academy-black-market.1.success",
  },
  "outcome:academy-black-market-2-failure": {
    effects: [
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
    id: "outcome:academy-black-market-2-failure",
    narrativeKey: "outcomes:academy-black-market.2.failure",
  },
  "outcome:academy-black-market-2-success": {
    effects: [
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
    id: "outcome:academy-black-market-2-success",
    narrativeKey: "outcomes:academy-black-market.2.success",
  },
  "outcome:academy-black-market-3-success": {
    effects: [
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
    id: "outcome:academy-black-market-3-success",
    narrativeKey: "outcomes:academy-black-market.3.success",
  },
  "outcome:academy-organoid-rumor-1-failure": {
    effects: [
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
    id: "outcome:academy-organoid-rumor-1-failure",
    narrativeKey: "outcomes:academy-organoid-rumor.1.failure",
  },
  "outcome:academy-organoid-rumor-1-success": {
    effects: [
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
    id: "outcome:academy-organoid-rumor-1-success",
    narrativeKey: "outcomes:academy-organoid-rumor.1.success",
  },
  "outcome:academy-organoid-rumor-2-failure": {
    effects: [
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
    id: "outcome:academy-organoid-rumor-2-failure",
    narrativeKey: "outcomes:academy-organoid-rumor.2.failure",
  },
  "outcome:academy-organoid-rumor-2-success": {
    effects: [
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
    id: "outcome:academy-organoid-rumor-2-success",
    narrativeKey: "outcomes:academy-organoid-rumor.2.success",
  },
  "outcome:academy-organoid-rumor-3-success": {
    effects: [
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
    id: "outcome:academy-organoid-rumor-3-success",
    narrativeKey: "outcomes:academy-organoid-rumor.3.success",
  },
  "outcome:academy-magnetic-front-1-failure": {
    effects: [
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
    id: "outcome:academy-magnetic-front-1-failure",
    narrativeKey: "outcomes:academy-magnetic-front.1.failure",
  },
  "outcome:academy-magnetic-front-1-success": {
    effects: [
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
    id: "outcome:academy-magnetic-front-1-success",
    narrativeKey: "outcomes:academy-magnetic-front.1.success",
  },
  "outcome:academy-magnetic-front-2-failure": {
    effects: [
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
    id: "outcome:academy-magnetic-front-2-failure",
    narrativeKey: "outcomes:academy-magnetic-front.2.failure",
  },
  "outcome:academy-magnetic-front-2-success": {
    effects: [
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
    id: "outcome:academy-magnetic-front-2-success",
    narrativeKey: "outcomes:academy-magnetic-front.2.success",
  },
  "outcome:academy-magnetic-front-3-success": {
    effects: [
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
    id: "outcome:academy-magnetic-front-3-success",
    narrativeKey: "outcomes:academy-magnetic-front.3.success",
  },
  "outcome:academy-minefield-1-failure": {
    effects: [
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
    id: "outcome:academy-minefield-1-failure",
    narrativeKey: "outcomes:academy-minefield.1.failure",
  },
  "outcome:academy-minefield-1-success": {
    effects: [
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
    id: "outcome:academy-minefield-1-success",
    narrativeKey: "outcomes:academy-minefield.1.success",
  },
  "outcome:academy-minefield-2-success": {
    effects: [
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
    id: "outcome:academy-minefield-2-success",
    narrativeKey: "outcomes:academy-minefield.2.success",
  },
  "outcome:academy-minefield-3-failure": {
    effects: [
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
    id: "outcome:academy-minefield-3-failure",
    narrativeKey: "outcomes:academy-minefield.3.failure",
  },
  "outcome:academy-minefield-3-success": {
    effects: [
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
    id: "outcome:academy-minefield-3-success",
    narrativeKey: "outcomes:academy-minefield.3.success",
  },
  "outcome:academy-zi-tournament-1-failure": {
    effects: [
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
    id: "outcome:academy-zi-tournament-1-failure",
    narrativeKey: "outcomes:academy-zi-tournament.1.failure",
  },
  "outcome:academy-zi-tournament-1-success": {
    effects: [
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
    id: "outcome:academy-zi-tournament-1-success",
    narrativeKey: "outcomes:academy-zi-tournament.1.success",
  },
  "outcome:academy-zi-tournament-2-failure": {
    effects: [
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
    id: "outcome:academy-zi-tournament-2-failure",
    narrativeKey: "outcomes:academy-zi-tournament.2.failure",
  },
  "outcome:academy-zi-tournament-2-success": {
    effects: [
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
    id: "outcome:academy-zi-tournament-2-success",
    narrativeKey: "outcomes:academy-zi-tournament.2.success",
  },
  "outcome:academy-zi-tournament-3-success": {
    effects: [
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
    id: "outcome:academy-zi-tournament-3-success",
    narrativeKey: "outcomes:academy-zi-tournament.3.success",
  },
  "outcome:academy-joint-rescue-1-failure": {
    effects: [
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
    id: "outcome:academy-joint-rescue-1-failure",
    narrativeKey: "outcomes:academy-joint-rescue.1.failure",
  },
  "outcome:academy-joint-rescue-1-success": {
    effects: [
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
    id: "outcome:academy-joint-rescue-1-success",
    narrativeKey: "outcomes:academy-joint-rescue.1.success",
  },
  "outcome:academy-joint-rescue-2-success": {
    effects: [
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
    id: "outcome:academy-joint-rescue-2-success",
    narrativeKey: "outcomes:academy-joint-rescue.2.success",
  },
  "outcome:academy-joint-rescue-3-failure": {
    effects: [
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
    id: "outcome:academy-joint-rescue-3-failure",
    narrativeKey: "outcomes:academy-joint-rescue.3.failure",
  },
  "outcome:academy-joint-rescue-3-success": {
    effects: [
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
    id: "outcome:academy-joint-rescue-3-success",
    narrativeKey: "outcomes:academy-joint-rescue.3.success",
  },
  "outcome:academy-prototype-test-1-failure": {
    effects: [
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
    id: "outcome:academy-prototype-test-1-failure",
    narrativeKey: "outcomes:academy-prototype-test.1.failure",
  },
  "outcome:academy-prototype-test-1-success": {
    effects: [
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
    id: "outcome:academy-prototype-test-1-success",
    narrativeKey: "outcomes:academy-prototype-test.1.success",
  },
  "outcome:academy-prototype-test-2-failure": {
    effects: [
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
    id: "outcome:academy-prototype-test-2-failure",
    narrativeKey: "outcomes:academy-prototype-test.2.failure",
  },
  "outcome:academy-prototype-test-2-success": {
    effects: [
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
    id: "outcome:academy-prototype-test-2-success",
    narrativeKey: "outcomes:academy-prototype-test.2.success",
  },
  "outcome:academy-prototype-test-3-success": {
    effects: [
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
    id: "outcome:academy-prototype-test-3-success",
    narrativeKey: "outcomes:academy-prototype-test.3.success",
  },
  "outcome:academy-sleeper-hunt-1-failure": {
    effects: [
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
    id: "outcome:academy-sleeper-hunt-1-failure",
    narrativeKey: "outcomes:academy-sleeper-hunt.1.failure",
  },
  "outcome:academy-sleeper-hunt-1-success": {
    effects: [
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
    id: "outcome:academy-sleeper-hunt-1-success",
    narrativeKey: "outcomes:academy-sleeper-hunt.1.success",
  },
  "outcome:academy-sleeper-hunt-2-failure": {
    effects: [
      {
        amount: -2,
        kind: "change-stat",
        stat: "tactics",
      },
    ],
    id: "outcome:academy-sleeper-hunt-2-failure",
    narrativeKey: "outcomes:academy-sleeper-hunt.2.failure",
  },
  "outcome:academy-sleeper-hunt-2-success": {
    effects: [
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
    id: "outcome:academy-sleeper-hunt-2-success",
    narrativeKey: "outcomes:academy-sleeper-hunt.2.success",
  },
  "outcome:academy-sleeper-hunt-3-success": {
    effects: [
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
    id: "outcome:academy-sleeper-hunt-3-success",
    narrativeKey: "outcomes:academy-sleeper-hunt.3.success",
  },
  "outcome:academy-two-seat-drill-1-failure": {
    effects: [
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
    id: "outcome:academy-two-seat-drill-1-failure",
    narrativeKey: "outcomes:academy-two-seat-drill.1.failure",
  },
  "outcome:academy-two-seat-drill-1-success": {
    effects: [
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
    id: "outcome:academy-two-seat-drill-1-success",
    narrativeKey: "outcomes:academy-two-seat-drill.1.success",
  },
  "outcome:academy-two-seat-drill-2-failure": {
    effects: [
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
    id: "outcome:academy-two-seat-drill-2-failure",
    narrativeKey: "outcomes:academy-two-seat-drill.2.failure",
  },
  "outcome:academy-two-seat-drill-2-success": {
    effects: [
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
    id: "outcome:academy-two-seat-drill-2-success",
    narrativeKey: "outcomes:academy-two-seat-drill.2.success",
  },
  "outcome:academy-two-seat-drill-3-success": {
    effects: [
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
    id: "outcome:academy-two-seat-drill-3-success",
    narrativeKey: "outcomes:academy-two-seat-drill.3.success",
  },
  "outcome:academy-reconstruction-detail-1-failure": {
    effects: [
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
    id: "outcome:academy-reconstruction-detail-1-failure",
    narrativeKey: "outcomes:academy-reconstruction-detail.1.failure",
  },
  "outcome:academy-reconstruction-detail-1-success": {
    effects: [
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
    id: "outcome:academy-reconstruction-detail-1-success",
    narrativeKey: "outcomes:academy-reconstruction-detail.1.success",
  },
  "outcome:academy-reconstruction-detail-2-failure": {
    effects: [
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
    id: "outcome:academy-reconstruction-detail-2-failure",
    narrativeKey: "outcomes:academy-reconstruction-detail.2.failure",
  },
  "outcome:academy-reconstruction-detail-2-success": {
    effects: [
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
    id: "outcome:academy-reconstruction-detail-2-success",
    narrativeKey: "outcomes:academy-reconstruction-detail.2.success",
  },
  "outcome:academy-reconstruction-detail-3-success": {
    effects: [
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
    id: "outcome:academy-reconstruction-detail-3-success",
    narrativeKey: "outcomes:academy-reconstruction-detail.3.success",
  },
  "outcome:academy-desert-survival-1-failure": {
    effects: [
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
    id: "outcome:academy-desert-survival-1-failure",
    narrativeKey: "outcomes:academy-desert-survival.1.failure",
  },
  "outcome:academy-desert-survival-1-success": {
    effects: [
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
    id: "outcome:academy-desert-survival-1-success",
    narrativeKey: "outcomes:academy-desert-survival.1.success",
  },
  "outcome:academy-desert-survival-2-failure": {
    effects: [
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
    id: "outcome:academy-desert-survival-2-failure",
    narrativeKey: "outcomes:academy-desert-survival.2.failure",
  },
  "outcome:academy-desert-survival-2-success": {
    effects: [
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
    id: "outcome:academy-desert-survival-2-success",
    narrativeKey: "outcomes:academy-desert-survival.2.success",
  },
  "outcome:academy-desert-survival-3-success": {
    effects: [
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
    id: "outcome:academy-desert-survival-3-success",
    narrativeKey: "outcomes:academy-desert-survival.3.success",
  },
  "outcome:academy-front-observer-1-failure": {
    effects: [
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
    id: "outcome:academy-front-observer-1-failure",
    narrativeKey: "outcomes:academy-front-observer.1.failure",
  },
  "outcome:academy-front-observer-1-success": {
    effects: [
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
    id: "outcome:academy-front-observer-1-success",
    narrativeKey: "outcomes:academy-front-observer.1.success",
  },
  "outcome:academy-front-observer-2-failure": {
    effects: [
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
    id: "outcome:academy-front-observer-2-failure",
    narrativeKey: "outcomes:academy-front-observer.2.failure",
  },
  "outcome:academy-front-observer-2-success": {
    effects: [
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
    id: "outcome:academy-front-observer-2-success",
    narrativeKey: "outcomes:academy-front-observer.2.success",
  },
  "outcome:academy-front-observer-3-success": {
    effects: [
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
    id: "outcome:academy-front-observer-3-success",
    narrativeKey: "outcomes:academy-front-observer.3.success",
  },
  "outcome:academy-final-board-1-failure": {
    effects: [
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
    id: "outcome:academy-final-board-1-failure",
    narrativeKey: "outcomes:academy-final-board.1.failure",
  },
  "outcome:academy-final-board-1-success": {
    effects: [
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
    id: "outcome:academy-final-board-1-success",
    narrativeKey: "outcomes:academy-final-board.1.success",
  },
  "outcome:academy-final-board-2-failure": {
    effects: [
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
    id: "outcome:academy-final-board-2-failure",
    narrativeKey: "outcomes:academy-final-board.2.failure",
  },
  "outcome:academy-final-board-2-success": {
    effects: [
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
    id: "outcome:academy-final-board-2-success",
    narrativeKey: "outcomes:academy-final-board.2.success",
  },
  "outcome:academy-final-board-3-failure": {
    effects: [
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
    id: "outcome:academy-final-board-3-failure",
    narrativeKey: "outcomes:academy-final-board.3.failure",
  },
  "outcome:academy-final-board-3-success": {
    effects: [
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
    id: "outcome:academy-final-board-3-success",
    narrativeKey: "outcomes:academy-final-board.3.success",
  },
  "outcome:academy-date-invitation-1-failure": {
    effects: [
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
    id: "outcome:academy-date-invitation-1-failure",
    narrativeKey: "outcomes:academy-date-invitation.1.failure",
  },
  "outcome:academy-date-invitation-1-success": {
    effects: [
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
    id: "outcome:academy-date-invitation-1-success",
    narrativeKey: "outcomes:academy-date-invitation.1.success",
  },
  "outcome:academy-date-invitation-2-failure": {
    effects: [
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
    id: "outcome:academy-date-invitation-2-failure",
    narrativeKey: "outcomes:academy-date-invitation.2.failure",
  },
  "outcome:academy-date-invitation-2-success": {
    effects: [
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
    id: "outcome:academy-date-invitation-2-success",
    narrativeKey: "outcomes:academy-date-invitation.2.success",
  },
  "outcome:academy-date-invitation-3-success": {
    effects: [
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
    id: "outcome:academy-date-invitation-3-success",
    narrativeKey: "outcomes:academy-date-invitation.3.success",
  },
  "outcome:academy-instructor-conflict-1-failure": {
    effects: [
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
    id: "outcome:academy-instructor-conflict-1-failure",
    narrativeKey: "outcomes:academy-instructor-conflict.1.failure",
  },
  "outcome:academy-instructor-conflict-1-success": {
    effects: [
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
    id: "outcome:academy-instructor-conflict-1-success",
    narrativeKey: "outcomes:academy-instructor-conflict.1.success",
  },
  "outcome:academy-instructor-conflict-2-failure": {
    effects: [
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
    id: "outcome:academy-instructor-conflict-2-failure",
    narrativeKey: "outcomes:academy-instructor-conflict.2.failure",
  },
  "outcome:academy-instructor-conflict-2-success": {
    effects: [
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
    id: "outcome:academy-instructor-conflict-2-success",
    narrativeKey: "outcomes:academy-instructor-conflict.2.success",
  },
  "outcome:academy-instructor-conflict-3-success": {
    effects: [
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
    id: "outcome:academy-instructor-conflict-3-success",
    narrativeKey: "outcomes:academy-instructor-conflict.3.success",
  },
  "outcome:academy-cadet-conflict-1-failure": {
    effects: [
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
    id: "outcome:academy-cadet-conflict-1-failure",
    narrativeKey: "outcomes:academy-cadet-conflict.1.failure",
  },
  "outcome:academy-cadet-conflict-1-success": {
    effects: [
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
    id: "outcome:academy-cadet-conflict-1-success",
    narrativeKey: "outcomes:academy-cadet-conflict.1.success",
  },
  "outcome:academy-cadet-conflict-2-failure": {
    effects: [
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
    id: "outcome:academy-cadet-conflict-2-failure",
    narrativeKey: "outcomes:academy-cadet-conflict.2.failure",
  },
  "outcome:academy-cadet-conflict-2-success": {
    effects: [
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
    id: "outcome:academy-cadet-conflict-2-success",
    narrativeKey: "outcomes:academy-cadet-conflict.2.success",
  },
  "outcome:academy-cadet-conflict-3-success": {
    effects: [
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
    id: "outcome:academy-cadet-conflict-3-success",
    narrativeKey: "outcomes:academy-cadet-conflict.3.success",
  },
  "outcome:academy-cheating-witness-1-success": {
    effects: [
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
    id: "outcome:academy-cheating-witness-1-success",
    narrativeKey: "outcomes:academy-cheating-witness.1.success",
  },
  "outcome:academy-cheating-witness-2-failure": {
    effects: [
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
    id: "outcome:academy-cheating-witness-2-failure",
    narrativeKey: "outcomes:academy-cheating-witness.2.failure",
  },
  "outcome:academy-cheating-witness-2-success": {
    effects: [
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
    id: "outcome:academy-cheating-witness-2-success",
    narrativeKey: "outcomes:academy-cheating-witness.2.success",
  },
  "outcome:academy-cheating-witness-3-failure": {
    effects: [
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
    id: "outcome:academy-cheating-witness-3-failure",
    narrativeKey: "outcomes:academy-cheating-witness.3.failure",
  },
  "outcome:academy-cheating-witness-3-success": {
    effects: [
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
    id: "outcome:academy-cheating-witness-3-success",
    narrativeKey: "outcomes:academy-cheating-witness.3.success",
  },
} as const satisfies Record<OutcomeId, Outcome>;
