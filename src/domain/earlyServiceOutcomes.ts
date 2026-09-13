import {
  careerFlag as flag,
  careerIndicator as indicator,
  createOutcomeFactory,
  damageZoid,
  injurePilot,
  promote,
  statChange as stat,
  type OutcomeDefinition,
} from "./outcomeDefinitions";

const { catalog: createOutcomeCatalog } = createOutcomeFactory({
  idPrefix: "early-service-",
  translationPrefix: "early-service.",
});

const outcomeSpecs = [
  {
    path: "barracks-duty.1",
    failure: [
      indicator("faction-trust", 1),
      stat("strength", -3),
      injurePilot,
      damageZoid,
    ],
    success: [
      stat("synchrony", 3),
      indicator("faction-trust", 3),
      stat("tactics", -1),
    ],
  },
  {
    path: "barracks-duty.2",
    success: [stat("technique", 4), stat("strength", -1), flag("engineering")],
  },
  {
    path: "barracks-duty.3",
    failure: [
      stat("tactics", -2),
      stat("charisma", 1),
      indicator("faction-trust", -1),
    ],
    success: [
      stat("tactics", 3),
      stat("charisma", 1),
      indicator("faction-trust", 2),
      stat("technique", -1),
    ],
  },
  {
    path: "red-river.1",
    failure: [
      stat("piloting", 1),
      stat("strength", -3),
      injurePilot,
      damageZoid,
    ],
    success: [
      stat("piloting", 3),
      indicator("faction-trust", 2),
      stat("strength", -1),
    ],
  },
  {
    path: "red-river.2",
    failure: [
      stat("tactics", -2),
      stat("technique", 1),
      indicator("faction-trust", -1),
    ],
    success: [
      stat("tactics", 3),
      stat("technique", 2),
      stat("piloting", -1),
      flag("engineering"),
    ],
  },
  {
    path: "red-river.3",
    success: [
      stat("tactics", 2),
      indicator("faction-trust", 2),
      stat("charisma", -1),
    ],
  },
  {
    path: "mount-olympus.1",
    failure: [
      stat("tactics", -3),
      stat("strength", -2),
      stat("piloting", 1),
      injurePilot,
      damageZoid,
    ],
    success: [
      stat("piloting", 3),
      stat("synchrony", 3),
      indicator("fame", 4),
      indicator("faction-trust", 2),
      stat("tactics", -2),
      promote,
    ],
  },
  {
    path: "mount-olympus.2",
    failure: [
      stat("technique", -2),
      stat("tactics", 1),
      indicator("faction-trust", -2),
    ],
    success: [stat("technique", 3), stat("tactics", 2), stat("charisma", -1)],
  },
  {
    path: "mount-olympus.3",
    success: [
      stat("tactics", 2),
      indicator("faction-trust", 2),
      stat("piloting", -1),
      flag("command"),
    ],
  },
  {
    path: "under-our-fire.1",
    failure: [stat("charisma", 1), stat("tactics", -3)],
    success: [stat("charisma", 3), indicator("fame", 2)],
  },
  {
    path: "under-our-fire.2",
    success: [stat("charisma", 2), indicator("fame", 1), stat("technique", -1)],
  },
  {
    path: "under-our-fire.3",
    failure: [
      stat("charisma", -2),
      indicator("faction-trust", -1),
      stat("tactics", -3),
      damageZoid,
    ],
    success: [
      stat("piloting", 3),
      indicator("fame", 2),
      indicator("faction-trust", -1),
    ],
  },
  {
    path: "enemy-informant.1",
    failure: [
      stat("charisma", -2),
      stat("tactics", 1),
      indicator("faction-trust", -1),
    ],
    success: [stat("tactics", 3), indicator("faction-trust", 2), promote],
  },
  {
    path: "enemy-informant.2",
    failure: [
      stat("technique", 1),
      indicator("faction-trust", -2),
      stat("charisma", -1),
    ],
    success: [
      stat("technique", 3),
      stat("tactics", 1),
      indicator("faction-trust", 2),
      stat("charisma", -2),
    ],
  },
  {
    path: "enemy-informant.3",
    success: [stat("tactics", 4)],
  },
  {
    path: "line-collapses.1",
    failure: [
      indicator("faction-trust", -2),
      stat("tactics", -2),
      stat("charisma", 1),
    ],
    success: [
      stat("tactics", 3),
      indicator("fame", 2),
      indicator("faction-trust", -2),
      flag("rebel"),
    ],
  },
  {
    path: "line-collapses.2",
    failure: [
      stat("tactics", -2),
      stat("strength", -2),
      stat("synchrony", 1),
      injurePilot,
    ],
    success: [
      stat("synchrony", 4),
      { amount: 1, kind: "change-zoid-upgrades" },
      indicator("fame", 2),
      stat("tactics", -1),
      promote,
    ],
  },
  {
    path: "line-collapses.3",
    success: [stat("tactics", 2), stat("charisma", 2), stat("strength", -1)],
  },
  {
    path: "no-one-left-behind.1",
    failure: [
      indicator("faction-trust", -2),
      stat("tactics", -1),
      stat("charisma", 1),
    ],
    success: [
      stat("tactics", 3),
      stat("technique", 3),
      indicator("fame", 2),
      stat("strength", -1),
      promote,
    ],
  },
  {
    path: "no-one-left-behind.2",
    failure: [
      stat("tactics", -2),
      indicator("faction-trust", -3),
      stat("charisma", 2),
    ],
    success: [
      stat("charisma", 3),
      stat("tactics", 2),
      indicator("faction-trust", -1),
    ],
  },
  {
    path: "no-one-left-behind.3",
    success: [stat("technique", 2), stat("tactics", 1), stat("charisma", -1)],
  },
  {
    path: "moonbay-contract.1",
    failure: [
      indicator("faction-trust", -1),
      stat("charisma", 1),
      stat("tactics", -1),
    ],
    success: [
      stat("technique", 2),
      stat("charisma", 1),
      indicator("faction-trust", 1),
    ],
  },
  {
    path: "moonbay-contract.2",
    failure: [stat("charisma", -3), stat("tactics", 1)],
    success: [
      stat("tactics", 2),
      indicator("faction-trust", 2),
      stat("charisma", -1),
    ],
  },
  {
    path: "moonbay-contract.3",
    success: [stat("tactics", 1), stat("technique", 2), stat("charisma", -1)],
  },
  {
    path: "impossible-part.1",
    failure: [
      indicator("faction-trust", -2),
      stat("charisma", -2),
      stat("technique", 1),
    ],
    success: [
      stat("technique", 4),
      { amount: 3, kind: "change-zoid-power" },
      indicator("faction-trust", 2),
      stat("strength", -1),
      flag("engineering"),
    ],
  },
  {
    path: "impossible-part.2",
    success: [
      stat("tactics", 2),
      indicator("faction-trust", 1),
      stat("charisma", -1),
    ],
  },
  {
    path: "impossible-part.3",
    failure: [stat("technique", -2), stat("charisma", 1)],
    success: [stat("technique", 2), stat("tactics", 2)],
  },
  {
    path: "two-orders.1",
    success: [stat("technique", 2), stat("tactics", 2)],
  },
  {
    path: "two-orders.2",
    failure: [
      stat("tactics", -3),
      stat("strength", -1),
      stat("charisma", 1),
      injurePilot,
    ],
    success: [
      stat("charisma", 3),
      stat("tactics", 2),
      indicator("faction-trust", 2),
      stat("piloting", -1),
    ],
  },
  {
    path: "two-orders.3",
    failure: [
      stat("tactics", -2),
      stat("strength", -2),
      stat("synchrony", 1),
      damageZoid,
    ],
    success: [
      stat("synchrony", 2),
      stat("tactics", 2),
      indicator("faction-trust", 2),
      stat("charisma", -1),
    ],
  },
] as const satisfies readonly OutcomeDefinition[];

export const earlyServiceOutcomeCatalog = createOutcomeCatalog(outcomeSpecs);
