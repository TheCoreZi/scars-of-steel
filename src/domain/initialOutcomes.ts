import { createOutcomeFactory } from "./outcomeDefinitions";

const { catalog, outcome } = createOutcomeFactory();

export const initialOutcomeCatalog = catalog([
  outcome(
    "outcome:firstExercisesAcceptStandard",
    "outcomes:academy.firstExercisesAcceptStandard",
    [
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome(
    "outcome:firstExercisesControlRareFailure",
    "outcomes:academy.firstExercisesControlRareFailure",
    [
      {
        amount: -3,
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
        poolId: "weak",
      },
    ],
  ),
  outcome(
    "outcome:firstExercisesControlRareSuccess",
    "outcomes:academy.firstExercisesControlRareSuccess",
    [
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
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
        kind: "grant-zoid",
        poolId: "rare",
      },
    ],
  ),
  outcome(
    "outcome:firstExercisesRequestStandard",
    "outcomes:academy.firstExercisesRequestStandard",
    [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome(
    "outcome:strayZoidCaptureFailure",
    "outcomes:academy.strayZoidCaptureFailure",
    [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        kind: "grant-zoid",
        poolId: "weak",
      },
    ],
  ),
  outcome(
    "outcome:strayZoidCaptureSuccess",
    "outcomes:academy.strayZoidCaptureSuccess",
    [
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "rare",
      },
    ],
  ),
  outcome(
    "outcome:strayZoidDestroyFailure",
    "outcomes:academy.strayZoidDestroyFailure",
    [
      {
        amount: -3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "weak",
      },
    ],
  ),
  outcome(
    "outcome:strayZoidDestroySuccess",
    "outcomes:academy.strayZoidDestroySuccess",
    [
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
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome("outcome:strayZoidProtect", "outcomes:academy.strayZoidProtect", [
    {
      amount: 1,
      kind: "change-stat",
      stat: "tactics",
    },
    {
      amount: 1,
      kind: "change-stat",
      stat: "technique",
    },
    {
      amount: 2,
      kind: "change-stat",
      stat: "charisma",
    },
    {
      kind: "grant-zoid",
      poolId: "standard",
    },
  ]),
  outcome(
    "outcome:mechanicsProgramJoin",
    "outcomes:academy.mechanicsProgramJoin",
    [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        amount: 4,
        kind: "change-stat",
        stat: "technique",
      },
      {
        kind: "grant-zoid",
        poolId: "rare",
      },
      {
        achievementId: "achievement:born-in-workshop",
        kind: "grant-achievement",
      },
    ],
  ),
  outcome(
    "outcome:mechanicsProgramReject",
    "outcomes:academy.mechanicsProgramReject",
    [
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
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome(
    "outcome:mechanicsProgramHelpFailure",
    "outcomes:academy.mechanicsProgramHelpFailure",
    [
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -3,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "technique",
      },
      {
        kind: "grant-zoid",
        poolId: "weak",
      },
    ],
  ),
  outcome(
    "outcome:mechanicsProgramHelpSuccess",
    "outcomes:academy.mechanicsProgramHelpSuccess",
    [
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
        amount: 4,
        kind: "change-stat",
        stat: "technique",
      },
      {
        kind: "grant-zoid",
        poolId: "rare",
      },
    ],
  ),
  outcome("outcome:veteranOfferAccept", "outcomes:academy.veteranOfferAccept", [
    {
      amount: 2,
      indicator: "fame",
      kind: "change-career-indicator",
    },
    {
      amount: 2,
      kind: "change-stat",
      stat: "tactics",
    },
    {
      amount: -2,
      kind: "change-stat",
      stat: "strength",
    },
    {
      kind: "grant-zoid",
      poolId: "super-rare",
    },
  ]),
  outcome(
    "outcome:veteranOfferReportFailure",
    "outcomes:academy.veteranOfferReportFailure",
    [
      {
        amount: -3,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        kind: "grant-zoid",
        poolId: "weak",
      },
    ],
  ),
  outcome(
    "outcome:veteranOfferReportSuccess",
    "outcomes:academy.veteranOfferReportSuccess",
    [
      {
        amount: 3,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        kind: "grant-zoid",
        poolId: "standard",
      },
      {
        achievementId: "achievement:not-on-my-watch",
        kind: "grant-achievement",
      },
    ],
  ),
  outcome(
    "outcome:veteranOfferSilence",
    "outcomes:academy.veteranOfferSilence",
    [
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
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome(
    "outcome:humanitarianMissionVolunteerFailure",
    "outcomes:academy.humanitarianMissionVolunteerFailure",
    [
      {
        amount: 1,
        indicator: "fame",
        kind: "change-career-indicator",
      },
      {
        amount: 1,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -4,
        kind: "change-stat",
        stat: "strength",
      },
      {
        kind: "grant-zoid",
        poolId: "weak",
      },
      {
        kind: "injure-pilot",
      },
      {
        achievementId: "achievement:true-soldier",
        kind: "grant-achievement",
      },
    ],
  ),
  outcome(
    "outcome:humanitarianMissionVolunteerSuccess",
    "outcomes:academy.humanitarianMissionVolunteerSuccess",
    [
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
        amount: -2,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "rare",
      },
      {
        achievementId: "achievement:true-soldier",
        kind: "grant-achievement",
      },
    ],
  ),
  outcome(
    "outcome:humanitarianMissionIgnore",
    "outcomes:academy.humanitarianMissionIgnore",
    [
      {
        amount: -2,
        kind: "change-stat",
        stat: "charisma",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "piloting",
      },
      {
        amount: 3,
        kind: "change-stat",
        stat: "strength",
      },
      {
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
  outcome(
    "outcome:humanitarianMissionOrganize",
    "outcomes:academy.humanitarianMissionOrganize",
    [
      {
        amount: 3,
        kind: "change-stat",
        stat: "tactics",
      },
      {
        amount: 2,
        kind: "change-stat",
        stat: "strength",
      },
      {
        amount: -2,
        kind: "change-stat",
        stat: "synchrony",
      },
      {
        kind: "grant-zoid",
        poolId: "standard",
      },
    ],
  ),
]);
