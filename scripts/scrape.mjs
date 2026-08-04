// Skrapar Bödagårdens Campings husvagnsannonser och underhåller data.json + feed.xml.
// Inga npm-beroenden - kör på Node 20+ (globalt fetch).

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { matchesWeek } from "./weeks.mjs";

const TARGET_WEEK = 32;
const LIST_URL = "https://www.bodagarden.nu/husvagnar-uthyres/";
const SITE_URL = "https://ducostudios.github.io/husvagn-quest/";
const FEED_URL = `${SITE_URL}feed.xml`;
const USER_AGENT =
  "HusvagnQuestBot/1.0 (personligt notistjänst, kontakt: david.bergqvist@gmail.com)";
const DATA_FILE = new URL("../data.json", import.meta.url);
const FEED_FILE = new URL("../feed.xml", import.meta.url);
const MAX_PAGES = 6;
const MAX_FEED_ITEMS = 60;

const SWEDISH_MONTHS = {
  januari: 0, februari: 1, mars: 2, april: 3, maj: 4, juni: 5,
  juli: 6, augusti: 7, september: 8, oktober: 9, november: 10, december: 11
};

function parseSwedishDate(raw) {
  // "18 juli, 2026" -> {iso: "2026-07-18", raw}
  const m = raw.trim().match(/(\d{1,2})\s+([a-zåäö]+),?\s+(\d{4})/i);
  if (!m) return { iso: null, raw };
  const [, day, monthName, year] = m;
  const month = SWEDISH_MONTHS[monthName.toLowerCase()];
  if (month === undefined) return { iso: null, raw };
  const d = new Date(Date.UTC(Number(year), month, Number(day)));
  return { iso: d.toISOString().slice(0, 10), raw };
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

async function fetchPage(pageNum) {
  const url = pageNum <= 1 ? LIST_URL : `${LIST_URL}?pg=${pageNum}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Fetch misslyckades (${res.status}) för ${url}`);
  return res.text();
}

function parseAdverts(html) {
  const adverts = [];
  const blocks = html.split(/<div class="advert-item advert-item-col-\d+ advert-id-(\d+)">/);
  // blocks[0] = allt innan första annonsen, sedan alternerande [id, blockHtml, id, blockHtml, ...]
  for (let i = 1; i < blocks.length; i += 2) {
    const id = blocks[i];
    const chunk = blocks[i + 1] ?? "";

    const linkMatch = chunk.match(/<a href="([^"]+)" title="([^"]+)" class="advert-link-wrap">/);
    if (!linkMatch) continue;
    const url = linkMatch[1];
    const title = decodeEntities(linkMatch[2]);

    const dateMatch = chunk.match(/<span class="advert-date">([^<]+)<\/span>/);
    const { iso: postedISO, raw: postedRaw } = dateMatch
      ? parseSwedishDate(decodeEntities(dateMatch[1]))
      : { iso: null, raw: null };

    const locationMatch = chunk.match(
      /class="advert-item-col-1-only advert-location adverts-icon-location">([^<]*)<\/span>/
    );
    const plats = locationMatch ? decodeEntities(locationMatch[1].trim()) : "";

    const imgMatch = chunk.match(/<img[^>]*src="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : null;

    adverts.push({ id, title, url, plats, postedISO, postedRaw, image });
  }
  return adverts;
}

async function fetchAllAdverts() {
  const all = new Map();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const html = await fetchPage(page);
    const found = parseAdverts(html);
    if (found.length === 0) break;
    for (const a of found) all.set(a.id, a);
    // Artighetspaus mellan sidor.
    await new Promise((r) => setTimeout(r, 500));
  }
  return all;
}

async function loadState() {
  if (!existsSync(DATA_FILE)) {
    return { lastUpdated: null, adverts: {}, feedItems: [] };
  }
  const raw = await readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  const adverts = {};
  for (const a of parsed.adverts ?? []) adverts[a.id] = a;
  return { lastUpdated: parsed.lastUpdated, adverts, feedItems: parsed.feedItems ?? [] };
}

