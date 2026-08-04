# Husvagnsquesten

Enkel portal som bevakar [Bödagårdens Campings husvagnsannonser](https://www.bodagarden.nu/husvagnar-uthyres/)
och listar vilka som är lediga just nu.

- **Sidan**: https://ducostudios.github.io/husvagn-quest/
- **RSS-flöde**: https://ducostudios.github.io/husvagn-quest/feed.xml

## Hur det funkar

En GitHub Action (`.github/workflows/scrape.yml`) kör `scripts/scrape.mjs` en gång i timmen, hela året.

Skriptet skrapar annonslistan, jämför med `data.json` från förra körningen och:

- lägger till nya annonser som matchar `TARGET_WEEK` (satt i både `scripts/scrape.mjs` och `index.html`)
- tar bort annonser som inte längre finns på bodagarden.nu
- loggar båda händelserna i `feed.xml` (RSS, mest som rå logg numera)

Filerna committas bara när något faktiskt ändrats - ingen commit-spam.

## Mejl-notis

Sköts direkt av `scripts/scrape.mjs` mot Resends REST-API när en TARGET_WEEK-relevant
ändring upptäcks - kräver `RESEND_API_KEY` som GitHub Actions-secret (redan satt i repot).
Dedikerad nyckel som bara skickar mejl, ingen koppling till affärsdata.

## Karaktärskort (cards.html)

Bilderna i `images/` är beskurna/komprimerade utsnitt ur Howard Pyles illustrationer till
*The Story of King Arthur and His Knights* (1903), public domain, hämtade från Wikimedia Commons.

## Köra manuellt

```
node scripts/scrape.mjs
```

Eller trigga workflowet manuellt från fliken "Actions" i GitHub (workflow_dispatch).
