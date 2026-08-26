import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import lighthouse from "lighthouse";

const accessibilityTarget = 0.95;
const browserPort = 9222;
const siteUrl = "http://127.0.0.1:4173/";

await runAudit();

async function runAudit() {
  const browserData = await mkdtemp(join(tmpdir(), "scars-lighthouse-"));
  const browser = spawn(
    chromium.executablePath(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${browserPort}`,
      `--user-data-dir=${browserData}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1"], {
    stdio: "ignore",
  });

  try {
    await Promise.all([
      waitForUrl(`http://127.0.0.1:${browserPort}/json/version`),
      waitForUrl(siteUrl),
    ]);

    const result = await lighthouse(siteUrl, {
      logLevel: "error",
      onlyCategories: ["accessibility"],
      output: "json",
      port: browserPort,
    });
    const score = result?.lhr.categories.accessibility?.score;

    if (score === null || score === undefined) {
      throw new Error("Lighthouse did not return an accessibility score.");
    }

    console.log(`Lighthouse Accessibility: ${Math.round(score * 100)}`);

    if (score < accessibilityTarget) {
      throw new Error(
        `Lighthouse Accessibility must be at least ${accessibilityTarget * 100}.`,
      );
    }
  } finally {
    await Promise.all([stopProcess(browser), stopProcess(server)]);
    await rm(browserData, {
      force: true,
      maxRetries: 5,
      recursive: true,
      retryDelay: 200,
    });
  }
}

async function waitForUrl(url) {
  const timeoutAt = Date.now() + 30_000;

  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // The process can need more time to listen.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out while waiting for ${url}.`);
}

async function stopProcess(process) {
  if (process.exitCode !== null || process.signalCode !== null) {
    return;
  }

  const closed = once(process, "close");

  process.kill("SIGTERM");
  await closed;
}