function toRFC822(isoString) {
  return new Date(isoString).toUTCString();
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFeedXml(feedItems) {
  const items = feedItems
    .slice(0, MAX_FEED_ITEMS)
    .map((item) => {
      const verb = item.type === "new" ? "Ny husvagn tillgänglig" : "Husvagn ej längre tillgänglig";
      const platsInfo = item.plats ? ` (plats ${escapeXml(item.plats)})` : "";
      return `    <item>
      <title>${escapeXml(`${verb}: ${item.title}${platsInfo}`)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="false">${escapeXml(item.id)}-${item.type}-${escapeXml(item.eventDate)}</guid>
      <pubDate>${toRFC822(item.eventDate)}</pubDate>
      <description>${escapeXml(
        item.type === "new"
          ? `En ny husvagn dök upp på Bödagårdens Camping: "${item.title}", plats ${item.plats || "okänd"}. ${item.url}`
          : `Husvagnen "${item.title}" (plats ${item.plats || "okänd"}) är inte längre listad - troligen uthyrd av någon annan.`
      )}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bödagårdens Husvagnsquest</title>
    <link>${SITE_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Notiser när husvagnar blir lediga eller uthyrda på Bödagårdens Camping, Öland.</description>
    <language>sv</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(newEvents, goneEvents) {
  const weekMatches = newEvents.filter((e) => matchesWeek(e.title, TARGET_WEEK));
  const otherNew = newEvents.filter((e) => !matchesWeek(e.title, TARGET_WEEK));

  const renderItem = (e, highlight) => `<li style="margin-bottom:10px;${highlight ? "background:#f2e6c9;padding:6px 10px;border-radius:4px;border:1px solid #c9932f;" : ""}">
        ${highlight ? "🎯 <strong>Vecka " + TARGET_WEEK + "-match!</strong> " : ""}
        <a href="${escapeHtml(e.url)}" style="color:#7a4a12;font-weight:600;">${escapeHtml(e.title)}</a>
        ${e.plats ? ` &mdash; plats ${escapeHtml(e.plats)}` : ""}
      </li>`;

  const weekList = weekMatches.map((e) => renderItem(e, true)).join("\n");
  const otherList = otherNew.map((e) => renderItem(e, false)).join("\n");
  const goneList = goneEvents
    .map((e) => `<li style="margin-bottom:6px;color:#777;">${escapeHtml(e.title)}${e.plats ? ` (plats ${escapeHtml(e.plats)})` : ""} &mdash; borta</li>`)
    .join("\n");

  return `
  <div style="font-family:Georgia,serif;max-width:560px;">
    <p>Hej Tomas! ⚔️🏕️</p>
    ${
      weekMatches.length > 0
        ? `<p><strong>Questet är nära sitt mål — ${weekMatches.length} husvagn${weekMatches.length === 1 ? "" : "ar"} ledig${weekMatches.length === 1 ? "" : "a"} vecka ${TARGET_WEEK} har dykt upp:</strong></p>
           <ul>${weekList}</ul>`
        : ""
    }
    ${
      otherNew.length > 0
        ? `<p>${weekMatches.length > 0 ? "Övriga nya annonser (annan vecka):" : `<strong>${otherNew.length} ny${otherNew.length === 1 ? "" : "a"} quest${otherNew.length === 1 ? "" : "er"} har dykt upp:</strong>`}</p>
           <ul>${otherList}</ul>`
        : ""
    }
    ${
      goneEvents.length > 0
        ? `<p style="color:#777;">Dessa har någon annan hunnit ta:</p><ul>${goneList}</ul>`
        : ""
    }
    <p>Hela listan, med bilder och alla detaljer: <a href="${SITE_URL}">${SITE_URL}</a></p>
    <p style="color:#999;font-size:0.85em;">Lycka till på jakten! / David & Jean-Claude</p>
  </div>`;
}

async function sendTomasNotification(newEvents, goneEvents) {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const contactId = process.env.TOMAS_GHL_CONTACT_ID;
  if (!token || !contactId) {
    console.log("Hoppar över mejlnotis (GHL-secrets saknas i miljön).");
    return;
  }
  const weekMatchCount = newEvents.filter((e) => matchesWeek(e.title, TARGET_WEEK)).length;
  const subject =
    weekMatchCount > 0
      ? `🎯 Vecka ${TARGET_WEEK}-match! ${weekMatchCount} husvagn${weekMatchCount === 1 ? "" : "ar"} lediga vid Bödagården`
      : newEvents.length > 0
      ? `${newEvents.length} ny${newEvents.length === 1 ? "" : "a"} husvagnsquest${newEvents.length === 1 ? "" : "er"} vid Bödagården`
      : "Husvagnsquesten har ändrats";

  const res = await fetch(`${GHL_API_BASE}/conversations/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      type: "Email",
      contactId,
      subject,
      html: buildNotificationHtml(newEvents, goneEvents),
      emailFrom: process.env.GHL_AGENT_EMAIL || "jean-claude@mail.ducostudios.com"
    })
  });
  if (!res.ok) {
    console.error(`Mejlnotis misslyckades (${res.status}): ${await res.text()}`);
    return;
  }
  console.log("Mejlnotis skickad till Tomas.");
}

