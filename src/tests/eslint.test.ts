import { ESLint } from "eslint";
import { expect, test } from "vitest";

test("rejects direct Math.random calls", async () => {
  const eslint = new ESLint();
  const [result] = await eslint.lintText("Math.random();", {
    filePath: "forbidden.ts",
  });

  expect(result.messages).toContainEqual(
    expect.objectContaining({
      ruleId: "no-restricted-properties",
      severity: 2,
    }),
  );
});
