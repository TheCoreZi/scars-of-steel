import { getEvent } from "./events";
import type { RandomGenerator } from "./random";
import type { DecisionEvent, EventId, Pilot } from "./types";
import { academyEvents } from "./academyEvents";
import { earlyServiceEvents } from "./earlyServiceEvents";
import { militaryLifeEvents } from "./militaryLifeEvents";

export const initialEventPool = [
  "event:first-exercises",
  "event:stray-zoid",
  "event:mechanics-program",
  "event:veteran-offer",
  "event:humanitarian-mission",
] as const satisfies readonly EventId[];

export function selectInitialEvent(random: RandomGenerator): DecisionEvent {
  return selectEvent(initialEventPool, random);
}

export function getEligibleEventIds(
  pilot: Pilot,
  completedEventIds: readonly EventId[],
): readonly EventId[] {
  const pool =
    pilot.age === 12
      ? initialEventPool
      : [...academyEvents, ...earlyServiceEvents, ...militaryLifeEvents]
          .filter(
            (event) =>
              event.ages?.includes(pilot.age) &&
              (!event.requiresZoid || pilot.zoids !== null) &&
              (!event.requiredCareerFlags ||
                event.requiredCareerFlags.every((flag) =>
                  pilot.careerFlags.includes(flag),
                )) &&
              (!event.factions || event.factions.includes(pilot.faction)),
          )
          .map(({ id }) => id);

  return pool.filter((id) => !completedEventIds.includes(id));
}

export function selectEvent(
  pool: readonly EventId[],
  random: RandomGenerator,
): DecisionEvent {
  if (pool.length === 0) {
    throw new RangeError("Cannot select an event from an empty pool.");
  }

  return getEvent(pool[random.integer(0, pool.length - 1)]);
}
