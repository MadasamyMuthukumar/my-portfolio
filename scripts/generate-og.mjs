/**
 * Captures the /og-preview/* routes as 1200x630 PNGs, then removes those
 * routes from dist so they never ship as real pages.
 *
 * Uses system Chrome — the same approach as the résumé PDF — rather than
 * adding Satori + resvg for three static images.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import {
  readFile,
  access,
  mkdtemp,
  rm,
  writeFile,
  mkdir,
  readdir,
} from 'node:fs/promises';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = 'dist',
  PORT = 4396,
  DEBUG = 9226;
const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.xml': 'application/xml',
};

async function findChrome() {
  for (const p of [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)) {
    try {
      await access(p);
      return p;
    } catch {}
  }
  return null;
}
function serve(port) {
  const s = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      if (!extname(p)) p += '/index.html';
      const b = await readFile(join(DIST, p));
      res.writeHead(200, {
        'content-type': TYPES[extname(p)] ?? 'application/octet-stream',
      });
      res.end(b);
    } catch {
      res.writeHead(404).end('nf');
    }
  });
  return new Promise((r) => s.listen(port, () => r(s)));
}

const chrome = await findChrome();
if (!chrome) {
  console.warn('[og] No Chrome — skipping OG images.');
  process.exit(0);
}

let slugs = [];
try {
  slugs = (await readdir(join(DIST, 'og-preview'), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
} catch {
  console.warn('[og] no og-preview routes found');
  process.exit(0);
}

await mkdir(join(DIST, 'og'), { recursive: true });
const server = await serve(PORT);
const profile = await mkdtemp(join(tmpdir(), 'og-'));
const proc = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--force-color-profile=srgb',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

for (let i = 0; i < 80; i++) {
  try {
    await fetch(`http://localhost:${DEBUG}/json/version`);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 250));
  }
}
const t = await (
  await fetch(`http://localhost:${DEBUG}/json/new?about:blank`, {
    method: 'PUT',
  })
).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send('Page.enable');
await send('Page.bringToFront');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1200,
  height: 630,
  deviceScaleFactor: 1,
  mobile: false,
});
// OG cards are always light — social clients show them on their own chrome.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: 'light' }],
});

for (const slug of slugs) {
  await send('Page.navigate', {
    url: `http://localhost:${PORT}/og-preview/${slug}`,
  });
  await new Promise((r) => setTimeout(r, 900));
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
  });
  if (!shot.result?.data) {
    console.warn(`[og] failed: ${slug}`);
    continue;
  }
  await writeFile(
    join(DIST, 'og', `${slug}.png`),
    Buffer.from(shot.result.data, 'base64'),
  );
  console.log(`[og] dist/og/${slug}.png`);
}

ws.close();
proc.kill();
server.close();
await new Promise((r) => setTimeout(r, 600));
try {
  await rm(profile, { recursive: true, force: true, maxRetries: 3 });
} catch {}
// The preview routes were scaffolding — they must not ship.
await rm(join(DIST, 'og-preview'), { recursive: true, force: true });
console.log('[og] removed dist/og-preview');
