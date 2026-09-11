import type { Outcome, OutcomeId } from "./types";
export const initialOutcomeCatalog = {
  "outcome:firstExercisesAcceptStandard": {
    effects: [
      { amount: 2, kind: "change-stat", stat: "piloting" },
      { amount: 3, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:firstExercisesAcceptStandard",
    narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
  },
  "outcome:firstExercisesControlRareFailure": {
    effects: [
      { amount: -3, kind: "change-stat", stat: "charisma" },
      { amount: -1, kind: "change-stat", stat: "piloting" },
      { kind: "grant-zoid", poolId: "weak" },
    ],
    id: "outcome:firstExercisesControlRareFailure",
    narrativeKey: "outcomes:academy.firstExercisesControlRareFailure",
  },
  "outcome:firstExercisesControlRareSuccess": {
    effects: [
      { amount: 2, kind: "change-stat", stat: "charisma" },
      { amount: 2, kind: "change-stat", stat: "piloting" },
      { amount: 2, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "rare" },
    ],
    id: "outcome:firstExercisesControlRareSuccess",
    narrativeKey: "outcomes:academy.firstExercisesControlRareSuccess",
  },
  "outcome:firstExercisesRequestStandard": {
    effects: [
      { amount: -2, kind: "change-stat", stat: "charisma" },
      { amount: 3, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:firstExercisesRequestStandard",
    narrativeKey: "outcomes:academy.firstExercisesRequestStandard",
  },
  "outcome:strayZoidCaptureFailure": {
    effects: [
      { amount: -2, kind: "change-stat", stat: "piloting" },
      { amount: -2, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "weak" },
    ],
    id: "outcome:strayZoidCaptureFailure",
    narrativeKey: "outcomes:academy.strayZoidCaptureFailure",
  },
  "outcome:strayZoidCaptureSuccess": {
    effects: [
      { amount: 2, kind: "change-stat", stat: "charisma" },
      { amount: 2, kind: "change-stat", stat: "piloting" },
      { amount: 3, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "rare" },
    ],
    id: "outcome:strayZoidCaptureSuccess",
    narrativeKey: "outcomes:academy.strayZoidCaptureSuccess",
  },
  "outcome:strayZoidDestroyFailure": {
    effects: [
      { amount: -3, kind: "change-stat", stat: "piloting" },
      { amount: -1, kind: "change-stat", stat: "strength" },
      { amount: -1, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "weak" },
    ],
    id: "outcome:strayZoidDestroyFailure",
    narrativeKey: "outcomes:academy.strayZoidDestroyFailure",
  },
  "outcome:strayZoidDestroySuccess": {
    effects: [
      { amount: 3, kind: "change-stat", stat: "piloting" },
      { amount: 2, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:strayZoidDestroySuccess",
    narrativeKey: "outcomes:academy.strayZoidDestroySuccess",
  },
  "outcome:strayZoidProtect": {
    effects: [
      { amount: 1, kind: "change-stat", stat: "tactics" },
      { amount: 1, kind: "change-stat", stat: "technique" },
      { amount: 2, kind: "change-stat", stat: "charisma" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:strayZoidProtect",
    narrativeKey: "outcomes:academy.strayZoidProtect",
  },
  "outcome:mechanicsProgramJoin": {
    effects: [
      { amount: -2, kind: "change-stat", stat: "piloting" },
      { amount: 2, kind: "change-stat", stat: "synchrony" },
      { amount: 4, kind: "change-stat", stat: "technique" },
      { kind: "grant-zoid", poolId: "rare" },
      {
        achievementId: "achievement:born-in-workshop",
        kind: "grant-achievement",
      },
    ],
    id: "outcome:mechanicsProgramJoin",
    narrativeKey: "outcomes:academy.mechanicsProgramJoin",
  },
  "outcome:mechanicsProgramReject": {
    effects: [
      { amount: 3, kind: "change-stat", stat: "piloting" },
      { amount: 2, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:mechanicsProgramReject",
    narrativeKey: "outcomes:academy.mechanicsProgramReject",
  },
  "outcome:mechanicsProgramHelpFailure": {
    effects: [
      { amount: -2, kind: "change-stat", stat: "piloting" },
      { amount: -3, kind: "change-stat", stat: "strength" },
      { amount: -2, kind: "change-stat", stat: "technique" },
      { kind: "grant-zoid", poolId: "weak" },
    ],
    id: "outcome:mechanicsProgramHelpFailure",
    narrativeKey: "outcomes:academy.mechanicsProgramHelpFailure",
  },
  "outcome:mechanicsProgramHelpSuccess": {
    effects: [
      { amount: 2, kind: "change-stat", stat: "piloting" },
      { amount: 2, kind: "change-stat", stat: "synchrony" },
      { amount: 4, kind: "change-stat", stat: "technique" },
      { kind: "grant-zoid", poolId: "rare" },
    ],
    id: "outcome:mechanicsProgramHelpSuccess",
    narrativeKey: "outcomes:academy.mechanicsProgramHelpSuccess",
  },
  "outcome:veteranOfferAccept": {
    effects: [
      { amount: 2, indicator: "fame", kind: "change-career-indicator" },
      { amount: 2, kind: "change-stat", stat: "tactics" },
      { amount: -2, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "super-rare" },
    ],
    id: "outcome:veteranOfferAccept",
    narrativeKey: "outcomes:academy.veteranOfferAccept",
  },
  "outcome:veteranOfferReportFailure": {
    effects: [
      { amount: -3, indicator: "fame", kind: "change-career-indicator" },
      { amount: -2, kind: "change-stat", stat: "charisma" },
      { amount: -1, kind: "change-stat", stat: "tactics" },
      { kind: "grant-zoid", poolId: "weak" },
    ],
    id: "outcome:veteranOfferReportFailure",
    narrativeKey: "outcomes:academy.veteranOfferReportFailure",
  },
  "outcome:veteranOfferReportSuccess": {
    effects: [
      { amount: 3, indicator: "fame", kind: "change-career-indicator" },
      { amount: 2, kind: "change-stat", stat: "charisma" },
      { amount: 1, kind: "change-stat", stat: "tactics" },
      { kind: "grant-zoid", poolId: "standard" },
      {
        achievementId: "achievement:not-on-my-watch",
        kind: "grant-achievement",
      },
    ],
    id: "outcome:veteranOfferReportSuccess",
    narrativeKey: "outcomes:academy.veteranOfferReportSuccess",
  },
  "outcome:veteranOfferSilence": {
    effects: [
      { amount: 2, kind: "change-stat", stat: "tactics" },
      { amount: 3, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:veteranOfferSilence",
    narrativeKey: "outcomes:academy.veteranOfferSilence",
  },
  "outcome:humanitarianMissionVolunteerFailure": {
    effects: [
      { amount: 1, indicator: "fame", kind: "change-career-indicator" },
      { amount: 1, kind: "change-stat", stat: "charisma" },
      { amount: -2, kind: "change-stat", stat: "piloting" },
      { amount: -4, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "weak" },
      { kind: "injure-pilot" },
      { achievementId: "achievement:true-soldier", kind: "grant-achievement" },
    ],
    id: "outcome:humanitarianMissionVolunteerFailure",
    narrativeKey: "outcomes:academy.humanitarianMissionVolunteerFailure",
  },
  "outcome:humanitarianMissionVolunteerSuccess": {
    effects: [
      { amount: 2, indicator: "fame", kind: "change-career-indicator" },
      { amount: 3, kind: "change-stat", stat: "charisma" },
      { amount: -2, kind: "change-stat", stat: "piloting" },
      { amount: -2, kind: "change-stat", stat: "strength" },
      { amount: 2, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "rare" },
      { achievementId: "achievement:true-soldier", kind: "grant-achievement" },
    ],
    id: "outcome:humanitarianMissionVolunteerSuccess",
    narrativeKey: "outcomes:academy.humanitarianMissionVolunteerSuccess",
  },
  "outcome:humanitarianMissionIgnore": {
    effects: [
      { amount: -2, kind: "change-stat", stat: "charisma" },
      { amount: 3, kind: "change-stat", stat: "piloting" },
      { amount: 3, kind: "change-stat", stat: "strength" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:humanitarianMissionIgnore",
    narrativeKey: "outcomes:academy.humanitarianMissionIgnore",
  },
  "outcome:humanitarianMissionOrganize": {
    effects: [
      { amount: 3, kind: "change-stat", stat: "tactics" },
      { amount: 2, kind: "change-stat", stat: "strength" },
      { amount: -2, kind: "change-stat", stat: "synchrony" },
      { kind: "grant-zoid", poolId: "standard" },
    ],
    id: "outcome:humanitarianMissionOrganize",
    narrativeKey: "outcomes:academy.humanitarianMissionOrganize",
  },
} as const satisfies Record<OutcomeId, Outcome>;
