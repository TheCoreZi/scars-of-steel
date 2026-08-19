import {
  createBoundedValue,
  type Faction,
  type TranslationKey,
  type Zoid,
  type ZoidId,
} from "./types";

interface ZoidDefinition {
  basePower: number;
  faction: Faction;
  id: string;
  image?: string;
  name: string;
}

const definitions: readonly ZoidDefinition[] = [
  {
    basePower: 10,
    faction: "helic",
    id: "aquadon",
    image: "aquadon",
    name: "aquadon",
  },
  { basePower: 30, faction: "helic", id: "arosaurer", name: "arosaurer" },
  {
    basePower: 25,
    faction: "helic",
    id: "barigator",
    image: "barigator",
    name: "barigator",
  },
  {
    basePower: 32,
    faction: "helic",
    id: "bear-fighter",
    image: "bear_fighter",
    name: "bearFighter",
  },
  {
    basePower: 40,
    faction: "helic",
    id: "bigasaurus",
    name: "bigasaurus",
  },
  {
    basePower: 35,
    faction: "guylos",
    id: "black-rhymos",
    name: "blackRhymos",
  },
  { basePower: 17, faction: "guylos", id: "brachios", name: "brachios" },
  {
    basePower: 23,
    faction: "helic",
    id: "cannon-tortoise",
    image: "cannon_tortoise",
    name: "cannonTortoise",
  },
  {
    basePower: 35,
    faction: "helic",
    id: "command-wolf",
    image: "command_wolf",
    name: "commandWolf",
  },
  {
    basePower: 42,
    faction: "helic",
    id: "command-wolf-ac",
    name: "commandWolfAc",
  },
  { basePower: 45, faction: "helic", id: "dibison", name: "dibison" },
  {
    basePower: 45,
    faction: "guylos",
    id: "dimetrodon",
    name: "dimetrodon",
  },
  {
    basePower: 17,
    faction: "helic",
    id: "double-sworder",
    image: "double_sworder",
    name: "doubleSworder",
  },
  {
    basePower: 12,
    faction: "helic",
    id: "furolesios",
    image: "furolesios",
    name: "furolesios",
  },
  {
    basePower: 10,
    faction: "helic",
    id: "garius",
    image: "garius",
    name: "garius",
  },
  {
    basePower: 12,
    faction: "guylos",
    id: "gator",
    image: "gator",
    name: "gator",
  },
  {
    basePower: 19,
    faction: "guylos",
    id: "geruder",
    image: "geruder",
    name: "geruder",
  },
  {
    basePower: 8,
    faction: "helic",
    id: "glidoler",
    image: "glidoler",
    name: "glidoler",
  },
  {
    basePower: 18,
    faction: "helic",
    id: "godos",
    image: "godos",
    name: "godos",
  },
  {
    basePower: 28,
    faction: "helic",
    id: "gordos",
    image: "gordos",
    name: "gordos",
  },
  { basePower: 30, faction: "helic", id: "gorhecks", name: "gorhecks" },
  {
    basePower: 12,
    faction: "helic",
    id: "gorgodos",
    image: "gorgodos",
    name: "gorgodos",
  },
  {
    basePower: 43,
    faction: "helic",
    id: "gun-sniper",
    name: "gunSniper",
  },
  {
    basePower: 23,
    faction: "guylos",
    id: "gun-tiger",
    name: "gunTiger",
  },
  {
    basePower: 9,
    faction: "helic",
    id: "gurantula",
    image: "gurantula",
    name: "gurantula",
  },
  {
    basePower: 20,
    faction: "helic",
    id: "guysack",
    image: "guysack",
    name: "guysack",
  },
  {
    basePower: 22,
    faction: "guylos",
    id: "hammer-rock",
    image: "hammerrock",
    name: "hammerRock",
  },
  {
    basePower: 32,
    faction: "guylos",
    id: "hel-digunner",
    image: "heldigunner",
    name: "helDigunner",
  },
  {
    basePower: 30,
    faction: "guylos",
    id: "helcat",
    image: "helcat",
    name: "helcat",
  },
  {
    basePower: 18,
    faction: "helic",
    id: "hidocker",
    image: "hidocker",
    name: "hidocker",
  },
  {
    basePower: 19,
    faction: "guylos",
    id: "iguan",
    image: "iguan",
    name: "iguan",
  },
  {
    basePower: 26,
    faction: "guylos",
    id: "killer-dome",
    name: "killerDome",
  },
  {
    basePower: 8,
    faction: "guylos",
    id: "malder",
    image: "malder",
    name: "malder",
  },
  {
    basePower: 26,
    faction: "helic",
    id: "mammoth",
    image: "mammoth",
    name: "mammoth",
  },
  {
    basePower: 10,
    faction: "guylos",
    id: "merda",
    image: "merda",
    name: "merda",
  },
  {
    basePower: 42,
    faction: "guylos",
    id: "metal-rhymos",
    name: "metalRhymos",
  },
  {
    basePower: 20,
    faction: "guylos",
    id: "molga",
    image: "molga",
    name: "molga",
  },
  {
    basePower: 11,
    faction: "helic",
    id: "pegasuros",
    image: "pegasuros",
    name: "pegasuros",
  },
  {
    basePower: 19,
    faction: "helic",
    id: "pteras",
    image: "pteras",
    name: "pteras",
  },
  { basePower: 46, faction: "helic", id: "raynos", name: "raynos" },
  {
    basePower: 48,
    faction: "guylos",
    id: "red-horn",
    image: "red_horn",
    name: "redHorn",
  },
  {
    basePower: 32,
    faction: "guylos",
    id: "redler",
    image: "redler",
    name: "redler",
  },
  {
    basePower: 43,
    faction: "guylos",
    id: "redler-bc",
    name: "redlerBc",
  },
  { basePower: 28, faction: "guylos", id: "rev-raptor", name: "revRaptor" },
  {
    basePower: 40,
    faction: "guylos",
    id: "rev-raptor-pb",
    name: "revRaptorPb",
  },
  {
    basePower: 46,
    faction: "guylos",
    id: "saber-tiger",
    image: "saber_tiger",
    name: "saberTiger",
  },
  {
    basePower: 9,
    faction: "guylos",
    id: "saicurtis",
    image: "saicurtis",
    name: "saicurtis",
  },
  {
    basePower: 18,
    faction: "guylos",
    id: "sea-panther",
    image: "sea_panther",
    name: "seaPanther",
  },
  {
    basePower: 47,
    faction: "helic",
    id: "shield-liger",
    image: "shield_liger",
    name: "shieldLiger",
  },
  {
    basePower: 19,
    faction: "guylos",
    id: "sinker",
    image: "sinker",
    name: "sinker",
  },
  {
    basePower: 19,
    faction: "helic",
    id: "spiker",
    image: "spiker",
    name: "spiker",
  },
  {
    basePower: 31,
    faction: "helic",
    id: "stealth-viper",
    image: "stealth_viper",
    name: "stealthViper",
  },
  { basePower: 20, faction: "guylos", id: "storch", name: "storch" },
  {
    basePower: 27,
    faction: "guylos",
    id: "twin-horn",
    image: "twinhorn",
    name: "twinHorn",
  },
  { basePower: 41, faction: "guylos", id: "wardick", name: "wardick" },
  {
    basePower: 11,
    faction: "guylos",
    id: "zatton",
    image: "zatton",
    name: "zatton",
  },
];

