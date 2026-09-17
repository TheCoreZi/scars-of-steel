import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

export function zoidReview(): Plugin {
  return {
    apply: "serve",
    name: "zoid-review",
    configureServer(server) {
      const file = resolve(server.config.root, "src/domain/zoids.ts");
      let saving = false;
      server.middlewares.use(
        "/__dev/zoid-powers",
        async (request, response) => {
          if (request.method !== "POST") {
            response.writeHead(405).end();
            return;
          }
          const origin = request.headers.origin;
          if (
            !origin ||
            new URL(origin).host !== request.headers.host ||
            request.headers["content-type"] !== "application/json"
          ) {
            response.writeHead(403).end();
            return;
          }
          if (saving) {
            response.writeHead(409).end();
            return;
          }
          saving = true;
          try {
            let body = "";
            for await (const chunk of request) {
              body += chunk;
              if (body.length > 20000) throw new Error("Request too large.");
            }
            const source = await readFile(file, "utf8");
            const updated = updateZoidPowers(source, JSON.parse(body));
            if (updated !== source) await writeFile(file, updated, "utf8");
            response
              .writeHead(200, { "Content-Type": "application/json" })
              .end("{}");
          } catch {
            response.writeHead(400).end();
          } finally {
            saving = false;
          }
        },
      );
    },
  };
}

export function updateZoidPowers(source: string, changes: unknown): string {
  if (!Array.isArray(changes) || !changes.length)
    throw new Error("Invalid changes.");
  const pending = new Map<string, { basePower: number; previous: number }>();
  for (const change of changes) {
    if (
      !change ||
      typeof change.id !== "string" ||
      pending.has(change.id) ||
      !Number.isInteger(change.basePower) ||
      change.basePower < 0 ||
      change.basePower > 100 ||
      !Number.isInteger(change.previous)
    )
      throw new Error("Invalid power.");
    pending.set(change.id, change);
  }
  const updated = source.replace(
    /(basePower: )(\d+)(,\s*faction: "(?:guylos|helic)",\s*id: "([a-z-]+)")/g,
    (match, prefix, value, suffix, id) => {
      const key = `zoid:${id}`;
      const change = pending.get(key);
      if (!change) return match;
      if (Number(value) !== change.previous)
        throw new Error("Catalog changed. Reload before saving.");
      pending.delete(key);
      return `${prefix}${change.basePower}${suffix}`;
    },
  );
  if (pending.size) throw new Error("Unknown Zoid.");
  return updated;
}
