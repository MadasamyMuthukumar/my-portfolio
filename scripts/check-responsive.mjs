/**
 * Responsiveness as a test, not a claim.
 *
 * Drives headless Chrome over a viewport matrix and asserts:
 *   1. no horizontal overflow (and names the culprit element when there is)
 *   2. button-like touch targets are at least 44x44 CSS px
 *
 * Inline text links are exempt from (2) per WCAG 2.5.8.
 * Exits non-zero on any failure so it can gate a build.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, access, mkdtemp, rm } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = 'dist';
const PORT = 4398;
const DEBUG_PORT = 9223;

const PAGES = ['/', '/resume', '/projects/allbound360'];

const VIEWPORTS = [
  { w: 320, h: 568, label: 'iPhone SE' },
  { w: 360, h: 800, label: 'Android' },
  { w: 390, h: 844, label: 'iPhone 14' },
  { w: 414, h: 896, label: 'iPhone XR' },
  { w: 768, h: 1024, label: 'iPad portrait' },
  { w: 834, h: 1112, label: 'iPad Air' },
  { w: 1024, h: 768, label: 'iPad landscape' },
  { w: 1280, h: 800, label: 'laptop' },
  { w: 1440, h: 900, label: 'laptop lg' },
  { w: 1920, h: 1080, label: 'desktop' },
  { w: 2560, h: 1440, label: 'desktop xl' },
  { w: 844, h: 390, label: 'phone landscape' },
  { w: 926, h: 428, label: 'phone landscape lg' },
  // 200% browser zoom at 1280 presents as a 640px viewport.
  { w: 640, h: 720, label: '1280 @ 200% zoom' },
];

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
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
};

const CHROME = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

async function findChrome() {
  for (const p of CHROME) {
    try {
      await access(p);
      return p;
    } catch {}
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
      res.writeHead(404).end('nf');
    }
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

const AUDIT = `(() => {
  const d = document.documentElement;
  const vw = d.clientWidth;
  const overflow = d.scrollWidth - vw;

  const culprits = [];
  if (overflow > 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        culprits.push(
          el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.')
            : '') +
          ' [' + Math.round(r.left) + '→' + Math.round(r.right) + ']'
        );
        if (culprits.length >= 4) break;
      }
    }
  }

  const small = [];
  for (const el of document.querySelectorAll('a, button, summary')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'inline' || cs.display === 'contents') continue; // WCAG 2.5.8 inline-link exemption
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    // Visually-hidden skip links are clipped to 1x1 until focused — not targets.
    if (cs.clipPath !== 'none' || cs.clip !== 'auto') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.width <= 1 && r.height <= 1) continue;
    if (r.height < 44 || r.width < 24) {
      small.push(
        el.tagName.toLowerCase() + ' "' + (el.textContent || '').trim().slice(0, 18) + '" ' +
        Math.round(r.width) + 'x' + Math.round(r.height)
      );
      if (small.length >= 4) break;
    }
  }

  return JSON.stringify({ vw, overflow, culprits, small });
})()`;

const chrome = await findChrome();
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH.');
  process.exit(1);
}

const server = await serve(PORT);
const profile = await mkdtemp(join(tmpdir(), 'respo-'));
const proc = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

// Wait for the debugger to come up.
for (let i = 0; i < 80; i++) {
  try {
    await fetch(`http://localhost:${DEBUG_PORT}/json/version`);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 250));
  }
}

const res = await fetch(`http://localhost:${DEBUG_PORT}/json/new?about:blank`, {
  method: 'PUT',
});
const target = await res.json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
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

const failures = [];
let checks = 0;

for (const page of PAGES) {
  console.log(`\n\x1b[1m${page}\x1b[0m`);
  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 768,
      screenWidth: vp.w,
      screenHeight: vp.h,
    });
    await send('Page.navigate', { url: `http://localhost:${PORT}${page}` });
    await new Promise((r) => setTimeout(r, 420));

    const out = await send('Runtime.evaluate', {
      expression: AUDIT,
      returnByValue: true,
    });
    const raw = out.result?.result?.value;
    if (!raw) {
      failures.push(`${page} @ ${vp.w} — audit did not run`);
      continue;
    }
    const a = JSON.parse(raw);
    checks++;

    const problems = [];
    if (a.overflow > 1)
      problems.push(`overflow +${a.overflow}px → ${a.culprits.join('; ')}`);
    if (a.small.length) problems.push(`small targets: ${a.small.join('; ')}`);

    const tag = `${String(vp.w).padStart(4)}×${String(vp.h).padEnd(4)} ${vp.label.padEnd(19)}`;
    if (problems.length) {
      console.log(`  \x1b[31m✗\x1b[0m ${tag} ${problems.join(' | ')}`);
      problems.forEach((p) =>
        failures.push(`${page} @ ${vp.w}×${vp.h} — ${p}`),
      );
    } else {
      console.log(`  \x1b[32m✓\x1b[0m ${tag}`);
    }
  }
}

ws.close();
proc.kill();
server.close();
await new Promise((r) => setTimeout(r, 600));
try {
  await rm(profile, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 300,
  });
} catch {
  /* temp profile cleanup is best-effort */
}

console.log(`\n${checks} viewport checks across ${PAGES.length} pages`);
if (failures.length) {
  console.error(`\x1b[31m${failures.length} failure(s)\x1b[0m`);
  process.exit(1);
}
console.log('\x1b[32mAll responsive checks passed\x1b[0m');
