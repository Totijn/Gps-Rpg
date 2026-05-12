import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(import.meta.dir, 'db.json');

export function saveState(players: any) {
  try {
    const data = JSON.stringify(players, null, 2);
    writeFileSync(DB_PATH, data);
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function loadState() {
  if (!existsSync(DB_PATH)) return {};
  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load state:', e);
    return {};
  }
}
