import { afterEach, describe, expect, test, vi } from "vitest";

import {
  colorModeStorageKey,
  loadColorModePreference,
  saveColorModePreference,
} from "../app/colorModeStorage";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("color mode preference", () => {
  test("loads the saved color mode", () => {
    window.localStorage.setItem(colorModeStorageKey, "light");

    expect(loadColorModePreference()).toBe("light");
  });

  test("uses dark mode for an invalid stored value", () => {
    window.localStorage.setItem(colorModeStorageKey, "invalid");

    expect(loadColorModePreference()).toBe("dark");
  });

  test("saves the selected color mode", () => {
    saveColorModePreference("light");

    expect(window.localStorage.getItem(colorModeStorageKey)).toBe("light");
  });

  test("continues when browser storage fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is unavailable.");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full.");
    });

    expect(loadColorModePreference()).toBe("dark");
    expect(() => saveColorModePreference("light")).not.toThrow();
  });
});
