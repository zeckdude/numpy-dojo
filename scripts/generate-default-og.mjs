/**
 * Generates Open Graph PNGs (1200×630) matching site typography and light/dark themes.
 *
 * Fonts: Playfair Display 700 (brand + headline), IBM Plex Sans 400 (body) — same as globals.css.
 * Colors: tokens from html[data-theme='dark'] and html[data-theme='light'].
 * Kimono mark: `public/og/kimono-emoji.png` composited on the header bar.
 *
 * Pipeline: satori (JSX → SVG with correct font shaping) → resvg (SVG → PNG) → sharp (emoji composite)
 *
 * Outputs:
 *   public/og/default.png       — dark theme (default social preview)
 *   public/og/default-light.png — light theme (reference / optional use)
 *
 * Run: npm run generate-og
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'og');
const emojiPath = join(root, 'public', 'og', 'kimono-emoji.png');
const fontsDir = join(__dirname, 'og-assets', 'fonts');

const playfairTtf = readFileSync(join(fontsDir, 'PlayfairDisplay-Bold.ttf'));
const plexSansTtf = readFileSync(join(fontsDir, 'IBMPlexSans-Regular.ttf'));

const W = 1200;
const H = 630;
const HEADER_H = 96;
const EMOJI_SIZE = 52;
const PAD_X = 72;

const fonts = [
  { name: 'Playfair Display', data: playfairTtf.buffer, weight: 700, style: 'normal' },
  { name: 'IBM Plex Sans', data: plexSansTtf.buffer, weight: 400, style: 'normal' },
];

function OgCard({ theme }) {
  const isDark = theme === 'dark';
  const bgCard   = isDark ? '#0e1219' : '#ffffff';
  const border   = isDark ? '#1c2433' : '#c5cad6';
  const bgDeep   = isDark ? '#0a0f18' : '#ffffff';
  const bgRaised = isDark ? '#141a24' : '#ececef';
  const textHi   = isDark ? '#eaeff6' : '#0f172a';
  const textMid  = isDark ? '#8d98ab' : '#475569';
  const logoDojo = isDark ? '#d6854c' : '#b45309';

  return React.createElement('div', {
    style: {
      width: W, height: H, display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Sans',
    },
  },
    // Header bar
    React.createElement('div', {
      style: {
        height: HEADER_H, display: 'flex', alignItems: 'center',
        paddingLeft: PAD_X + EMOJI_SIZE + 8, paddingRight: PAD_X,
        background: bgCard,
        borderBottom: `1px solid ${border}`,
      },
    },
      React.createElement('span', {
        style: {
          fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700,
          letterSpacing: '0.02em',
        },
      },
        React.createElement('span', { style: { color: textHi } }, 'NumPy'),
        React.createElement('span', { style: { color: logoDojo, marginLeft: 8 } }, 'Dojo'),
      ),
    ),
    // Body
    React.createElement('div', {
      style: {
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        paddingLeft: PAD_X, paddingRight: PAD_X, paddingTop: 56,
        background: `linear-gradient(135deg, ${bgDeep}, ${bgRaised})`,
      },
    },
      React.createElement('div', {
        style: {
          fontFamily: 'Playfair Display', fontSize: 54, fontWeight: 700,
          color: textHi, lineHeight: 1.15, marginBottom: 32,
        },
      }, 'Learn NumPy by doing'),
      React.createElement('div', {
        style: {
          fontSize: 26, color: textMid, lineHeight: 1.5,
        },
      }, 'Hands-on lessons, scenarios, and quizzes in the browser.'),
      React.createElement('div', {
        style: {
          fontSize: 26, color: textMid, lineHeight: 1.5, marginTop: 6,
        },
      }, 'Free to use. No paywall or account.'),
    ),
  );
}

const SCALE = 2;

async function renderTheme(theme, outFile) {
  const element = React.createElement(OgCard, { theme });

  const svg = await satori(element, {
    width: W,
    height: H,
    fonts,
  });

  // Render at 2x for crisp text, then downscale with Lanczos sharpening
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W * SCALE } });
  let pngBuf = Buffer.from(resvg.render().asPng());

  if (existsSync(emojiPath)) {
    const emojiBuf = await sharp(emojiPath)
      .resize(EMOJI_SIZE * SCALE, EMOJI_SIZE * SCALE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const emojiTop = Math.round((HEADER_H * SCALE - EMOJI_SIZE * SCALE) / 2);

    pngBuf = await sharp(pngBuf)
      .composite([{ input: emojiBuf, left: PAD_X * SCALE, top: emojiTop }])
      .png()
      .toBuffer();
  }

  // Downscale to final 1200×630 with Lanczos for sharp results
  pngBuf = await sharp(pngBuf)
    .resize(W, H, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .png()
    .toBuffer();

  writeFileSync(outFile, pngBuf);
  console.log('Wrote', outFile);
}

if (!existsSync(emojiPath)) {
  console.warn('Missing', emojiPath, '— add that PNG to generate OG images with the kimono mark.');
}

mkdirSync(outDir, { recursive: true });
await renderTheme('dark', join(outDir, 'default.png'));
await renderTheme('light', join(outDir, 'default-light.png'));
