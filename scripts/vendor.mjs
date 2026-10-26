#!/usr/bin/env node
/**
 * Vendor frontend dependencies from node_modules into js/, css/, and fonts/.
 *
 * Classic GitHub Pages runs Jekyll only (no npm), so every built file must be
 * committed. This script copies the pinned versions in package.json to their
 * final locations so updates are reproducible: bump a version, `npm install`,
 * then `npm run vendor` and commit the result.
 *
 * Conventions applied on top of upstream:
 *  - Icon-font @font-face blocks are normalized to woff2+woff (or woff where no
 *    woff2 exists) with `font-display: swap` and `../fonts/...` paths.
 *  - Text fonts are renamed to the site's existing filenames, so the @font-face
 *    rules in css/main.css and the public /fonts/... URLs never change.
 *
 * Text-font sources are chosen to preserve the site's glyph coverage (code
 * blocks use box-drawing ─┌┐└ and arrows →←↩, which Google's hosted "latin"
 * subset drops):
 *  - IBM Plex Mono comes from @ibm/plex "complete" (full charset, ~983 glyphs).
 *    Do NOT switch to @fontsource/ibm-plex-mono — its latin subset regresses
 *    17 rendered characters.
 *  - Lato comes from @fontsource/lato (verified identical coverage to the
 *    previous self-hosted files).
 *
 * Usage:
 *   node scripts/vendor.mjs          # write vendored files
 *   node scripts/vendor.mjs --check  # verify committed files match (no writes)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const nm = (p) => join(root, "node_modules", p);
const dest = (p) => join(root, p);

// [source in node_modules, destination in repo] — byte-for-byte copies.
// Fonts are renamed to the site's existing filenames (see header).
const copies = [
  // litelight-js (ES module + stylesheet; UMD build intentionally not vendored)
  ["litelight-js/dist/lite-light.min.js", "js/lite-light.min.js"],
  ["litelight-js/dist/lite-light.min.css", "css/lite-light.min.css"],

  // remixicon fonts — woff2 + woff only (legacy eot/ttf/svg dropped)
  ["remixicon/fonts/remixicon.woff2", "fonts/remixicon.woff2"],
  ["remixicon/fonts/remixicon.woff", "fonts/remixicon.woff"],

  // academicons font — upstream ships no woff2, so woff is the only modern format
  ["academicons/fonts/academicons.woff", "fonts/academicons.woff"],

  // IBM Plex Mono 400 — @ibm/plex "complete" (full charset: box-drawing, arrows)
  [
    "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff2/IBMPlexMono-Regular.woff2",
    "fonts/IBMPlexMono-Regular.woff2",
  ],
  [
    "@ibm/plex/IBM-Plex-Mono/fonts/complete/woff/IBMPlexMono-Regular.woff",
    "fonts/IBMPlexMono-Regular.woff",
  ],

  // Lato (latin) 300 / 400 / 700 — @fontsource/lato (verified same coverage)
  [
    "@fontsource/lato/files/lato-latin-300-normal.woff2",
    "fonts/lato-v17-latin-300.woff2",
  ],
  [
    "@fontsource/lato/files/lato-latin-300-normal.woff",
    "fonts/lato-v17-latin-300.woff",
  ],
  [
    "@fontsource/lato/files/lato-latin-400-normal.woff2",
    "fonts/lato-v17-latin-regular.woff2",
  ],
  [
    "@fontsource/lato/files/lato-latin-400-normal.woff",
    "fonts/lato-v17-latin-regular.woff",
  ],
  [
    "@fontsource/lato/files/lato-latin-700-normal.woff2",
    "fonts/lato-v17-latin-700.woff2",
  ],
  [
    "@fontsource/lato/files/lato-latin-700-normal.woff",
    "fonts/lato-v17-latin-700.woff",
  ],
];

const remixFace = `@font-face {
  font-family: "remixicon";
  font-display: swap;
  src: url("../fonts/remixicon.woff2") format("woff2"),
    url("../fonts/remixicon.woff") format("woff");
}`;

const academiconsFace = `@font-face {
    font-family: 'Academicons';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../fonts/academicons.woff') format('woff');
}`;

// [source, destination, transform] — copies that also rewrite the @font-face.
const transforms = [
  [
    "remixicon/fonts/remixicon.css",
    "css/remixicon.css",
    (s) => s.replace(/@font-face\s*\{[^}]*\}/, remixFace),
  ],
  [
    "academicons/css/academicons.css",
    "css/academicons.css",
    (s) => s.replace(/@font-face\s*\{[^}]*\}/, academiconsFace),
  ],
];

let wrote = 0;
const drift = [];

function emit(relPath, buf) {
  if (check) {
    let actual = null;
    try {
      actual = readFileSync(dest(relPath));
    } catch {
      drift.push(`${relPath} (missing)`);
      return;
    }
    if (!actual.equals(buf)) drift.push(relPath);
    return;
  }
  mkdirSync(dirname(dest(relPath)), { recursive: true });
  writeFileSync(dest(relPath), buf);
  wrote++;
}

for (const [src, out] of copies) emit(out, readFileSync(nm(src)));
for (const [src, out, tf] of transforms)
  emit(out, Buffer.from(tf(readFileSync(nm(src), "utf8")), "utf8"));

if (check) {
  if (drift.length) {
    console.error("Vendored files out of sync with node_modules:");
    for (const f of drift) console.error("  - " + f);
    console.error("\nRun `npm run vendor` and commit the result.");
    process.exit(1);
  }
  console.log("OK: vendored files match node_modules.");
} else {
  console.log(`Vendored ${wrote} file(s).`);
}
