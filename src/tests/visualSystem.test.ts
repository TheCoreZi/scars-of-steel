/// <reference types="node" />

import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const baseCss = readFileSync("src/styles/base.css", "utf8");

describe("visual system", () => {
  test.each([
    "--font-body",
    "--font-console",
    "--font-display",
    "--radius-small",
    "--color-console",
    "--color-console-text",
    "--color-faction",
    "--color-on-faction",
    "--color-scrollbar-thumb",
    "--color-scrollbar-thumb-hover",
    "--color-scrollbar-track",
    "--color-secondary",
  ])("defines the %s token", (token) => {
    expect(baseCss).toContain(`${token}:`);
  });

  test.each([
    ["dark neutral", ".app-shell"],
    ["dark Guylos", '.app-shell[data-faction="guylos"]'],
    ["dark Helic", '.app-shell[data-faction="helic"]'],
    ["light neutral", '.app-shell[data-color-mode="light"]'],
    [
      "light Guylos",
      '.app-shell[data-color-mode="light"][data-faction="guylos"]',
    ],
    [
      "light Helic",
      '.app-shell[data-color-mode="light"][data-faction="helic"]',
    ],
  ])("keeps %s console text at WCAG AA contrast", (_, selector) => {
    const tokens = getInheritedTokens(selector);

    expect(
      getContrast(tokens["--color-console-text"], tokens["--color-console"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrast(tokens["--color-console-muted"], tokens["--color-console"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrast(tokens["--color-text"], tokens["--color-background"]),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrast(
        resolveToken(tokens["--color-accent-contrast"], tokens),
        resolveToken(tokens["--color-accent"], tokens),
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  test.each([
    ["dark Guylos", '.app-shell [data-faction="guylos"]'],
    ["dark Helic", '.app-shell [data-faction="helic"]'],
    [
      "light Guylos",
      '.app-shell[data-color-mode="light"] [data-faction="guylos"]',
    ],
    [
      "light Helic",
      '.app-shell[data-color-mode="light"] [data-faction="helic"]',
    ],
  ])("keeps %s faction content at WCAG AA contrast", (_, selector) => {
    const tokens = getTokens(selector);

    expect(
      getContrast(tokens["--color-on-faction"], tokens["--color-faction"]),
    ).toBeGreaterThanOrEqual(4.5);
  });

  test.each([
    ["dark neutral", ":root"],
    [
      "dark Guylos",
      ':root:has(.app-shell[data-color-mode="dark"][data-faction="guylos"])',
    ],
    [
      "dark Helic",
      ':root:has(.app-shell[data-color-mode="dark"][data-faction="helic"])',
    ],
    ["light neutral", ':root:has(.app-shell[data-color-mode="light"])'],
    [
      "light Guylos",
      ':root:has(.app-shell[data-color-mode="light"][data-faction="guylos"])',
    ],
    [
      "light Helic",
      ':root:has(.app-shell[data-color-mode="light"][data-faction="helic"])',
    ],
  ])("keeps %s scrollbar controls visible", (_, selector) => {
    const tokens = {
      ...getTokens(":root"),
      ...getTokens(selector),
    };

    expect(
      getContrast(
        tokens["--color-scrollbar-thumb"],
        tokens["--color-scrollbar-track"],
      ),
    ).toBeGreaterThanOrEqual(3);
  });
});

function getInheritedTokens(selector: string): Record<string, string> {
  const tokens = {
    ...getTokens(":root"),
    ...getTokens(".app-shell"),
  };

  if (selector.includes('data-color-mode="light"')) {
    Object.assign(tokens, getTokens('.app-shell[data-color-mode="light"]'));
  }

  return Object.assign(tokens, getTokens(selector));
}

function getTokens(selector: string): Record<string, string> {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const block = baseCss.match(
    new RegExp(`${escapedSelector}\\s*\\{([^}]*)`, "u"),
  );

  if (!block) {
    throw new Error(`CSS selector not found: ${selector}`);
  }

  return Object.fromEntries(
    [...block[1].matchAll(/(--[\w-]+):\s*([^;]+);/gu)].map(
      ([, token, value]) => [token, value.trim()],
    ),
  );
}

function resolveToken(value: string, tokens: Record<string, string>): string {
  const referencedToken = value.match(/^var\((--[\w-]+)\)$/u)?.[1];

  return referencedToken
    ? resolveToken(tokens[referencedToken], tokens)
    : value;
}

function getContrast(foreground: string, background: string): number {
  const foregroundLuminance = getLuminance(foreground);
  const backgroundLuminance = getLuminance(background);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

function getLuminance(color: string): number {
  const channels = color
    .slice(1)
    .match(/.{2}/gu)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  if (!channels || channels.length !== 3) {
    throw new Error(`Unsupported color: ${color}`);
  }

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
