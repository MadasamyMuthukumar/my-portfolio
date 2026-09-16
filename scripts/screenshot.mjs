/**
 * Captures screenshots of the built site for visual review.
 *
 * Full-page shots emulate prefers-reduced-motion so the scroll-driven reveals
 * (which sit at opacity 0 until scrolled into view) don't render blank.
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
} from 'node:fs/promises';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = 'dist',
  OUT = '.screens',
  PORT = 4397,
  DEBUG = 9224;
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
  '.xml': 'application/xml',
};

const SHOTS = [
  {
    name: '01-home-desktop-light',
    url: '/',
    w: 1440,
    h: 900,
    dark: false,
    full: true,
  },
  {
    name: '02-home-desktop-dark',
    url: '/',
    w: 1440,
    h: 900,
    dark: true,
    full: true,
  },
  {
    name: '03-home-hero-desktop',
    url: '/',
    w: 1440,
    h: 900,
    dark: false,
    full: false,
  },
  {
    name: '04-home-mobile-light',
    url: '/',
    w: 390,
    h: 844,
    dark: false,
    full: true,
  },
  {
    name: '05-home-hero-mobile',
    url: '/',
    w: 390,
    h: 844,
    dark: false,
    full: false,
  },
  {
    name: '06-case-study',
    url: '/projects/allbound360',
    w: 1440,
    h: 900,
    dark: false,
    full: true,
  },
  {
    name: '07-resume',
    url: '/resume',
    w: 1440,
    h: 900,
    dark: false,
    full: true,
  },
  {
    name: '08-home-tablet',
    url: '/',
    w: 834,
    h: 1112,
    dark: false,
    full: false,
  },
];

async function findChrome() {
  for (const p of [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
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
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      if (!extname(path)) path += '/index.html';
      const b = await readFile(join(DIST, path));
      res.writeHead(200, {
        'content-type': TYPES[extname(path)] ?? 'application/octet-stream',
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
  console.error('No Chrome');
  process.exit(1);
}
await mkdir(OUT, { recursive: true });
const server = await serve(PORT);
const profile = await mkdtemp(join(tmpdir(), 'shot-'));
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

for (const s of SHOTS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: s.w,
    height: s.h,
    deviceScaleFactor: 1,
    mobile: s.w < 768,
  });
  await send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' },
      // Reveals are opacity:0 until scrolled into view; reduced-motion disables
      // them so a full-page capture isn't full of blank sections.
      {
        name: 'prefers-reduced-motion',
        value: s.full ? 'reduce' : 'no-preference',
      },
    ],
  });
  await send('Page.navigate', { url: `http://localhost:${PORT}${s.url}` });
  await new Promise((r) => setTimeout(r, 900));

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: s.full,
    optimizeForSpeed: false,
  });
  const data = shot.result?.data;
  if (!data) {
    console.error(`  ✗ ${s.name}`);
    continue;
  }
  const file = join(OUT, `${s.name}.png`);
  await writeFile(file, Buffer.from(data, 'base64'));
  console.log(`  ✓ ${file}`);
}

ws.close();
proc.kill();
server.close();
await new Promise((r) => setTimeout(r, 600));
try {
  await rm(profile, { recursive: true, force: true, maxRetries: 3 });
} catch {}
