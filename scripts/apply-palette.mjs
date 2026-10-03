import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

// Keep generated illustrations and their source scripts in the reference palette.
const palette = ['080e0e', '2e3029', '706c64', 'e3e6e4', '50552d', 'a18e7c'];
const files = [...readdirSync('public/media').filter(name => name.endsWith('.svg')).map(name => `public/media/${name}`), 'public/favicon.svg', 'scripts/create-art.mjs', 'scripts/create-social-art.mjs'];
const rgb = hex => [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
for (const file of files) {
  const text = readFileSync(file, 'utf8').replace(/#([\da-f]{6})([\da-f]{2})?\b/gi, (_, hex, alpha = '') => {
    const original = rgb(hex);
    const nearest = palette.reduce((best, candidate) => {
      const distance = rgb(candidate).reduce((sum, value, index) => sum + (value - original[index]) ** 2, 0);
      return distance < best.distance ? { hex: candidate, distance } : best;
    }, { hex: palette[0], distance: Infinity });
    return `#${nearest.hex}${alpha}`;
  });
  writeFileSync(file, text);
}
