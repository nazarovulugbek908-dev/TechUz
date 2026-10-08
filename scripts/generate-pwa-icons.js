import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePngBuffer(width, height, pixelShader) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression deflate
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = createPngChunk('IHDR', ihdrData);

  // Scanlines: each row has 1 filter byte (0) + width * 4 bytes RGBA
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y, width, height);
      rawData[offset++] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[offset++] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createPngChunk('IDAT', compressedData);
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Shader for standard icon (Rounded rectangle / squircle with smartphone glyph)
function standardIconShader(x, y, w, h) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1; // -1 to 1
  const r = Math.sqrt(nx * nx + ny * ny);

  // Background Gradient (Orange #FF7A00 to #FF5500)
  const gradT = (ny + 1) / 2;
  const bgR = 255;
  const bgG = 122 - gradT * 40; // 122 to 82
  const bgB = 0;

  // Squircle distance formula: (|x|^4 + |y|^4)^(1/4)
  const squircle = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4), 0.25);
  if (squircle > 0.95) {
    // Smooth anti-aliased border or transparent
    const edgeAlpha = Math.max(0, Math.min(1, (1.0 - squircle) / 0.05));
    return [bgR, bgG, bgB, edgeAlpha * 255];
  }

  // Draw phone frame inside
  // Phone center: x in [-0.42, 0.42], y in [-0.68, 0.68]
  const px = Math.abs(nx);
  const py = Math.abs(ny);

  // Phone body outer
  const inPhoneOuter = px <= 0.42 && py <= 0.68;
  const phoneCorner = Math.sqrt(Math.max(0, px - 0.32) ** 2 + Math.max(0, py - 0.58) ** 2);
  const isPhoneBody = inPhoneOuter && phoneCorner <= 0.10;

  // Phone screen inner
  const inScreen = px <= 0.35 && py <= 0.48;

  // Home indicator / button
  const isHomeBtn = Math.sqrt(px * px + (ny - 0.58) ** 2) <= 0.045;

  // Top speaker notch
  const isSpeaker = px <= 0.10 && Math.abs(ny + 0.58) <= 0.015;

  // Lightning bolt / stylized "T" inside screen
  // Stylized T & Lightning in screen:
  // Top bar of T: x in [-0.22, 0.22], y in [-0.32, -0.22]
  const isTTop = Math.abs(nx) <= 0.22 && ny >= -0.32 && ny <= -0.22;
  // Stem of T with diagonal tech angle
  const isTStem = Math.abs(nx + (ny * 0.12)) <= 0.07 && ny >= -0.22 && ny <= 0.28;

  if (isPhoneBody) {
    if (inScreen) {
      if (isTTop || isTStem) {
        // Vibrant Orange Glyph inside white screen
        return [255, 122, 0, 255];
      }
      // Screen background: crisp white/light
      return [255, 255, 255, 255];
    }
    if (isHomeBtn || isSpeaker) {
      return [255, 122, 0, 255];
    }
    // Phone outer bezel: Solid Crisp White
    return [255, 255, 255, 255];
  }

  // Subtle gloss/glow arc in top-left
  const glossDist = Math.sqrt((nx + 0.5) ** 2 + (ny + 0.5) ** 2);
  if (glossDist < 0.8) {
    const gloss = (1 - glossDist / 0.8) * 35;
    return [bgR, Math.min(255, bgG + gloss), Math.min(255, bgB + gloss), 255];
  }

  return [bgR, bgG, bgB, 255];
}

// Shader for maskable icon (has 10% safe margin padding all around)
function maskableIconShader(x, y, w, h) {
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;

  // Full bleed background: Orange gradient #FF7A00 to #FF5500
  const gradT = (ny + 1) / 2;
  const bgR = 255;
  const bgG = 122 - gradT * 40;
  const bgB = 0;

  // Scale down glyph to safe zone (0.75x)
  const snx = nx / 0.72;
  const sny = ny / 0.72;
  const px = Math.abs(snx);
  const py = Math.abs(sny);

  const inPhoneOuter = px <= 0.42 && py <= 0.68;
  const phoneCorner = Math.sqrt(Math.max(0, px - 0.32) ** 2 + Math.max(0, py - 0.58) ** 2);
  const isPhoneBody = inPhoneOuter && phoneCorner <= 0.10;

  const inScreen = px <= 0.35 && py <= 0.48;
  const isHomeBtn = Math.sqrt(px * px + (sny - 0.58) ** 2) <= 0.045;
  const isSpeaker = px <= 0.10 && Math.abs(sny + 0.58) <= 0.015;

  const isTTop = Math.abs(snx) <= 0.22 && sny >= -0.32 && sny <= -0.22;
  const isTStem = Math.abs(snx + (sny * 0.12)) <= 0.07 && sny >= -0.22 && sny <= 0.28;

  if (isPhoneBody) {
    if (inScreen) {
      if (isTTop || isTStem) {
        return [255, 122, 0, 255];
      }
      return [255, 255, 255, 255];
    }
    if (isHomeBtn || isSpeaker) {
      return [255, 122, 0, 255];
    }
    return [255, 255, 255, 255];
  }

  return [bgR, bgG, bgB, 255];
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating PWA icons for TechUz...');

// 192x192
const icon192 = generatePngBuffer(192, 192, standardIconShader);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
console.log('✅ Generated public/icons/icon-192x192.png');

// 512x512
const icon512 = generatePngBuffer(512, 512, standardIconShader);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
console.log('✅ Generated public/icons/icon-512x512.png');

// 512x512 Maskable
const iconMaskable = generatePngBuffer(512, 512, maskableIconShader);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), iconMaskable);
console.log('✅ Generated public/icons/icon-maskable-512x512.png');

// 180x180 Apple Touch Icon
const appleTouch = generatePngBuffer(180, 180, standardIconShader);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouch);
console.log('✅ Generated public/icons/apple-touch-icon.png');

// SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="techuz-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="100%" stop-color="#FF5500" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#techuz-grad)" />
  <rect x="150" y="80" width="212" height="352" rx="36" fill="#FFFFFF" />
  <rect x="168" y="130" width="176" height="248" rx="16" fill="#0F172A" />
  <path d="M200 180 H312 V210 H272 V320 H240 V210 H200 Z" fill="#FF7A00" />
  <rect x="236" y="100" width="40" height="8" rx="4" fill="#E2E8F0" />
  <circle cx="256" cy="405" r="12" fill="#E2E8F0" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.resolve('public', 'favicon.svg'), svgContent);
console.log('✅ Generated SVG icons');

console.log('🎉 All PWA icons generated successfully!');
