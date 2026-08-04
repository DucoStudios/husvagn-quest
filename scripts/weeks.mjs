// Plockar ut vilka veckonummer en annonstitel nämner, t.ex.
// "v32" -> [32], "v.30-32" -> [30,31,32], "v26,27,28" -> [26,27,28].
export function extractWeeks(text) {
  const weeks = new Set();
  const re = /\bv(?:ecka)?\.?\s*(\d{1,2}(?:\s*[-–,]\s*\d{1,2})*)\b/gi;
  let m;
  while ((m = re.exec(text))) {
    for (const group of m[1].split(",")) {
      const range = group
        .split(/[-–]/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n));
      if (range.length === 2) {
        for (let w = range[0]; w <= range[1]; w++) weeks.add(w);
      } else if (range.length === 1) {
        weeks.add(range[0]);
      }
    }
  }
  return [...weeks];
}

export function matchesWeek(text, week) {
  return extractWeeks(text).includes(week);
}

// Måndagen (UTC) i ISO-vecka `week` för `year`.
export function isoWeekStartDate(year, week) {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay() || 7; // söndag=0 -> 7
  simple.setUTCDate(simple.getUTCDate() - dow + 1);
  return simple;
}

// Nästa gång ISO-vecka `week` börjar, räknat från `from`. Om den redan
// pågår eller har passerat i år rullar den till samma vecka nästa år.
export function nextOccurrenceOfWeekStart(week, from = new Date()) {
  const year = from.getUTCFullYear();
  let start = isoWeekStartDate(year, week);
  if (start <= from) start = isoWeekStartDate(year + 1, week);
  return start;
}
