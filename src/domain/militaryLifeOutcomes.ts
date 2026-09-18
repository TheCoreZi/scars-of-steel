import {
  careerIndicator as indicator,
  createOutcomeFactory,
  damageZoid,
  injurePilot,
  promote,
  statChange as stat,
  type OutcomeDefinition,
} from "./outcomeDefinitions";
const { catalog } = createOutcomeFactory({
  idPrefix: "military-life-",
  translationPrefix: "military-life.",
});
const definitions = [
  {
    path: "abandoned-hangar.1",
    success: [
      { amount: 1, kind: "change-potential" },
      stat("synchrony", 3),
      stat("tactics", -1),
      stat("technique", 3),
      { kind: "grant-zoid", poolId: "military-prototypes" },
    ],
    successNarrativeVariants: {
      "reward-unavailable":
        "outcomes:military-life.abandoned-hangar.1.success-reward-unavailable",
    },
    failure: [
      stat("strength", -1),
      stat("tactics", -1),
      stat("technique", 2),
      injurePilot,
    ],
  },
  {
    path: "abandoned-hangar.2",
    success: [promote, stat("piloting", 2), stat("strength", -1)],
    successNarrativeVariants: {
      "rank-unchanged":
        "outcomes:military-life.abandoned-hangar.2.success-rank-unchanged",
    },
    failure: [
      indicator("faction-trust", -1),
      stat("piloting", -1),
      stat("synchrony", 2),
      stat("tactics", 2),
      damageZoid,
    ],
  },
  {
    path: "abandoned-hangar.3",
    success: [
      indicator("faction-trust", 1),
      stat("strength", 1),
      stat("synchrony", -1),
      stat("technique", 1),
    ],
  },
  {
    path: "empty-bunks.1",
    success: [stat("charisma", 4), indicator("fame", 1), stat("tactics", -1)],
    failure: [stat("charisma", -4), stat("strength", -3), stat("tactics", 1)],
  },
  {
    path: "empty-bunks.2",
    success: [
      stat("charisma", 1),
      stat("piloting", -1),
      { amount: 1, kind: "change-potential" },
      stat("tactics", 2),
    ],
    failure: [stat("charisma", -4), stat("synchrony", 1), stat("tactics", -4)],
  },
  {
    path: "empty-bunks.3",
    success: [stat("strength", 2), stat("synchrony", -1), stat("technique", 2)],
  },
  {
    path: "field-trials.1",
    success: [
      indicator("faction-trust", 1),
      stat("piloting", 3),
      { amount: 1, kind: "change-potential" },
      stat("strength", -1),
      stat("synchrony", 3),
      { kind: "grant-zoid", poolId: "military-trials" },
    ],
    successNarrativeVariants: {
      "reward-unavailable":
        "outcomes:military-life.field-trials.1.success-reward-unavailable",
    },
    failure: [
      indicator("faction-trust", -1),
      stat("piloting", -2),
      stat("technique", 1),
    ],
  },
  {
    path: "field-trials.2",
    success: [
      indicator("fame", 1),
      stat("piloting", -1),
      stat("tactics", 2),
      stat("technique", 2),
    ],
    failure: [
      indicator("faction-trust", -1),
      stat("piloting", -2),
      stat("tactics", 1),
      stat("technique", -3),
    ],
  },
  {
    path: "field-trials.3",
    success: [stat("piloting", 2), stat("strength", -1), stat("synchrony", 2)],
  },
  {
    path: "forward-workshop.1",
    success: [
      indicator("fame", 1),
      { amount: 1, kind: "change-potential" },
      stat("strength", -1),
      stat("synchrony", 2),
      { amount: 1, kind: "change-zoid-upgrades" },
    ],
    failure: [
      stat("piloting", 2),
      stat("synchrony", -1),
      stat("tactics", 1),
      stat("technique", -1),
      damageZoid,
    ],
  },
  {
    path: "forward-workshop.2",
    success: [
      stat("charisma", 1),
      stat("piloting", -1),
      stat("technique", 1),
      { amount: 1, kind: "change-zoid-upgrades" },
    ],
    failure: [stat("charisma", -4), stat("tactics", -3), stat("technique", 1)],
  },
  {
    path: "forward-workshop.3",
    success: [
      stat("piloting", 1),
      { amount: 1, kind: "change-potential" },
      stat("synchrony", 1),
      stat("tactics", -1),
    ],
  },
  {
    path: "leave-letter.1",
    success: [stat("charisma", 3), stat("strength", 3), stat("technique", -1)],
    failure: [stat("charisma", 1), stat("tactics", -3), stat("technique", -4)],
  },
  {
    path: "leave-letter.2",
    success: [
      stat("charisma", 3),
      indicator("faction-trust", 1),
      stat("strength", 3),
      stat("synchrony", -1),
    ],
    failure: [stat("charisma", -2), stat("strength", -3), stat("tactics", 1)],
  },
  {
    path: "leave-letter.3",
    success: [
      stat("charisma", -1),
      indicator("faction-trust", 1),
      stat("strength", 1),
      stat("tactics", 1),
    ],
  },
  {
    path: "relief-column.1",
    success: [
      indicator("faction-trust", 1),
      indicator("fame", 1),
      stat("piloting", 3),
      stat("strength", 3),
      stat("synchrony", -1),
    ],
    failure: [
      stat("charisma", -1),
      stat("piloting", 2),
      stat("strength", -1),
      stat("synchrony", 3),
      stat("technique", 2),
      injurePilot,
      damageZoid,
    ],
  },
  {
    path: "relief-column.2",
    success: [
      stat("charisma", 2),
      indicator("fame", 1),
      stat("strength", 2),
      stat("tactics", -1),
    ],
    failure: [
      stat("charisma", -1),
      stat("strength", -2),
      stat("tactics", 1),
      injurePilot,
    ],
  },
  {
    path: "relief-column.3",
    success: [
      stat("charisma", -1),
      indicator("faction-trust", 1),
      stat("strength", 2),
    ],
  },
  {
    path: "retiring-pilot.1",
    success: [
      { amount: 1, kind: "change-potential" },
      stat("synchrony", -1),
      stat("technique", 5),
      { kind: "grant-zoid", poolId: "military-veteran" },
    ],
    successNarrativeVariants: {
      "reward-unavailable":
        "outcomes:military-life.retiring-pilot.1.success-reward-unavailable",
    },
    failure: [
      { amount: -1, kind: "change-potential" },
      stat("strength", 1),
      stat("synchrony", -2),
      stat("technique", -2),
    ],
  },
  {
    path: "retiring-pilot.2",
    success: [
      stat("charisma", 2),
      { amount: 2, kind: "change-potential" },
      stat("synchrony", 2),
      stat("technique", -1),
      { kind: "grant-zoid", poolId: "military-veteran" },
    ],
    successNarrativeVariants: {
      "reward-unavailable":
        "outcomes:military-life.retiring-pilot.2.success-reward-unavailable",
    },
    failure: [stat("charisma", 1), stat("piloting", -2), stat("synchrony", -3)],
  },
  {
    path: "retiring-pilot.3",
    success: [stat("charisma", 2), stat("synchrony", 2), stat("technique", -1)],
  },
  {
    path: "silent-ridge.1",
    success: [
      indicator("fame", 1),
      stat("piloting", 3),
      { amount: 1, kind: "change-potential" },
      stat("synchrony", -1),
      stat("tactics", 3),
    ],
    failure: [
      stat("piloting", 4),
      stat("strength", -1),
      stat("tactics", 2),
      injurePilot,
      damageZoid,
    ],
  },
  {
    path: "silent-ridge.2",
    success: [
      indicator("fame", 2),
      stat("piloting", 4),
      { amount: 2, kind: "change-potential" },
      stat("strength", 3),
      stat("synchrony", 4),
      stat("technique", -1),
    ],
    failure: [
      stat("piloting", 4),
      { amount: 1, kind: "change-potential" },
      stat("strength", -1),
      stat("synchrony", 2),
      stat("tactics", 1),
      injurePilot,
      {
        kind: "destroy-signature-zoid",
        replacementPoolId: "academy-replacement",
      },
    ],
  },
  {
    path: "silent-ridge.3",
    success: [
      stat("charisma", -1),
      indicator("faction-trust", 1),
      stat("strength", 1),
      stat("tactics", 1),
    ],
  },
  {
    path: "squadron-friction.1",
    success: [
      indicator("faction-trust", -1),
      indicator("fame", 1),
      { amount: 1, kind: "change-potential" },
      stat("synchrony", -1),
      stat("tactics", 4),
      stat("technique", 4),
    ],
    failure: [
      indicator("faction-trust", -1),
      stat("piloting", -1),
      stat("tactics", 2),
      stat("technique", 2),
      damageZoid,
    ],
  },
  {
    path: "squadron-friction.2",
    success: [
      stat("charisma", 2),
      indicator("faction-trust", 1),
      stat("tactics", 2),
      stat("technique", -1),
    ],
    failure: [stat("charisma", -4), stat("piloting", -3), stat("tactics", 1)],
  },
  {
    path: "squadron-friction.3",
    success: [stat("piloting", 2), stat("strength", -1), stat("synchrony", 2)],
  },
  {
    path: "trapped-core.1",
    success: [
      { amount: 1, kind: "change-potential" },
      stat("strength", 4),
      stat("synchrony", 4),
      stat("technique", -1),
    ],
    failure: [
      stat("charisma", 2),
      stat("piloting", 2),
      stat("strength", -1),
      stat("synchrony", -1),
      stat("technique", 5),
      injurePilot,
      {
        kind: "destroy-signature-zoid",
        replacementPoolId: "academy-replacement",
      },
    ],
  },
  {
    path: "trapped-core.2",
    success: [
      { kind: "replace-signature-zoid", poolId: "academy-replacement" },
      stat("piloting", -1),
      stat("strength", 1),
      stat("technique", 1),
      { amount: 1, kind: "change-zoid-upgrades" },
    ],
    successNarrativeVariants: {
      "same-model": "outcomes:military-life.trapped-core.2.success-same-model",
    },
    failure: [
      stat("strength", 2),
      stat("synchrony", -1),
      stat("technique", -1),
      {
        kind: "destroy-signature-zoid",
        replacementPoolId: "academy-replacement",
      },
    ],
  },
  {
    path: "trapped-core.3",
    success: [
      stat("charisma", 4),
      indicator("faction-trust", 1),
      stat("strength", 2),
      stat("synchrony", -1),
      stat("tactics", 2),
      {
        kind: "destroy-signature-zoid",
        replacementPoolId: "academy-replacement",
      },
    ],
  },
] as const satisfies readonly OutcomeDefinition[];
export const militaryLifeOutcomeCatalog = catalog(definitions);
