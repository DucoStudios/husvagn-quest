// Uppdrag för THE GAME. Varje uppdrag pekar mot en egenskap (stat-label)
// från characters.mjs — bara personer som faktiskt har den egenskapen på
// sitt kort får se uppdraget. "scale" avgör poängstegen (HP går 0-100,
// alla andra egenskaper går 0-10).
const STAT_POINTS = [1, 2, 3];
const HP_POINTS = [4, 8, 12];

export const RESULT_TIERS = [
  { key: "no", label: "Inte riktigt idag" },
  { key: "ok", label: "Ja, det gick bra" },
  { key: "great", label: "Ja, jättebra!" }
];

export const MISSIONS = [
  {
    id: "hp-promenad",
    stat: "HP",
    icon: "fa-solid fa-person-hiking",
    title: "Äventyrspromenaden",
    desc: "Gå en promenad eller vandring runt campingen eller i naturen, minst 20 minuter, utan gnäll.",
    points: HP_POINTS
  },
  {
    id: "hp-bad",
    stat: "HP",
    icon: "fa-solid fa-water",
    title: "Simmaraden",
    desc: "Bada eller simma en stund i sjön, havet eller poolen, gärna med lekar i vattnet.",
    points: HP_POINTS
  },
  {
    id: "styrka-bar",
    stat: "Styrka",
    icon: "fa-solid fa-box",
    title: "Bär lägret",
    desc: "Hjälp till att bära vattendunkar, stolar, ved eller annan tung packning till och från lägerplatsen.",
    points: STAT_POINTS
  },
  {
    id: "styrka-talt",
    stat: "Styrka",
    icon: "fa-solid fa-campground",
    title: "Res förtältet",
    desc: "Hjälp till att sätta upp eller plocka ner förtältet eller annan tung utrustning.",
    points: STAT_POINTS
  },
  {
    id: "sparsinne-spaning",
    stat: "Spårsinne",
    icon: "fa-solid fa-binoculars",
    title: "Husvagnsspaningen",
    desc: "Håll utkik efter riktiga husvagnar och lediga platser under resan, precis som questet kräver.",
    points: STAT_POINTS
  },
  {
    id: "sparsinne-hitta",
    stat: "Spårsinne",
    icon: "fa-solid fa-map-location-dot",
    title: "Hitta tillbaka",
    desc: "Hitta vägen tillbaka till lägerplatsen efter en promenad utan att fråga om vägen eller kolla kartan.",
    points: STAT_POINTS
  },
  {
    id: "vishet-rad",
    stat: "Vishet",
    icon: "fa-solid fa-feather-pointed",
    title: "Goda rådet",
    desc: "Ge någon i familjen ett klokt råd som faktiskt hjälpte dem.",
    points: STAT_POINTS
  },
  {
    id: "vishet-problem",
    stat: "Vishet",
    icon: "fa-solid fa-scale-balanced",
    title: "Lös lägerproblemet",
    desc: "Hjälp till att lösa ett praktiskt problem i lägret klokt och lugnt — maten, packningen eller ett litet gnabb.",
    points: STAT_POINTS
  },
  {
    id: "karisma-grannar",
    stat: "Karisma",
    icon: "fa-solid fa-comments",
    title: "Nya campinggrannar",
    desc: "Prata med någon ny på campingen och gör ett gott intryck.",
    points: STAT_POINTS
  },
  {
    id: "karisma-muntra",
    stat: "Karisma",
    icon: "fa-solid fa-face-laugh-beam",
    title: "Muntra upp lägret",
    desc: "Få någon i familjen att skratta eller må bättre.",
    points: STAT_POINTS
  },
  {
    id: "forsvar-storasyster",
    stat: "Försvar",
    icon: "fa-solid fa-shield-halved",
    title: "Storasysteruppdraget",
    desc: "Håll extra koll på ett yngre syskon en stund och se till att de har det bra.",
    points: STAT_POINTS
  },
  {
    id: "forsvar-lagervakt",
    stat: "Försvar",
    icon: "fa-solid fa-fire",
    title: "Lägervakten",
    desc: "Ta ansvar för att grillen, elden eller lägerplatsen sköts säkert en stund.",
    points: STAT_POINTS
  },
  {
    id: "talamod-grillen",
    stat: "Tålamod",
    icon: "fa-solid fa-utensils",
    title: "Vänta på grillen",
    desc: "Vänta tålmodigt på att maten blir klar utan att tjata om när det är dags.",
    points: STAT_POINTS
  },
  {
    id: "talamod-ko",
    stat: "Tålamod",
    icon: "fa-solid fa-hourglass-half",
    title: "Kön på campingen",
    desc: "Vänta lugnt i en kö — dusch, disk eller minigolf — utan att bli sur.",
    points: STAT_POINTS
  },
  {
    id: "smidighet-balans",
    stat: "Smidighet",
    icon: "fa-solid fa-shoe-prints",
    title: "Balansbanan",
    desc: "Balansera på en stock, brygga eller kant utan att trilla av.",
    points: STAT_POINTS
  },
  {
    id: "smidighet-klattra",
    stat: "Smidighet",
    icon: "fa-solid fa-tree",
    title: "Klätterutmaningen",
    desc: "Klättra tryggt i ett träd eller på en klippa, med en vuxen i närheten.",
    points: STAT_POINTS
  },
  {
    id: "nyfikenhet-upptack",
    stat: "Nyfikenhet",
    icon: "fa-solid fa-compass",
    title: "Upptäckarturen",
    desc: "Utforska en ny stig eller vrå av campingen som ingen i familjen sett förut.",
    points: STAT_POINTS
  },
  {
    id: "nyfikenhet-natur",
    stat: "Nyfikenhet",
    icon: "fa-solid fa-magnifying-glass",
    title: "Naturdetektiven",
    desc: "Hitta och lär dig namnet på tre nya växter, djur eller insekter runt lägret.",
    points: STAT_POINTS
  },
  {
    id: "tur-chans",
    stat: "Tur",
    icon: "fa-solid fa-dice",
    title: "Chansningen",
    desc: "Gissa något innan det händer — vädret imorgon, ett tärningskast — och se om turen är med dig.",
    points: STAT_POINTS
  },
  {
    id: "tur-fiske",
    stat: "Tur",
    icon: "fa-solid fa-fish",
    title: "Fiskelyckan",
    desc: "Prova fiskelycka en stund vid vattnet och se vad som nappar.",
    points: STAT_POINTS
  },
  {
    id: "kaos-ide",
    stat: "Kaosenergi",
    icon: "fa-solid fa-bolt",
    title: "Vilda idén",
    desc: "Hitta på en egen, rolig och ofarlig lek eller idé som får alla att skratta.",
    points: STAT_POINTS
  },
  {
    id: "kaos-lagereld",
    stat: "Kaosenergi",
    icon: "fa-solid fa-masks-theater",
    title: "Lägereldsshowet",
    desc: "Uppträd vid lägerelden med en dans, sång, skämt eller spökhistoria.",
    points: STAT_POINTS
  }
];

export function missionsForCharacter(character) {
  const labels = new Set(character.stats.map((s) => s.label));
  return MISSIONS.filter((m) => labels.has(m.stat));
}
