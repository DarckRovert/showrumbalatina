import fs from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const TARGET_URL = 'https://showrumbalatina.github.io/';
const OUT_DIR = path.resolve('public/images');

await fs.mkdir(OUT_DIR, { recursive: true });

const svgString = await QRCode.toString(TARGET_URL, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 4,
  color: {
    dark: '#0a0a0f',
    light: '#ffffff',
  },
});

const svgPath = path.join(OUT_DIR, 'qr-showrumbalatina.svg');
await fs.writeFile(svgPath, svgString, 'utf8');

const pngPath = path.join(OUT_DIR, 'qr-showrumbalatina.png');
await QRCode.toFile(pngPath, TARGET_URL, {
  errorCorrectionLevel: 'H',
  margin: 4,
  width: 1000,
  color: {
    dark: '#0a0a0f',
    light: '#ffffff',
  },
});

console.log('Generated QR SVG:', svgPath);
console.log('Generated QR PNG:', pngPath);
