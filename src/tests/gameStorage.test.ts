import { afterEach, describe, expect, test, vi } from "vitest";

import {
  createEmptyGameData,
  loadGameData,
  saveGameData,
  type StoredGameData,
} from "../app/gameStorage";

const gameStorageKey = "scars-of-steel:game-data";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("game storage", () => {
  test("loads versioned game data", () => {
    const data = {
      activeGame: null,
      completedGames: [],
      version: 2,
    } as const satisfies StoredGameData;

    saveGameData(data);

    expect(loadGameData()).toEqual(data);
  });

  test.each([
    "not-json",
    JSON.stringify({ activeGame: null, completedGames: [], version: 1 }),
    JSON.stringify({ activeGame: { screen: "event" }, version: 2 }),
  ])("ignores damaged or incompatible data", (storedValue) => {
    window.localStorage.setItem(gameStorageKey, storedValue);

    expect(loadGameData()).toEqual(createEmptyGameData());
  });

  test("continues when browser storage fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is unavailable.");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full.");
    });

    expect(loadGameData()).toEqual(createEmptyGameData());
    expect(() => saveGameData(createEmptyGameData())).not.toThrow();
  });
});
