import type { FinalSummary } from "../domain/finalSummary";
import type { Faction } from "../domain/types";
import type { ColorMode } from "./AppControls";

export const finalCardWidth = 1200;

const finalCardBottomPadding = 80;
const finalCardVisualBottom = 360;

interface CardImages {
  achievementIcons: readonly (HTMLImageElement | null)[];
  faction: HTMLImageElement | null;
  rank: HTMLImageElement | null;
  title: HTMLImageElement | null;
  zoid: HTMLImageElement | null;
}

interface CardPalette {
  accent: string;
  background: string;
  muted: string;
  panel: string;
  text: string;
  track: string;
}

interface FinalCardLayout {
  achievementsY: number;
  height: number;
  metricsY: number;
  statsY: number;
}

const cardPalettes = {
  dark: {
    guylos: {
      accent: "#ff5d6c",
      background: "#0c0d0f",
      muted: "#c6c4c5",
      panel: "#303135",
      text: "#ffffff",
      track: "#53565c",
    },
    helic: {
      accent: "#f4b942",
      background: "#071126",
      muted: "#bdc9e8",
      panel: "#172b58",
      text: "#ffffff",
      track: "#485981",
    },
  },
  light: {
    guylos: {
      accent: "#b2243a",
      background: "#e5e5e2",
      muted: "#5e5b5c",
      panel: "#d8d7d3",
      text: "#242527",
      track: "#9d9d98",
    },
    helic: {
      accent: "#965b00",
      background: "#e7ecf8",
      muted: "#485677",
      panel: "#dce5fa",
      text: "#242527",
      track: "#9ba8c8",
    },
  },
} as const satisfies Record<ColorMode, Record<Faction, CardPalette>>;

export async function createFinalCardBlob(
  summary: FinalSummary,
  colorMode: ColorMode,
): Promise<Blob> {
  await document.fonts?.ready;

  const canvas = document.createElement("canvas");
  canvas.width = finalCardWidth;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new TypeError("Canvas 2D is not available.");
  }

  const images = await loadCardImages(summary);
  const layout = getFinalCardLayout(context, summary);
  canvas.height = layout.height;
  drawFinalCard(context, summary, images, colorMode, layout);

  return exportCanvas(canvas);
}

async function loadCardImages(summary: FinalSummary): Promise<CardImages> {
  const [faction, rank, title, zoid, ...achievementIcons] = await Promise.all([
    loadImage(summary.factionImagePath),
    loadImage(summary.rankInsignia.imagePath),
    loadImage(summary.titleIconPath),
    loadImage(summary.zoidImagePath),
    ...summary.achievements.map(({ iconPath }) => loadImage(iconPath)),
  ]);

  return { achievementIcons, faction, rank, title, zoid };
}

async function loadImage(path?: string): Promise<HTMLImageElement | null> {
  if (!path) {
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = path;
  });
}

function getFinalCardLayout(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
): FinalCardLayout {
  const metricsY =
    Math.max(getTitleBottom(context, summary), finalCardVisualBottom) + 50;
  const achievementsY = metricsY + 224 + 55;
  const achievementsBottom = getAchievementsBottom(
    summary.achievements.length,
    achievementsY,
  );
  const statsY = achievementsBottom + 60;
  const statsBottom = getStatsBottom(summary.stats.length, statsY);

  return {
    achievementsY,
    height: Math.ceil(statsBottom + finalCardBottomPadding),
    metricsY,
    statsY,
  };
}

function getTitleBottom(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
): number {
  context.font = "900 62px system-ui, sans-serif";
  const titleBottom = getWrappedTextBottom(
    context,
    summary.titleName,
    250,
    560,
    64,
    2,
  );
  context.font = "600 24px system-ui, sans-serif";
  const descriptionBottom = getWrappedTextBottom(
    context,
    summary.titleDescription,
    titleBottom + 48,
    560,
    34,
    4,
  );
  context.font = "700 18px system-ui, sans-serif";

  return getWrappedTextBottom(
    context,
    summary.ageLabel,
    descriptionBottom + 38,
    560,
    26,
    2,
  );
}

function getAchievementsBottom(count: number, y: number): number {
  return count === 0 ? y + 45 : y + 30 + Math.ceil(count / 3) * 112;
}

