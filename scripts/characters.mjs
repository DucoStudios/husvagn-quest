// Familjens karaktärer och deras basvärden. Delas mellan cards.html och game.html
// så att korten och spelet alltid visar samma person med samma grundstats.
export const CHARACTERS = [
  {
    name: "Tomas",
    role: "Familjens far",
    className: "Vagnjägaren",
    icon: "fa-solid fa-compass",
    accent: "#2f4a2f",
    image: "images/tomas.jpg",
    description: "Ledaren för detta quest. Har ett sjätte sinne för lediga husvagnar och ger aldrig upp en jakt förrän vagnen är bokad.",
    special: "Särskild förmåga — Vagnsinne: känner på sig när en ny husvagn dyker upp innan mejlet ens hunnit fram.",
    stats: [
      { label: "HP", value: 85, max: 100 },
      { label: "Styrka", value: 7, max: 10 },
      { label: "Spårsinne", value: 10, max: 10 },
      { label: "Tur", value: 6, max: 10 }
    ]
  },
  {
    name: "Annelie",
    role: "Familjens mor",
    className: "Strategen",
    icon: "fa-solid fa-chess-queen",
    accent: "#6b3fa0",
    image: "images/annelie.jpg",
    description: "Lägrets kloka strateg. Ser lösningen innan andra ens hunnit formulera problemet, och får alltid bästa platsen i lägret.",
    special: "Särskild förmåga — Förhandlingskonst: ingen prutar bättre, ingen planerar lugnare.",
    stats: [
      { label: "HP", value: 90, max: 100 },
      { label: "Styrka", value: 5, max: 10 },
      { label: "Vishet", value: 9, max: 10 },
      { label: "Karisma", value: 10, max: 10 }
    ]
  },
  {
    name: "Eira",
    role: "Äldsta dottern",
    className: "Väktaren",
    icon: "fa-solid fa-shield-halved",
    accent: "#2a5f74",
    image: "images/eira.jpg",
    description: "Storasysterns sköld. Håller koll på hela syskonskaran även mitt i kaos, och är den man ropar på när något gått sönder.",
    special: "Särskild förmåga — Storasysterblick: löser bråk innan de ens brutit ut.",
    stats: [
      { label: "HP", value: 80, max: 100 },
      { label: "Styrka", value: 8, max: 10 },
      { label: "Försvar", value: 9, max: 10 },
      { label: "Tålamod", value: 7, max: 10 }
    ]
  },
  {
    name: "Folke",
    role: "Mellansonen",
    className: "Upptäckaren",
    icon: "fa-solid fa-map",
    accent: "#a05a1f",
    image: "images/folke.jpg",
    description: "Alltid först ut ur bilen. Hittar nya vägar ingen bad om och nya äventyr ingen såg komma.",
    special: "Särskild förmåga — Genväg: vet alltid ett snabbare, konstigare sätt att komma fram.",
    stats: [
      { label: "HP", value: 70, max: 100 },
      { label: "Styrka", value: 6, max: 10 },
      { label: "Smidighet", value: 9, max: 10 },
      { label: "Nyfikenhet", value: 10, max: 10 }
    ]
  },
  {
    name: "Ivar",
    role: "Yngsta sonen",
    className: "Vildingen",
    icon: "fa-solid fa-dice",
    accent: "#7a2222",
    image: "images/ivar.jpg",
    description: "Familjens vilda kort. Ingen vet vad som händer härnäst, minst av allt Ivar själv - och det är precis vad som gör honom farlig i strid.",
    special: "Särskild förmåga — Oförutsägbar attack: slumpar alltid en ny taktik, mitt i allt.",
    stats: [
      { label: "HP", value: 60, max: 100 },
      { label: "Styrka", value: 5, max: 10 },
      { label: "Kaosenergi", value: 10, max: 10 },
      { label: "Tur", value: 9, max: 10 }
    ]
  }
];

export const GEM_COLORS = {
  "HP":          { bright: "#ff6b81", base: "#c4203f", deep: "#7a1428", glow: "rgba(255,107,129,0.65)" }, // rubin
  "Styrka":      { bright: "#f5b84c", base: "#c17d1a", deep: "#7a4e0d", glow: "rgba(245,184,76,0.6)" },   // citrin
  "Spårsinne":   { bright: "#4fe0a0", base: "#1f9d63", deep: "#0f5c3a", glow: "rgba(79,224,160,0.6)" },   // smaragd
  "Tur":         { bright: "#c6a2f5", base: "#8b5fc4", deep: "#54367d", glow: "rgba(198,162,245,0.65)" }, // ametist
  "Vishet":      { bright: "#6fb0ff", base: "#3568c4", deep: "#1e3f7a", glow: "rgba(111,176,255,0.65)" }, // safir
  "Karisma":     { bright: "#f78fc0", base: "#d1447e", deep: "#7d2a4c", glow: "rgba(247,143,192,0.65)" }, // rosa turmalin
  "Försvar":     { bright: "#5fe0d4", base: "#2a9d93", deep: "#155953", glow: "rgba(95,224,212,0.6)" },   // akvamarin
  "Tålamod":     { bright: "#ecd06a", base: "#b8952a", deep: "#6e5817", glow: "rgba(236,208,106,0.6)" },  // topas
  "Smidighet":   { bright: "#4fe0a0", base: "#1f9d63", deep: "#0f5c3a", glow: "rgba(79,224,160,0.6)" },   // smaragd
  "Nyfikenhet":  { bright: "#4fd6ec", base: "#1f96a6", deep: "#125a66", glow: "rgba(79,214,236,0.6)" },   // turkos
  "Kaosenergi":  { bright: "#a374ec", base: "#6a2fb0", deep: "#3d1a66", glow: "rgba(163,116,236,0.65)" }, // ametrin/obsidian
};
