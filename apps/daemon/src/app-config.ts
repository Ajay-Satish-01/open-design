// @ts-nocheck
// Daemon-backed app preferences (onboarding state, agent/skill/DS selection).
//
// The web frontend pushes non-sensitive preferences here via PUT
// /api/app-config; the daemon persists them to .od/app-config.json.
// This survives browser storage resets and origin changes so onboarding
// and agent selection don't reappear unexpectedly.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_KEYS = new Set([
  'onboardingCompleted',
  'agentId',
  'agentModels',
  'skillId',
  'designSystemId',
]);

function configFile(projectRoot) {
  return path.join(projectRoot, '.od', 'app-config.json');
}

export async function readAppConfig(projectRoot) {
  try {
    const raw = await readFile(configFile(projectRoot), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return {};
  } catch (err) {
    if (err && err.code === 'ENOENT') return {};
    throw err;
  }
}

export async function writeAppConfig(projectRoot, partial) {
  const existing = await readAppConfig(projectRoot);
  const next = { ...existing };
  for (const key of Object.keys(partial)) {
    if (ALLOWED_KEYS.has(key)) {
      next[key] = partial[key];
    }
  }
  const file = configFile(projectRoot);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(next, null, 2), 'utf8');
  return next;
}