function getStatsBottom(count: number, y: number): number {
  const rows = Math.ceil(count / 3);

  return y + 32 + Math.max(rows - 1, 0) * 88 + 56;
}

function getWrappedTextBottom(
  context: CanvasRenderingContext2D,
  text: string,
  y: number,
  maximumWidth: number,
  lineHeight: number,
  maximumLines: number,
): number {
  const lines = wrapText(context, text, maximumWidth, maximumLines);

  return y + Math.max(lines.length - 1, 0) * lineHeight;
}

function drawFinalCard(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  images: CardImages,
  colorMode: ColorMode,
  layout: FinalCardLayout,
): void {
  const palette = cardPalettes[colorMode][summary.faction];

  context.fillStyle = palette.background;
  context.fillRect(0, 0, finalCardWidth, layout.height);
  context.fillStyle = palette.accent;
  context.fillRect(0, 0, finalCardWidth, 18);
  context.strokeStyle = palette.accent;
  context.lineWidth = 3;
  context.strokeRect(44, 44, finalCardWidth - 88, layout.height - 88);

  drawTitle(context, summary, images.title, palette);
  drawVisual(context, summary, images, palette);
  drawMetrics(context, summary, palette, layout.metricsY);
  drawAchievements(
    context,
    summary,
    images.achievementIcons,
    palette,
    layout.achievementsY,
  );
  drawStats(context, summary, palette, layout.statsY);
}

function drawTitle(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icon: HTMLImageElement | null,
  palette: CardPalette,
): void {
  drawTitleSpotlights(context, palette.accent);

  if (icon) {
    drawContainedImage(context, icon, 280, 65, 180, 125);
  }

  context.fillStyle = palette.accent;
  context.font = "900 62px system-ui, sans-serif";
  context.textAlign = "center";
  const titleBottom = drawWrappedText(
    context,
    summary.titleName,
    370,
    250,
    560,
    64,
    2,
  );
  context.fillStyle = palette.muted;
  context.font = "600 24px system-ui, sans-serif";
  const descriptionBottom = drawWrappedText(
    context,
    summary.titleDescription,
    370,
    titleBottom + 48,
    560,
    34,
    4,
  );
  context.fillStyle = palette.accent;
  context.font = "700 18px system-ui, sans-serif";
  drawWrappedText(
    context,
    summary.ageLabel,
    370,
    descriptionBottom + 38,
    560,
    26,
    2,
  );
  context.textAlign = "left";
}

function drawTitleSpotlights(
  context: CanvasRenderingContext2D,
  accent: string,
): void {
  [
    { angle: -Math.PI / 6, opacity: 0.16, x: 332 },
    { angle: 0, opacity: 0.22, x: 370 },
    { angle: Math.PI / 6, opacity: 0.16, x: 408 },
  ].forEach(({ angle, opacity, x }) => {
    context.save();
    context.fillStyle = accent;
    context.globalAlpha = opacity;
    context.translate(x, 195);
    context.rotate(angle);
    context.fillRect(-14, -125, 28, 125);
    context.restore();
  });
}

function drawVisual(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  images: CardImages,
  palette: CardPalette,
): void {
  context.fillStyle = palette.panel;
  context.fillRect(700, 80, 418, 280);

  if (images.faction) {
    context.save();
    context.globalAlpha = 0.14;
    drawContainedImage(context, images.faction, 730, 100, 360, 190);
    context.restore();
  }

  if (images.zoid) {
    drawContainedImage(context, images.zoid, 755, 130, 310, 135);
  }

  drawRank(context, summary, images.rank, palette.accent);
  context.fillStyle = palette.accent;
  context.textAlign = "left";
  context.font = "800 17px system-ui, sans-serif";
  context.fillText(summary.labels.zoid.toUpperCase(), 730, 292);
  context.fillStyle = palette.text;
  context.font = "800 24px system-ui, sans-serif";
  drawWrappedText(context, summary.zoidName, 730, 320, 340, 24, 2);
}

function drawRank(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  image: HTMLImageElement | null,
  accent: string,
): void {
  if (image) {
    drawContainedImage(context, image, 1020, 94, 64, 38);
  }

  context.fillStyle = accent;
  context.font = "900 18px system-ui, sans-serif";
  context.textAlign = "right";
  context.fillText(summary.rank.toUpperCase(), 1085, 150);
}

