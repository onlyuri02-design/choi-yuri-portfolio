import type { SyntheticEvent } from "react";

// Extend only the photograph's edge colours; never stretch or alter the product image.
export function extendImageBackground(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  const surface = image.parentElement;
  if (!surface || !image.naturalWidth) return;
  try {
    const canvas = document.createElement("canvas");
    const rows = 24;
    canvas.width = 2;
    canvas.height = rows;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const edge = Math.min(4, image.naturalWidth);
    context.drawImage(image, 0, 0, edge, image.naturalHeight, 0, 0, 1, rows);
    context.drawImage(image, image.naturalWidth - edge, 0, edge, image.naturalHeight, 1, 0, 1, rows);
    const pixels = context.getImageData(0, 0, 2, rows).data;
    const gradient = (side: number) => `linear-gradient(to bottom, ${Array.from({ length: rows }, (_, row) => {
      const i = (row * 2 + side) * 4;
      return `rgba(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]},${pixels[i + 3] / 255}) ${row / (rows - 1) * 100}%`;
    }).join(", ")})`;
    surface.style.backgroundImage = `${gradient(0)}, ${gradient(1)}`;
    surface.style.backgroundSize = "50.1% 100%, 50.1% 100%";
    surface.style.backgroundPosition = "left center, right center";
    surface.style.backgroundRepeat = "no-repeat";
  } catch {
    // Leave the existing neutral surface when image pixels cannot be read.
  }
}
