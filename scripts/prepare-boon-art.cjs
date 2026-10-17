// Converts selected generated illustrations to lightweight local game assets.
// Usage: node scripts/prepare-boon-art.cjs <source-manifest.json>
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); }
catch { sharp = require('C:/Users/os_ap/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'); }
async function main() {
  const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = path.resolve(__dirname, '../assets/boon-art/scenes');
  fs.mkdirSync(out, { recursive: true });
  for (const [id, source] of Object.entries(manifest)) {
    if (!/^[a-z]+$/.test(id)) throw new Error('Invalid event ID: ' + id);
    const target = path.join(out, id + '.webp');
    await sharp(source).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 88 }).toFile(target);
    console.log(id + ': ' + Math.round(fs.statSync(target).size / 1024) + ' KB');
  }
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });
