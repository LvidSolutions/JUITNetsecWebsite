import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const port = Number.parseInt(process.env.SMOKE_PORT || '4173', 10);
const host = '127.0.0.1';
const origin = `http://${host}:${port}`;
const routes = ['/', '/tjanster', '/om-oss', '/about', '/kontakt', '/contact'];
const viteBin = path.resolve('node_modules/vite/bin/vite.js');

const server = spawn(
  process.execPath,
  [viteBin, 'preview', '--host', host, '--port', String(port), '--strictPort'],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);

let output = '';
server.stdout.on('data', (chunk) => { output += chunk; });
server.stderr.on('data', (chunk) => { output += chunk; });

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Vite preview exited early.\n${output}`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Vite preview.\n${output}`);
}

try {
  await waitForServer();

  for (const route of routes) {
    const response = await fetch(`${origin}${route}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(5_000),
    });
    const html = await response.text();
    if (!response.ok) throw new Error(`${route} returned HTTP ${response.status}`);
    if (!html.includes('<div id="root"></div>')) {
      throw new Error(`${route} did not return the application HTML shell`);
    }
  }

  console.log(`Local production smoke test passed for ${routes.length} routes.`);
} finally {
  server.kill('SIGTERM');
  await new Promise((resolve) => {
    if (server.exitCode !== null) resolve();
    else {
      server.once('exit', resolve);
      setTimeout(() => {
        server.kill('SIGKILL');
        resolve();
      }, 2_000).unref();
    }
  });
}
