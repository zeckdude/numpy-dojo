import fs from 'fs';
import path from 'path';

const ILLUSTRATION_EXT = /\.(png|webp|jpe?g|svg)$/i;

/**
 * Paths under public/illustrations that exist on disk (e.g. `/illustrations/why-foo.png`).
 * Used to hide "Why this matters" figures until the file is added.
 */
export function getExistingWhyIllustrationSrcs(): string[] {
  const dir = path.join(process.cwd(), 'public', 'illustrations');
  let names: string[] = [];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.startsWith('why-') && ILLUSTRATION_EXT.test(n))
    .map((n) => `/illustrations/${n}`);
}
