import { spawn } from 'node:child_process';

const host = '127.0.0.1';
const port = 4173;
const baseUrl = `http://${host}:${port}`;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const routes = ['/', '/tjanster', '/om-oss', '/about', '/kontakt', '/contact'];

const preview = spawn(
  npmCommand,
  ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NO_COLOR: '1' },
  },
);

let output = '';
preview.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
preview.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithTimeout(url, timeoutMs = 5_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function waitUntilReady() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (preview.exitCode !== null) {
      throw new Error(`Vite preview exited before becoming ready.\n${output.slice(-2_000)}`);
    }

    try {
      const response = await fetchWithTimeout(baseUrl, 2_000);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }

    await delay(250);
  }

  throw new Error(`Vite preview did not become ready.\n${output.slice(-2_000)}`);
}

async function stopPreview() {
  if (preview.exitCode !== null) return;

  preview.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => preview.once('exit', resolve)),
    delay(2_000),
  ]);

  if (preview.exitCode === null) preview.kill('SIGKILL');
}

try {
  await waitUntilReady();

  for (const route of routes) {
    const response = await fetchWithTimeout(`${baseUrl}${route}`);
    const body = await response.text();

    if (response.status !== 200) {
      throw new Error(`Local preview returned HTTP ${response.status} for ${route}.`);
    }

    if (!body.includes('id="root"')) {
      throw new Error(`Local preview response for ${route} did not contain the React root.`);
    }
  }

  console.log(`Local production preview passed for ${routes.length} routes.`);
} finally {
  await stopPreview();
}