async function main() {
  const state = await loadState();
  const isBootstrap = state.lastUpdated === null;
  const current = await fetchAllAdverts();
  const now = new Date().toISOString();

  // Vid allra första körningen (inget data.json ännu) sätts baslinjen tyst -
  // annars skulle alla 37 befintliga annonser rapporteras som "nya" i feeden.
  const newIds = isBootstrap ? [] : [...current.keys()].filter((id) => !(id in state.adverts));
  const goneIds = isBootstrap
    ? []
    : Object.keys(state.adverts).filter((id) => !current.has(id));

  const newFeedEvents = newIds.map((id) => {
    const a = current.get(id);
    return { type: "new", id, title: a.title, url: a.url, plats: a.plats, eventDate: now };
  });
  const goneFeedEvents = goneIds.map((id) => {
    const a = state.adverts[id];
    return { type: "gone", id, title: a.title, url: a.url, plats: a.plats, eventDate: now };
  });

  // Bootstrap-körningen (första gången, inget data.json fanns) räknas alltid
  // som "changed" så att startlistan faktiskt publiceras.
  const changed = isBootstrap || newFeedEvents.length > 0 || goneFeedEvents.length > 0;

  const nextAdverts = {};
  for (const [id, a] of current.entries()) {
    const prev = state.adverts[id];
    nextAdverts[id] = {
      ...a,
      firstSeenByScraper: prev?.firstSeenByScraper ?? now
    };
  }

  const nextFeedItems = [...newFeedEvents, ...goneFeedEvents, ...state.feedItems].slice(
    0,
    MAX_FEED_ITEMS
  );

  const nextState = {
    lastUpdated: now,
    adverts: Object.values(nextAdverts).sort((a, b) =>
      (b.postedISO ?? "").localeCompare(a.postedISO ?? "")
    ),
    feedItems: nextFeedItems
  };

  if (changed) {
    // Filerna skrivs bara vid faktisk förändring - annars skulle
    // lastUpdated-tidsstämpeln ensam trigga ett git-commit varje körning.
    await writeFile(DATA_FILE, JSON.stringify(nextState, null, 2) + "\n", "utf8");
    await writeFile(FEED_FILE, buildFeedXml(nextFeedItems), "utf8");
  }

  // Ingen notis vid bootstrap (då är "nya" bara den befintliga listan).
  if (!isBootstrap && (newFeedEvents.length > 0 || goneFeedEvents.length > 0)) {
    await sendTomasNotification(newFeedEvents, goneFeedEvents);
  }

  console.log(
    `Klart. ${current.size} annonser just nu. ${newIds.length} nya, ${goneIds.length} borttagna.`
  );
  // GitHub Actions läser denna rad för att veta om något commit-värt hände.
  console.log(`CHANGED=${changed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
