export type ColorMode = "dark" | "light";

export const colorModeStorageKey = "scars-of-steel:color-mode";

export function loadColorModePreference(): ColorMode {
  try {
    const colorMode = window.localStorage.getItem(colorModeStorageKey);

    if (colorMode === "dark" || colorMode === "light") {
      return colorMode;
    }
  } catch {
    // Use the default theme when storage is unavailable.
  }

  return "dark";
}

export function saveColorModePreference(colorMode: ColorMode) {
  try {
    window.localStorage.setItem(colorModeStorageKey, colorMode);
  } catch {
    // Keep the selected theme in memory when storage is unavailable.
  }
}
