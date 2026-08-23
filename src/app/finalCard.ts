import type { FinalSummary } from "../domain/finalSummary";

export const finalCardHeight = 1500;
export const finalCardWidth = 1200;

interface CardImages {
  achievementIcons: readonly (HTMLImageElement | null)[];
  faction: HTMLImageElement | null;
  rank: HTMLImageElement | null;
  title: HTMLImageElement | null;
  zoid: HTMLImageElement | null;
}

export async function createFinalCardBlob(
  summary: FinalSummary,
): Promise<Blob> {
  await document.fonts?.ready;

  const canvas = document.createElement("canvas");
  canvas.height = finalCardHeight;
  canvas.width = finalCardWidth;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new TypeError("Canvas 2D is not available.");
  }

  const images = await loadCardImages(summary);
  drawFinalCard(context, summary, images);

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

function drawFinalCard(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  images: CardImages,
): void {
  const accent = summary.faction === "helic" ? "#f4b942" : "#ff5d6c";
  const background = summary.faction === "helic" ? "#071126" : "#0c0d0f";
  const panel = summary.faction === "helic" ? "#172b58" : "#303135";

  context.fillStyle = background;
  context.fillRect(0, 0, finalCardWidth, finalCardHeight);
  context.fillStyle = accent;
  context.fillRect(0, 0, finalCardWidth, 18);
  context.strokeStyle = accent;
  context.lineWidth = 3;
  context.strokeRect(44, 44, finalCardWidth - 88, finalCardHeight - 88);

  const titleBottom = drawTitle(context, summary, images.title, accent);
  const visualBottom = drawVisual(context, summary, images, panel, accent);
  const metricsBottom = drawMetrics(
    context,
    summary,
    panel,
    accent,
    Math.max(titleBottom, visualBottom) + 50,
  );
  const achievementsBottom = drawAchievements(
    context,
    summary,
    images.achievementIcons,
    accent,
    metricsBottom + 55,
  );
  drawStats(context, summary, accent, achievementsBottom + 60);
}

function drawTitle(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icon: HTMLImageElement | null,
  accent: string,
): number {
  drawTitleSpotlights(context, accent);

  if (icon) {
    drawContainedImage(context, icon, 280, 65, 180, 125);
  }

  context.fillStyle = accent;
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
  context.fillStyle = "#c9d2e7";
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
  context.fillStyle = accent;
  context.font = "700 18px system-ui, sans-serif";
  const ageBottom = drawWrappedText(
    context,
    summary.ageLabel,
    370,
    descriptionBottom + 38,
    560,
    26,
    2,
  );
  context.textAlign = "left";

  return ageBottom;
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
  panel: string,
  accent: string,
): number {
  context.fillStyle = panel;
  context.fillRect(700, 80, 418, 430);

  if (images.faction) {
    context.save();
    context.globalAlpha = 0.14;
    drawContainedImage(context, images.faction, 730, 135, 360, 260);
    context.restore();
  }

  if (images.zoid) {
    drawContainedImage(context, images.zoid, 755, 180, 310, 190);
  }

  drawRank(context, summary, images.rank, accent);
  context.textAlign = "left";
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.zoid.toUpperCase(), 730, 430);
  context.fillStyle = "#ffffff";
  context.font = "800 30px system-ui, sans-serif";
  drawWrappedText(context, summary.zoidName, 730, 470, 340, 34, 2);

  return 510;
}

function drawRank(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  image: HTMLImageElement | null,
  accent: string,
): void {
  if (image) {
    drawContainedImage(context, image, 1000, 104, 90, 51);
  }

  context.fillStyle = accent;
  context.font = "900 18px system-ui, sans-serif";
  context.textAlign = "right";
  context.fillText(summary.rank.toUpperCase(), 1085, 174);
}

function drawMetrics(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  panel: string,
  accent: string,
  y: number,
): number {
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
    context.fillStyle = panel;
    context.fillRect(x, metricY, 504, 104);
    context.fillStyle = accent;
    context.font = "800 16px system-ui, sans-serif";
    context.fillText(label.toUpperCase(), x + 18, metricY + 30);
    context.font = `900 ${index === 3 ? 20 : 42}px system-ui, sans-serif`;
    drawWrappedText(context, String(value), x + 18, metricY + 76, 468, 22, 2);
  });

  return y + 224;
}

function drawAchievements(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icons: readonly (HTMLImageElement | null)[],
  accent: string,
  y: number,
): number {
  context.fillStyle = accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.achievements.toUpperCase(), 82, y);

  if (summary.achievements.length === 0) {
    context.fillStyle = "#ffffff";
    context.font = "700 21px system-ui, sans-serif";
    context.fillText("—", 82, y + 38);
    return y + 45;
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

    context.fillStyle = "#ffffff";
    context.font = "700 18px system-ui, sans-serif";
    context.fillText(achievement.name, x + 44, itemY + 18);
    context.fillStyle = "#c9d2e7";
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

  return achievementY + Math.ceil(summary.achievements.length / 3) * 112;
}

function drawStats(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  accent: string,
  y: number,
): void {
  context.fillStyle = accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.stats.toUpperCase(), 82, y);

  const statsY = y + 32;

  summary.stats.forEach((stat, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 82 + column * 357;
    const statY = statsY + row * 88;

    context.fillStyle = "#ffffff";
    context.font = "700 17px system-ui, sans-serif";
    context.fillText(stat.label, x + 16, statY + 24);
    context.textAlign = "right";
    context.fillText(String(stat.value), x + 308, statY + 24);
    context.textAlign = "left";
    context.fillStyle = "#556070";
    context.fillRect(x + 16, statY + 46, 292, 5);
    context.fillStyle = accent;
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
