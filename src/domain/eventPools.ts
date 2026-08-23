import { getEvent } from "./events";
import type { RandomGenerator } from "./random";
import type { DecisionEvent, EventId } from "./types";

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
  age: number,
  completedEventIds: readonly EventId[],
): readonly EventId[] {
  const pool = age === 12 ? initialEventPool : [];

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