function createZoid({
  basePower,
  faction,
  id,
  image,
  name,
}: ZoidDefinition): Zoid {
  return {
    basePower: createBoundedValue(basePower),
    faction,
    id: `zoid:${id}`,
    ...(image ? { imagePath: `/images/zoids/${image}.png` } : {}),
    nameKey: `zoids:${name}.name` as TranslationKey<"zoids">,
  };
}

export const zoids = definitions.map(createZoid);

const zoidById = new Map(zoids.map((zoid) => [zoid.id, zoid]));

export function getZoid(id: ZoidId): Zoid {
  const zoid = zoidById.get(id);

  if (!zoid) {
    throw new RangeError(`Unknown Zoid identifier: ${id}.`);
  }

  return zoid;
}

export function validateZoids(catalog: readonly Zoid[]): void {
  const ids = new Set<ZoidId>();

  for (const zoid of catalog) {
    if (ids.has(zoid.id)) {
      throw new TypeError(`Duplicate Zoid identifier: ${zoid.id}.`);
    }

    if (
      !zoid.nameKey.startsWith("zoids:") ||
      !Number.isFinite(zoid.basePower) ||
      zoid.basePower <= 0 ||
      zoid.basePower > 100
    ) {
      throw new TypeError(`Zoid ${zoid.id} has invalid catalog data.`);
    }

    ids.add(zoid.id);
  }
}

validateZoids(zoids);
