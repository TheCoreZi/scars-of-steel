# Event definitions

Use `createDecisionEventFactory` for every event catalog. The factory has no fixed life stage or year. An event must contain at least two decisions. There is no fixed maximum.

## Define a catalog

Factory options set shared ages, factions, and naming prefixes. The third argument of `event` overrides eligibility for one event.

```ts
const { chance, event, safe } = createDecisionEventFactory({
  ages: [21, 22, 23],
  factions: ["guylos", "helic"],
  idPrefix: "veteran-",
  translationPrefix: "veteran.",
});

const patrol = event(
  "patrol",
  [chance(60, [{ stat: "tactics", weight: 0.3 }]), safe()],
  {
    requiresZoid: true,
  },
);
```

`chance` takes a base success percentage and weighted stats. `safe` does not roll. Add decisions to the array to offer more choices.

Use `ages: [23]` in the event options for a specific year. Omit factory eligibility when each event supplies its own. Initial events use the same constructor.

## Identifiers and outcomes

The factory assigns positions from declaration order. In this example, the first decision has ID `decision:veteran-patrol-1`. Its outcome IDs end in `-1-success` and `-1-failure`. Its translation path is `decisions:veteran.patrol.1`.

Use `createOutcomeFactory` with the same prefixes. Define effects under `path: "patrol.1"`, with `success` and, for chance decisions, `failure`. Keep outcome paths and translations aligned when you reorder decisions.

The optional naming callbacks support catalogs with existing naming conventions, such as Initial. New catalogs can use the default convention without callbacks.

## Register and validate

Add the catalog to the combined events and outcomes in `events.ts`. Include it in the eligible event pool in `eventPools.ts`. Creating a factory does not register its catalog.

Eligibility supports ages, factions, a required Zoid, and required career flags. Run `npm run verify` after changes. Validation checks decision counts, unique identifiers, and outcome references.
