import { createZoidPool } from "./zoidPoolDefinitions";

export const initialZoidPools = {
  rare: createZoidPool(
    [
      "zoid:black-rhymos",
      "zoid:hel-digunner",
      "zoid:helcat",
      "zoid:killer-dome",
      "zoid:redler",
      "zoid:rev-raptor",
      "zoid:twin-horn",
    ],
    [
      "zoid:arosaurer",
      "zoid:bear-fighter",
      "zoid:command-wolf",
      "zoid:gordos",
      "zoid:gorhecks",
      "zoid:mammoth",
      "zoid:stealth-viper",
    ],
  ),
  standard: createZoidPool(
    [
      "zoid:brachios",
      "zoid:geruder",
      "zoid:gun-tiger",
      "zoid:hammer-rock",
      "zoid:iguan",
      "zoid:molga",
      "zoid:sea-panther",
      "zoid:sinker",
      "zoid:storch",
    ],
    [
      "zoid:barigator",
      "zoid:cannon-tortoise",
      "zoid:double-sworder",
      "zoid:godos",
      "zoid:guysack",
      "zoid:hidocker",
      "zoid:pteras",
      "zoid:spiker",
    ],
  ),
  "super-rare": createZoidPool(
    [
      "zoid:dimetrodon",
      "zoid:metal-rhymos",
      "zoid:red-horn",
      "zoid:redler-bc",
      "zoid:rev-raptor-pb",
      "zoid:saber-tiger",
      "zoid:wardick",
    ],
    [
      "zoid:bigasaurus",
      "zoid:command-wolf-ac",
      "zoid:dibison",
      "zoid:gun-sniper",
      "zoid:raynos",
      "zoid:shield-liger",
    ],
  ),
  weak: createZoidPool(
    [
      "zoid:gator",
      "zoid:malder",
      "zoid:merda",
      "zoid:saicurtis",
      "zoid:zatton",
    ],
    [
      "zoid:aquadon",
      "zoid:furolesios",
      "zoid:garius",
      "zoid:glidoler",
      "zoid:gorgodos",
      "zoid:gurantula",
      "zoid:pegasuros",
    ],
  ),
} as const;
