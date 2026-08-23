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

  drawTitle(context, summary, images.title, accent);
  drawVisual(context, summary, images, panel, accent);
  drawMetrics(context, summary, panel, accent);
  drawAchievements(context, summary, images.achievementIcons, accent);
  drawStats(context, summary, accent);
}

function drawTitle(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icon: HTMLImageElement | null,
  accent: string,
): void {
  drawTitleSpotlights(context, accent);

  if (icon) {
    drawContainedImage(context, icon, 290, 35, 160, 110);
  }

  context.fillStyle = accent;
  context.font = "900 62px system-ui, sans-serif";
  context.textAlign = "center";
  drawWrappedText(context, summary.titleName, 370, 160, 560, 66, 2);
  context.fillStyle = "#c9d2e7";
  context.font = "600 24px system-ui, sans-serif";
  drawWrappedText(context, summary.titleDescription, 370, 270, 560, 34, 4);
  context.fillStyle = accent;
  context.font = "700 18px system-ui, sans-serif";
  drawWrappedText(context, summary.ageLabel, 370, 410, 560, 26, 2);
  context.textAlign = "left";
}

function drawTitleSpotlights(
  context: CanvasRenderingContext2D,
  accent: string,
): void {
  [
    { angle: -Math.PI / 6, opacity: 0.16, x: 340 },
    { angle: 0, opacity: 0.22, x: 370 },
    { angle: Math.PI / 6, opacity: 0.16, x: 400 },
  ].forEach(({ angle, opacity, x }) => {
    context.save();
    context.fillStyle = accent;
    context.globalAlpha = opacity;
    context.translate(x, 148);
    context.rotate(angle);
    context.fillRect(-12, -105, 24, 105);
    context.restore();
  });
}

function drawVisual(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  images: CardImages,
  panel: string,
  accent: string,
): void {
  context.fillStyle = panel;
  context.fillRect(700, 100, 418, 340);

  if (images.faction) {
    context.save();
    context.globalAlpha = 0.14;
    drawContainedImage(context, images.faction, 730, 145, 360, 220);
    context.restore();
  }

  if (images.zoid) {
    drawContainedImage(context, images.zoid, 755, 175, 310, 170);
  }

  drawRank(context, summary, images.rank, accent);
  context.textAlign = "left";
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.zoid.toUpperCase(), 730, 380);
  context.fillStyle = "#ffffff";
  context.font = "800 30px system-ui, sans-serif";
  drawWrappedText(context, summary.zoidName, 730, 417, 340, 34, 2);
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
    const y = 490 + row * 110;
    context.fillStyle = panel;
    context.fillRect(x, y, 504, 96);
    context.fillStyle = accent;
    context.font = "800 16px system-ui, sans-serif";
    context.fillText(label.toUpperCase(), x + 18, y + 29);
    context.font = `900 ${index === 3 ? 20 : 42}px system-ui, sans-serif`;
    drawWrappedText(context, String(value), x + 18, y + 75, 468, 24, 2);
  });
}

function drawAchievements(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  icons: readonly (HTMLImageElement | null)[],
  accent: string,
): void {
  context.fillStyle = accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.achievements.toUpperCase(), 82, 735);

  if (summary.achievements.length === 0) {
    context.fillStyle = "#ffffff";
    context.font = "700 21px system-ui, sans-serif";
    context.fillText("—", 82, 773);
    return;
  }

  summary.achievements.forEach((achievement, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 82 + column * 357;
    const y = 759 + row * 104;

    const icon = icons[index];

    if (icon) {
      drawContainedImage(context, icon, x, y, 28, 28);
    }

    context.fillStyle = "#ffffff";
    context.font = "700 18px system-ui, sans-serif";
    context.fillText(achievement.name, x + 44, y + 18);
    context.fillStyle = "#c9d2e7";
    context.font = "400 16px system-ui, sans-serif";
    drawWrappedText(
      context,
      achievement.description,
      x + 44,
      y + 46,
      280,
      22,
      3,
    );
  });
}

function drawStats(
  context: CanvasRenderingContext2D,
  summary: FinalSummary,
  accent: string,
): void {
  context.fillStyle = accent;
  context.font = "800 20px system-ui, sans-serif";
  context.fillText(summary.labels.stats.toUpperCase(), 82, 900);

  summary.stats.forEach((stat, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 82 + column * 357;
    const y = 925 + row * 68;

    context.fillStyle = "#ffffff";
    context.font = "700 17px system-ui, sans-serif";
    context.fillText(stat.label, x + 16, y + 24);
    context.textAlign = "right";
    context.fillText(String(stat.value), x + 308, y + 24);
    context.textAlign = "left";
    context.fillStyle = "#556070";
    context.fillRect(x + 16, y + 38, 292, 5);
    context.fillStyle = accent;
    context.fillRect(x + 16, y + 38, (292 * stat.value) / 100, 5);
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
): void {
  const words = text.split(/\s+/u);
  let line = "";
  let lineIndex = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (context.measureText(candidate).width <= maximumWidth) {
      line = candidate;
      continue;
    }

    context.fillText(line, x, y + lineIndex * lineHeight);
    line = word;
    lineIndex += 1;

    if (lineIndex === maximumLines - 1) {
      break;
    }
  }

  if (lineIndex < maximumLines) {
    context.fillText(line, x, y + lineIndex * lineHeight);
  }
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
