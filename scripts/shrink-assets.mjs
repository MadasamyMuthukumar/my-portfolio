/**
 * Shrinks source images in src/assets/ before they enter git.
 *
 * Phone photos arrive at 3000x4000 and 4MB. Nothing on this site displays an
 * image wider than ~800px, so committing the originals would put ~9MB in git
 * history permanently to deliver ~125KB to visitors — and history cannot be
 * slimmed later without a rewrite.
 *
 * MAX_EDGE is deliberately double the largest displayed size, so there is
 * headroom for layout changes and no visible quality difference.
 *
 * Idempotent: anything already within the limit is skipped, so it is safe to
 * re-run whenever new images are dropped in.
 *
 *   node scripts/shrink-assets.mjs           # rewrite oversized files in place
 *   node scripts/shrink-assets.mjs --dry-run # report only
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const DIR = 'src/assets';
const MAX_EDGE = 1600;
const JPEG_QUALITY = 82;
const DRY = process.argv.includes('--dry-run');

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

let before = 0;
let after = 0;
let touched = 0;

for (const name of files.sort()) {
  const path = join(DIR, name);
  const original = (await stat(path)).size;
  before += original;

  const meta = await sharp(path).metadata();
  const longEdge = Math.max(meta.width, meta.height);

  if (longEdge <= MAX_EDGE) {
    after += original;
    console.log(
      `  skip    ${name.padEnd(14)} ${String(meta.width) + 'x' + meta.height} already within ${MAX_EDGE}px`,
    );
    continue;
  }

  const ext = extname(name).toLowerCase();
  const isPng = ext === '.png';
  // Write beside the original, then swap — a failure mid-encode cannot leave a
  // truncated file where the source used to be.
  const tmp = join(DIR, `.${basename(name)}.tmp${ext}`);

  // No .withMetadata() on purpose: sharp strips metadata by default, and
  // calling it would ADD metadata back. These photos carry capture
  // timestamps, device strings and a GPS block, none of which belong in a
  // public repo.
  const pipeline = sharp(path).resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: 'inside',
  });

  const out = isPng
    ? pipeline.png({ compressionLevel: 9 })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  if (DRY) {
    const buf = await out.toBuffer();
    after += buf.length;
    touched++;
    console.log(
      `  would   ${name.padEnd(14)} ${longEdge}px ${kb(original)} -> ${kb(buf.length)}`,
    );
    continue;
  }

  await out.toFile(tmp);
  const shrunk = (await stat(tmp)).size;

  // Re-encoding a small file can make it bigger; keep whichever is smaller.
  if (shrunk >= original) {
    await unlink(tmp);
    after += original;
    console.log(
      `  keep    ${name.padEnd(14)} re-encode was larger, left as-is`,
    );
    continue;
  }

  await rename(tmp, path);
  after += shrunk;
  touched++;
  console.log(
    `  shrink  ${name.padEnd(14)} ${longEdge}px ${kb(original)} -> ${kb(shrunk)}`,
  );
}

console.log(
  `\n${touched} file(s) ${DRY ? 'would change' : 'changed'} — ` +
    `${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB`,
);
