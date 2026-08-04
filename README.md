# Husvagnsquesten

Enkel portal som bevakar [Bödagårdens Campings husvagnsannonser](https://www.bodagarden.nu/husvagnar-uthyres/)
och listar vilka som är lediga just nu.

- **Sidan**: https://ducostudios.github.io/husvagn-quest/
- **RSS-flöde**: https://ducostudios.github.io/husvagn-quest/feed.xml

## Hur det funkar

En GitHub Action (`.github/workflows/scrape.yml`) kör `scripts/scrape.mjs` på ett schema:

- Juni–augusti (högsäsong): var 15:e minut
- April, maj, september, oktober: en gång i timmen
- November–mars: helt pausat (ingen schemaläggning)

Skriptet skrapar annonslistan, jämför med `data.json` från förra körningen och:

- lägger till nya annonser (visas på sidan, taggas "Ny quest" i 1 dag)
- tar bort annonser som inte längre finns på bodagarden.nu
- loggar båda händelserna i `feed.xml` (RSS)

Filerna committas bara när något faktiskt ändrats - ingen commit-spam.

## Mejl-notis utan kod

RSS-flödet är själva notiskanalen. Vill man ha ett mejl varje gång listan ändras,
klistra in feed-länken på [blogtrottr.com](https://blogtrottr.com) (gratis, ingen inloggning) -
klart på 30 sekunder, inga API-nycklar eller lösenord inblandade.

## Köra manuellt

```
node scripts/scrape.mjs
```

Eller trigga workflowet manuellt från fliken "Actions" i GitHub (workflow_dispatch).
