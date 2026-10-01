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
   Kliknięcie karty otwiera okno ze szczegółami.

   name, type ("Plugin" albo "Mod"), tags, desc (krótko, na karcie), features (lista punktów)
   how      - dłuższy opis "Jak to działa" w oknie szczegółów
   hue      - kolor (0-360): 270 fiolet, 190 turkus, 140 zieleń, 20 pomarańcz, 340 róż
   status   - "live" (działa na serwerze) albo "wip" (w trakcie prac)
   image    - opcjonalnie screen, np. "img/metin.png" (służy też jako okładka filmu)
   video    - opcjonalnie film: link YouTube ("https://youtu.be/XXXXXXXXXXX")
              albo plik wrzucony do repo ("img/demo.mp4"). Zostaw "" jeśli nie masz filmu:
              wtedy w ramce pojawi się animowana plansza "Film wkrótce".
   link     - opcjonalnie link do repo / SpigotMC / Modrinth
   commands - lista komend pokazywana w konsoli. Każda:
              cmd  - komenda, desc - co robi, perm - uprawnienie (opcjonalnie),
              out  - linie przykładowego wyniku po kliknięciu (opcjonalnie).
              Na początku linii możesz dać [Nazwa], żeby wyszła kolorowa.     */
const PLUGINS = [
  {
    name: "MetinB",
    type: "Plugin",
    status: "live",
    hue: 275,
    desc: "Plugin eventowy Metin dla serwera boxpvp: od pojawienia się celu po nagrody dla graczy.",
    how: "Admin startuje event komendą, a w świecie pojawia się beacon jako cel. Gracze niszczą go razem, a beacon pulsuje efektami, które pokazują postęp. Po zniszczeniu plugin losuje i rozdaje nagrody ze skonfigurowanej listy.",
    features: [
      "Beacon jako cel eventu z pulsującymi efektami",
      "Konfigurowalne nagrody i ich szanse",
      "Zoptymalizowany pod Paper 1.20.4"
    ],
    tags: ["Paper 1.20.4", "Event", "PvP", "Java"],
    video: "",
    image: "",
    link: "",
    commands: [
      {
        cmd: "/metin start", perm: "metin.admin", desc: "Startuje event i stawia beacon.",
        out: ["[MetinB] Event wystartował!", "[MetinB] Beacon pojawił się na x:120 y:64 z:-310", "[MetinB] Ogłoszenie wysłane do graczy."]
      },
      {
        cmd: "/metin stop", perm: "metin.admin", desc: "Przerywa trwający event.",
        out: ["[MetinB] Event zatrzymany.", "[MetinB] Beacon usunięty."]
      },
      {
        cmd: "/metin reload", perm: "metin.admin", desc: "Przeładowuje konfigurację nagród.",
        out: ["[MetinB] Wczytano config.yml", "[MetinB] Załadowano 12 nagród."]
      },
      {
        cmd: "/metin rewards", perm: "metin.use", desc: "Pokazuje listę możliwych nagród.",
        out: ["[MetinB] Możliwe nagrody:", " - Diamentowy miecz (5%)", " - Złote jabłka x8 (25%)"]
      }
    ]
  },
  {
    name: "PvPMod",
    type: "Mod",
    status: "wip",
    hue: 190,
    desc: "Klientowy mod Fabric 1.21 z HUD-em dla graczy PvP: przewidywanie wyniku walki i alerty.",
    how: "Mod działa po stronie klienta, więc nie wymaga zmian na serwerze. W trakcie walki porównuje stan obu graczy i na bieżąco pokazuje na HUD-zie, kto prowadzi. Dodatkowo wyświetla alert „Wklejka” w wybranych sytuacjach.",
    features: [
      "Przewidywanie wygranej lub przegranej w trakcie walki",
      "Czytelny HUD nakładany na ekran",
      "Alert „Wklejka” dla wybranych sytuacji"
    ],
    tags: ["Fabric 1.21", "Client-side", "HUD", "Java"],
    video: "",
    image: "",
    link: "",
    commands: [
      {
        cmd: "/pvpmod toggle", desc: "Włącza lub wyłącza cały HUD.",
        out: ["[PvPMod] HUD włączony."]
      },
      {
        cmd: "/pvpmod prediction", desc: "Przełącza panel przewidywania walki.",
        out: ["[PvPMod] Przewidywanie: ON", "[PvPMod] Aktualnie prowadzisz: 62%"]
      },
      {
        cmd: "/pvpmod wklejka", desc: "Włącza lub wyłącza alert „Wklejka”.",
        out: ["[PvPMod] Alert Wklejka: ON"]
      }
    ]
  },
  {
    name: "Twój kolejny plugin",
    type: "Plugin",
    status: "live",
    hue: 25,
    desc: "To przykładowa karta. Skopiuj blok, zmień nazwę, opis i tagi, a pojawi się na stronie.",
    how: "Tutaj opisz w 2-3 zdaniach, jak plugin działa z perspektywy gracza i admina.",
    features: ["Pierwsza funkcja", "Druga funkcja", "Trzecia funkcja"],
    tags: ["Spigot", "Ekonomia", "GUI"],
    video: "",
    image: "",
    link: "",
    commands: [
      { cmd: "/przyklad", desc: "Opis komendy.", out: ["[Przyklad] To jest przykładowy wynik komendy."] }
    ]
  },
  {
    name: "Kolejny projekt",
    type: "Plugin",
    status: "wip",
    hue: 145,
    desc: "Drugi przykład, żeby siatka wyglądała pełniej. Usuń albo podmień na własne prace.",
    how: "Krótki opis działania.",
    features: ["Opis funkcji", "Kolejna funkcja"],
    tags: ["Paper", "Minigra"],
    video: "",
    image: "",
    link: "",
    commands: []
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
