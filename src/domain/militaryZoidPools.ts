import type { ZoidPool } from "./zoidPoolDefinitions";

export const militaryZoidPools = {
  "military-prototypes": {
    helic: [
      { id: "zoid:shield-liger", weight: 100 },
      { id: "zoid:gun-sniper", weight: 100 },
      { id: "zoid:dibison", weight: 100 },
      { id: "zoid:liger-zero", weight: 1 },
      { id: "zoid:gojulas", weight: 10 },
      { id: "zoid:konig-wolf", weight: 1 },
      { id: "zoid:shadow-fox", weight: 10 },
      { id: "zoid:gunbluster", weight: 100 },
    ],
    guylos: [
      { id: "zoid:saber-tiger", weight: 100 },
      { id: "zoid:rev-raptor", weight: 100 },
      { id: "zoid:red-horn", weight: 100 },
      { id: "zoid:liger-zero-empire", weight: 1 },
      { id: "zoid:iron-kong", weight: 10 },
      { id: "zoid:lightning-saix", weight: 10 },
      { id: "zoid:geno-saurer", weight: 3 },
    ],
  },
  "military-trials": {
    helic: [
      { id: "zoid:shield-liger" },
      { id: "zoid:command-wolf" },
      { id: "zoid:arosaurer" },
      { id: "zoid:liger-zero" },
      { id: "zoid:gun-sniper" },
    ],
    guylos: [
      { id: "zoid:saber-tiger" },
      { id: "zoid:helcat" },
      { id: "zoid:rev-raptor" },
      { id: "zoid:liger-zero-empire" },
      { id: "zoid:lightning-saix" },
      { id: "zoid:command-wolf-empire" },
    ],
  },
  "military-veteran": {
    helic: [
      { id: "zoid:gunbluster" },
      { id: "zoid:gordos" },
      { id: "zoid:shield-liger" },
      { id: "zoid:dibison" },
    ],
    guylos: [
      { id: "zoid:red-horn" },
      { id: "zoid:saber-tiger" },
      { id: "zoid:geno-saurer" },
      { id: "zoid:elephander" },
    ],
  },
} as const satisfies Record<string, ZoidPool>;
