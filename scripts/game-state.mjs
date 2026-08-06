// Sparar THE GAME:s framsteg lokalt i webbläsaren (per enhet/telefon).
// Skriver bara över det värde ett uppdrag faktiskt påverkar, resten av
// kortet kommer alltid från characters.mjs.
const STATS_KEY = "tq_game_stats_v1";
const LOG_KEY = "tq_game_log_v1";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadOverrides() {
  return readJSON(STATS_KEY, {});
}

export function getCurrentValue(character, statLabel) {
  const overrides = loadOverrides();
  const override = overrides[character.name]?.[statLabel];
  if (override != null) return override;
  const base = character.stats.find((s) => s.label === statLabel);
  return base ? base.value : 0;
}

// Returnerar en ny lista med character.stats[].value uppdaterade med
// sparade framsteg, utan att röra originaldatan i characters.mjs.
export function applyOverrides(characters) {
  return characters.map((c) => ({
    ...c,
    stats: c.stats.map((s) => ({ ...s, value: getCurrentValue(c, s.label) }))
  }));
}

export function applyResult(character, statLabel, delta) {
  const overrides = loadOverrides();
  const stat = character.stats.find((s) => s.label === statLabel);
  const max = stat ? stat.max : 10;
  const current = getCurrentValue(character, statLabel);
  const next = Math.max(0, Math.min(max, current + delta));
  if (!overrides[character.name]) overrides[character.name] = {};
  overrides[character.name][statLabel] = next;
  writeJSON(STATS_KEY, overrides);
  return next;
}

export function addLogEntry(entry) {
  const log = readJSON(LOG_KEY, []);
  log.unshift({ ...entry, ts: Date.now() });
  writeJSON(LOG_KEY, log.slice(0, 50));
}

export function getLog(limit = 8) {
  return readJSON(LOG_KEY, []).slice(0, limit);
}