function drawMetrics(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  palette: CardPalette,
  y: number,
): void {
  const metrics = [
    [summary.labels.potential, summary.potential],
    [summary.labels.fame, summary.fame],
    [summary.labels.factionTrust, summary.factionTrust],
    [
      summary.labels.battleRecord,
      `${summary.battleWins} ${summary.labels.wins} · ${summary.battleLosses} ${summary.labels.losses}`,
    ],
  ] as const;

  metrics.forEach(([label, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 82 + column * 528;
    const metricY = y + row * 120;
    context.fillStyle = palette.panel;
    context.fillRect(x, metricY, 504, 104);
    context.fillStyle = palette.accent;
    context.font = "800 16px system-ui, sans-serif";
    context.fillText(label.toUpperCase(), x + 18, metricY + 30);
    context.font = `900 ${index === 3 ? 20 : 42}px system-ui, sans-serif`;
    drawWrappedText(context, String(value), x + 18, metricY + 76, 468, 22, 2);
  });
}

function drawAchievements(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icons: readonly (HTMLImageElement | null)[],
  palette: CardPalette,
  y: number,
): void {
  context.fillStyle = palette.accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.achievements.toUpperCase(), 82, y);

  if (summary.achievements.length === 0) {
    context.fillStyle = palette.text;
    context.font = "700 21px system-ui, sans-serif";
    context.fillText("—", 82, y + 38);
    return;
  }

  const achievementY = y + 30;

  summary.achievements.forEach((achievement, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 82 + column * 357;
    const itemY = achievementY + row * 112;

    const icon = icons[index];

    if (icon) {
      drawContainedImage(context, icon, x, itemY, 28, 28);
    }

    context.fillStyle = palette.text;
    context.font = "700 18px system-ui, sans-serif";
    context.fillText(achievement.name, x + 44, itemY + 18);
    context.fillStyle = palette.muted;
    context.font = "400 16px system-ui, sans-serif";
    drawWrappedText(
      context,
      achievement.description,
      x + 44,
      itemY + 46,
      280,
      22,
      3,
    );
  });
}

function drawStats(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  palette: CardPalette,
  y: number,
): void {
  context.fillStyle = palette.accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.stats.toUpperCase(), 82, y);

  const statsY = y + 32;

  summary.stats.forEach((stat, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 82 + column * 357;
    const statY = statsY + row * 88;

    context.fillStyle = palette.text;
    context.font = "700 17px system-ui, sans-serif";
    context.fillText(stat.label, x + 16, statY + 24);
    context.textAlign = "right";
    context.fillText(String(stat.value), x + 308, statY + 24);
    context.textAlign = "left";
    context.fillStyle = palette.track;
    context.fillRect(x + 16, statY + 46, 292, 5);
    context.fillStyle = palette.accent;
    context.fillRect(x + 16, statY + 46, (292 * stat.value) / 100, 5);
  });
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const scale = Math.min(width / image.width, height / image.height);
  const drawnWidth = image.width * scale;
  const drawnHeight = image.height * scale;

  context.drawImage(
    image,
    x + (width - drawnWidth) / 2,
    y + (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight,
  );
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maximumWidth: number,
  lineHeight: number,
  maximumLines: number,
): number {
  const lines = wrapText(context, text, maximumWidth, maximumLines);

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return y + Math.max(lines.length - 1, 0) * lineHeight;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maximumWidth: number,
  maximumLines: number,
): readonly string[] {
  const words = text.split(/\s+/u);
  const lines: string[] = [];
  let line = words.shift() ?? "";

  for (const word of words) {
    const candidate = `${line} ${word}`;

    if (context.measureText(candidate).width <= maximumWidth) {
      line = candidate;
      continue;
    }

    lines.push(line);
    line = word;

    if (lines.length === maximumLines) {
      return lines;
    }
  }

  if (lines.length < maximumLines && line) {
    lines.push(line);
  }

  return lines;
}

function exportCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new TypeError("Canvas did not produce a PNG image."));
      }
    }, "image/png");
  });
}
