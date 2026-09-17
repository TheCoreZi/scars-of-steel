import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getZoid, zoids } from "../domain/zoids";
import { translate } from "../i18n";
import "../styles/zoid-review.css";
import { AppControls } from "./AppControls";
import {
  loadColorModePreference,
  saveColorModePreference,
} from "./colorModeStorage";

const sortOptions = ["power", "name", "faction"] as const;

export function ZoidReviewApp() {
  const { i18n, t } = useTranslation("interface");
  const [colorMode, setColorMode] = useState(loadColorModePreference);
  const [powers, setPowers] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [sort, setSort] = useState("power");
  const power = (id: string, basePower: number) => powers[id] ?? basePower;
  const [catalogIds, setCatalogIds] = useState(() => sortedIds("power"));
  const catalog = catalogIds.map(getZoid);
  function sortedIds(criterion: string) {
    return [...zoids]
      .sort((a, b) => {
        const names = translate(a.nameKey).localeCompare(
          translate(b.nameKey),
          i18n.language,
        );
        switch (criterion) {
          case "faction":
            return (
              t(`factions.${a.faction}`).localeCompare(
                t(`factions.${b.faction}`),
                i18n.language,
              ) || names
            );
          case "power":
            return power(b.id, b.basePower) - power(a.id, a.basePower) || names;
          default:
            return names;
        }
      })
      .map((zoid) => zoid.id);
  }

  useEffect(() => {
    saveColorModePreference(colorMode);
  }, [colorMode]);

  async function save() {
    setStatus("saving");
    try {
      const response = await fetch("/__dev/zoid-powers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          zoids
            .filter(
              (zoid) =>
                powers[zoid.id] !== undefined &&
                powers[zoid.id] !== zoid.basePower,
            )
            .map((zoid) => ({
              id: zoid.id,
              basePower: powers[zoid.id],
              previous: zoid.basePower,
            })),
        ),
      });
      if (!response.ok) throw new Error("Save failed.");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="app-shell zoid-review-shell"
      data-color-mode={colorMode}
      data-faction="neutral"
    >
      <AppControls colorMode={colorMode} onColorModeChange={setColorMode} />
      <main className="zoid-review">
        <header className="zoid-review__header">
          <div>
            <h1>{t("zoidReview.title")}</h1>
            <p>{t("zoidReview.temporary")}</p>
          </div>
          <label>
            {t("zoidReview.sort")}
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setCatalogIds(sortedIds(event.target.value));
              }}
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`zoidReview.${option}Sort`)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button"
            onClick={() => setCatalogIds(sortedIds(sort))}
            type="button"
          >
            {t("zoidReview.reorder")}
          </button>
        </header>
        <div className="zoid-review__header">
          <button
            className="button"
            disabled={
              status === "saving" ||
              !zoids.some(
                (zoid) =>
                  powers[zoid.id] !== undefined &&
                  powers[zoid.id] !== zoid.basePower,
              )
            }
            onClick={() => void save()}
            type="button"
          >
            {t("zoidReview.save")}
          </button>
          <p role="status">
            {status !== "idle" ? t(`zoidReview.${status}`) : ""}
          </p>
        </div>
        <ul className="zoid-review__grid">
          {catalog.map((zoid) => (
            <li className="zoid-review__card" key={zoid.id}>
              <div className="zoid-review__image">
                {zoid.imagePath ? (
                  <img alt="" src={zoid.imagePath} />
                ) : (
                  <span aria-hidden="true">{String.fromCodePoint(0x2b21)}</span>
                )}
              </div>
              <h2>{translate(zoid.nameKey)}</h2>
              <p>{t(`factions.${zoid.faction}`)}</p>
              <label htmlFor={zoid.id}>
                {t("zoidReview.power")}
                <output htmlFor={zoid.id}>
                  {power(zoid.id, zoid.basePower)}
                </output>
              </label>
              <input
                aria-label={t("zoidReview.slider", {
                  name: translate(zoid.nameKey),
                })}
                disabled={status === "saving"}
                id={zoid.id}
                max={100}
                min={0}
                onChange={(event) => {
                  setStatus("idle");
                  setPowers({
                    ...powers,
                    [zoid.id]: Number(event.target.value),
                  });
                }}
                step={1}
                type="range"
                value={power(zoid.id, zoid.basePower)}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
