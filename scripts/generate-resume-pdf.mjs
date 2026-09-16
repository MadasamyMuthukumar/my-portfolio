/**
 * Generates the résumé PDF from the built /resume page, so the HTML page and
 * the PDF can never drift — both render from src/data/resume.ts.
 *
 * Uses the system Chrome rather than pulling in Playwright (~300 MB of
 * browsers) for one print job. If Chrome is unavailable the build continues
 * with a warning: a missing PDF should not fail a deploy.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, access, mkdtemp, rm, copyFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = 'dist';
const OUT = join(DIST, 'madasamy-muthukumar-resume.pdf');
const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

async function findChrome() {
  for (const path of CANDIDATES) {
    try {
      await access(path);
      return path;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function serve(port) {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      if (!extname(path)) path += '/index.html';
      const body = await readFile(join(DIST, path));
      res.writeHead(200, {
        'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

const chrome = await findChrome();
if (!chrome) {
  console.warn(
    '[resume-pdf] No Chrome found — skipping PDF. Set CHROME_PATH to enable.',
  );
  process.exit(0);
}

const PORT = 4399;
const server = await serve(PORT);
const profileDir = await mkdtemp(join(tmpdir(), 'resume-pdf-'));
// Chrome writes to its CWD, so print into the temp profile then move it.
const staged = join(profileDir, 'out.pdf');

const exitCode = await new Promise((resolve) => {
  const proc = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${staged}`,
      `http://localhost:${PORT}/resume-print`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  let stderr = '';
  proc.stderr.on('data', (d) => (stderr += d));
  proc.on('close', (code) => {
    if (code !== 0) console.error(stderr.trim());
    resolve(code);
  });
});

server.close();

if (exitCode === 0) {
  await copyFile(staged, OUT);
  const { size } = await import('node:fs').then((fs) => fs.statSync(OUT));
  console.log(`[resume-pdf] ${OUT} (${(size / 1024).toFixed(0)} KB)`);
} else {
  console.warn('[resume-pdf] Chrome failed — continuing without a PDF.');
}

await rm(profileDir, { recursive: true, force: true });
