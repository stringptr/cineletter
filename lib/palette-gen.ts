import { Vibrant } from "node-vibrant/node";

export async function getImagePalette(imageurl: string) {
  const palette = await Vibrant.from(imageurl).getPalette();
  return palette;
}

function hexToRgb(hex: string) {
  const clean = hex.replace(/^#/, "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Perceived brightness (ITU-R BT.709)
function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isBackgroundBright(hex: string, threshold = 160) {
  const lum = getLuminance(hex);
  return lum > threshold;
}
