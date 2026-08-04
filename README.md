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

Sköts direkt av `scripts/scrape.mjs` mot GoHighLevels REST-API när en TARGET_WEEK-relevant
ändring upptäcks - kräver `GHL_PRIVATE_INTEGRATION_TOKEN` och `TOMAS_GHL_CONTACT_ID` som
GitHub Actions-secrets (redan satta i repot).

## Köra manuellt

```
node scripts/scrape.mjs
```

Eller trigga workflowet manuellt från fliken "Actions" i GitHub (workflow_dispatch).
