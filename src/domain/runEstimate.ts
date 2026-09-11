import { academyEvents } from "./academyEvents.ts";
import type { DecisionEvent, Faction } from "./types.ts";

const initialEventBranches = 21;

// This estimate excludes inventory requirements and early endings.
export function estimateAcademyRuns(): number {
  return (["guylos", "helic"] as const).reduce((total, faction) => {
    const laterBranches = academyEvents.reduce((sum, event) => {
      if (!event.ages?.includes(13) || !allowsFaction(event, faction))
        return sum;
      const finalBranches = academyEvents.reduce((count, finalEvent) => {
        return (
          count +
          (finalEvent.id !== event.id &&
          finalEvent.ages?.includes(14) &&
          allowsFaction(finalEvent, faction)
            ? countBranches(finalEvent)
            : 0)
        );
      }, 0);
      return sum + countBranches(event) * finalBranches;
    }, 0);
    return total + initialEventBranches * laterBranches;
  }, 0);
}

function countBranches(event: DecisionEvent): number {
  return event.decisions.reduce(
    (total, decision) => total + (decision.kind === "chance" ? 2 : 1),
    0,
  );
}

function allowsFaction(event: DecisionEvent, faction: Faction): boolean {
  return !event.factions || event.factions.includes(faction);
}
