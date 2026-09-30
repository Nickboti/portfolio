/* ==========================================================
   TU EDYTUJESZ CAŁĄ ZAWARTOŚĆ STRONY. HTML/CSS/JS nie trzeba ruszać.
   Każdy projekt i serwer to jeden blok { ... } w odpowiedniej liście.
   ========================================================== */

const SITE = {
  name: "Nick",
  handle: "darkangelspac",
  discord: "darkangelspac",
  github: "https://github.com/TWOJ-LOGIN",   // <-- wstaw swój link do GitHuba
  subtitle:
    "Tworzę pluginy Paper/Spigot i mody Fabric: eventy, PvP, nagrody i efekty, które ożywiają serwer. Wydajnie, czytelnie i z myślą o graczach.",

  // Liczby w pasku statystyk. Zmień na prawdziwe.
  stats: [
    { value: 10, suffix: "+", label: "ukończonych pluginów" },
    { value: 4,  suffix: "",  label: "serwery, z którymi pracowałem" },
    { value: 3,  suffix: "+", label: "lata programowania w Javie" },
    { value: 100, suffix: "%", label: "kodu pisanego od zera" }
  ]
};

/* ---------- PLUGINY I MODY ----------
   hue     - kolor banera (0-360): 270 fiolet, 190 turkus, 140 zieleń, 20 pomarańcz, 340 róż
   status  - "live" (działa na serwerze) albo "wip" (w trakcie prac)
   image   - opcjonalnie ścieżka do screena, np. "img/metin.png" (wrzuć plik do folderu img/)
   link    - opcjonalnie link do repo / SpigotMC / Modrinth
   features- lista na rozwijanej części karty                                                  */
const PLUGINS = [
  {
    name: "MetinB",
    type: "Plugin",
    status: "live",
    hue: 275,
    desc: "Plugin eventowy Metin dla serwera boxpvp: wszystko od pojawienia się po nagrody dla graczy.",
    features: [
      "Beacon jako cel eventu z pulsującymi efektami",
      "Konfigurowalne nagrody i ich szanse",
      "Zoptymalizowany pod Paper 1.20.4"
    ],
    tags: ["Paper 1.20.4", "Event", "PvP", "Java"],
    link: ""
  },
  {
    name: "PvPMod",
    type: "Mod",
    status: "wip",
    hue: 190,
    desc: "Klientowy mod Fabric 1.21 z HUD-em dla graczy PvP: przewidywanie wyniku walki i alerty w grze.",
    features: [
      "Przewidywanie wygranej lub przegranej w trakcie walki",
      "Czytelny HUD nakładany na ekran",
      "Alert „Wklejka” dla wybranych sytuacji"
    ],
    tags: ["Fabric 1.21", "Client-side", "HUD", "Java"],
    link: ""
  },
  {
    name: "Twój kolejny plugin",
    type: "Plugin",
    status: "live",
    hue: 25,
    desc: "To przykładowa karta. Skopiuj blok, zmień nazwę, opis i tagi, a pojawi się na stronie.",
    features: ["Pierwsza funkcja", "Druga funkcja", "Trzecia funkcja"],
    tags: ["Spigot", "Ekonomia", "GUI"],
    link: ""
  },
  {
    name: "Kolejny projekt",
    type: "Plugin",
    status: "wip",
    hue: 145,
    desc: "Drugi przykład, żeby siatka wyglądała pełniej. Usuń albo podmień na własne prace.",
    features: ["Opis funkcji", "Kolejna funkcja"],
    tags: ["Paper", "Minigra"],
    link: ""
  }
];

/* ---------- SERWERY ----------
   icon - opcjonalnie ścieżka do logo, np. "img/serwer1.png". Bez tego pokaże się pierwsza litera. */
const SERVERS = [
  {
    name: "Serwer BoxPvP",
    role: "Plugin developer",
    desc: "Autorski plugin eventowy i dodatki do rozgrywki PvP.",
    period: "2026 – obecnie",
    hue: 275,
    icon: "",
    link: ""
  },
  {
    name: "Nazwa serwera 2",
    role: "Developer pluginów",
    desc: "Krótki opis, co zrobiłeś dla tego serwera.",
    period: "2025",
    hue: 190,
    icon: "",
    link: ""
  },
  {
    name: "Nazwa serwera 3",
    role: "Konfiguracja i pluginy",
    desc: "Krótki opis współpracy.",
    period: "2025",
    hue: 25,
    icon: "",
    link: ""
  }
];

/* ---------- TECHNOLOGIE ---------- */
const TECH = [
  "Java", "Paper API", "Spigot", "Fabric", "Gradle", "Maven", "IntelliJ IDEA",
  "Adventure API", "PlaceholderAPI", "ProtocolLib", "MySQL", "SQLite", "Git", "YAML config"
];
