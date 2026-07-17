// Soggy Baltic Adventure — itinerary data
// Edit this file to fill in gaps (accommodation names, booking statuses, notes).
// Keep the HTML/CSS alone; everything on the page is generated from this object.
//
// Confirmed: David arrives 13 Aug, not the 12th (the other two still arrive
// on the 12th). Riga now gets a fixed two nights. To keep the trip at 8
// nights total with departure still on Thursday 20th, one day/night had to
// come out elsewhere on each route:
//   - Option #1 (Šiauliai): dropped the Aukštaitija/Visaginas day trip —
//     Vilnius goes from 3 nights to 2.
//   - Option #2 (Liepāja): merged the Palanga→Klaipėda hike day with the
//     Klaipėda→Curonian Spit cycle day into a single "Palanga → Curonian
//     Spit" day (quick bus/ferry transfer into Klaipėda, then the same cycle
//     onwards) — Klaipėda no longer gets an overnight.
//
// Two route options for getting from Riga down to the Curonian Spit:
// "siauliai" (train via Šiauliai, cycle the Spit from Klaipėda) and "liepaja"
// (a slower-paced coastal road trip + hike via Liepāja and Palanga). They
// only really share Day 1 (arrive Riga), Day 2 (Riga together), the Vilnius
// sightseeing day, and departure day — those are defined once below and
// reused by both.

// ---- Shared days (identical regardless of route) --------------------------

const dayArriveRiga = {
  date: "2026-08-12", weekday: "Wed", dayLabel: "12 Aug",
  location: "Riga", title: "Arrive Riga",
  description: `Two of three arrive today — David joins tomorrow. Settle in. Evening: UEFA Super Cup final, Aston Villa v PSG, kickoff 22:00 — find a pub in the centre with a big screen.`,
  accommodation: { city: "Riga", name: null, status: "tbd" },
  bookings: [
    { label: "Pub for Super Cup final (optional booking)", status: "tbd" },
  ],
  travel: ["foot"],
  distance: null,
  // Points the map marker traces on the way INTO this day (starts at
  // the previous day's end point; for day 1 it's just the start).
  mapPath: [[56.9496, 24.1052]], // Riga
};

const dayRigaTogether = {
  date: "2026-08-13", weekday: "Thu", dayLabel: "13 Aug",
  location: "Riga", title: "David arrives — full day in Riga",
  description: `David lands today, completing the group. Full day in the city together: Old Town, the Art Nouveau district on Alberta iela, Riga Central Market.`,
  accommodation: { city: "Riga", name: null, status: "tbd" },
  bookings: [],
  travel: ["foot"],
  distance: "Local only (walking)",
  mapPath: [[56.9496, 24.1052]], // stays in Riga
};

const dayNidaRecovery = {
  date: "2026-08-16", weekday: "Sun", dayLabel: "16 Aug",
  location: "Curonian Spit", title: "Curonian Spit, recovery day",
  description: `A deliberately easy day after the ride: Parnidis Dune, the Baltic beach, the Thomas Mann House, amber-hunting after any wind. Good day for anyone who wants to opt out and just rest.`,
  accommodation: { city: "Nida", name: null, status: "tbd" },
  bookings: [],
  travel: ["foot"],
  distance: "Local only (rest day)",
  mapPath: [[55.3049, 20.9928]], // stays in Nida
};

const dayLagoon = {
  date: "2026-08-17", weekday: "Mon", dayLabel: "17 Aug",
  location: "Curonian Spit", title: "Lagoon day: Mingė and the Nemunas Delta",
  description: `Full-day boat loop out of Nida — Atmata River → Uostadvaris → the Minija River → Mingė village (the "Lithuanian Venice," where boats double as driveways), with options to extend to Ventė Cape (historic bird-ringing station and ornithology museum) and the Nemunas Delta wetlands, or swap onto a dedicated guided fishing trip instead. Private charter, 6–8 hours, book through Nida's tourist info centre or visitneringa.com closer to the date — small boats, worth locking in during August.`,
  accommodation: { city: "Nida", name: null, status: "tbd" },
  bookings: [
    { label: "Mingė / Nemunas Delta boat charter", status: "tbd" },
  ],
  // No train/bike/foot/car icon — today's main transport is the boat
  // charter, which isn't one of the four tracked modes.
  travel: [],
  distance: "~40 km (boat, approx.)",
  mapPath: [[55.3049, 20.9928]], // stays in Nida
};

const dayToVilnius = {
  date: "2026-08-18", weekday: "Tue", dayLabel: "18 Aug",
  location: "Curonian Spit → Klaipėda → Vilnius", title: "Spit → Klaipėda → Vilnius",
  description: `Bus or ferry back to Klaipėda (bringing the bikes if they need returning there), then direct train to Vilnius (~4.5h, several daily departures).`,
  accommodation: { city: "Vilnius", name: null, status: "tbd" },
  bookings: [
    { label: "Klaipėda–Vilnius train", status: "tbd" },
  ],
  travel: ["bus", "train"],
  distance: "~360 km total (ferry/bus to Klaipėda + ~310 km train to Vilnius)",
  mapPath: [
    [55.3049, 20.9928], // Nida
    [55.7033, 21.1443], // back through Klaipėda
    [54.6872, 25.2797], // Vilnius
  ],
};

const dayVilnius = {
  date: "2026-08-19", weekday: "Wed", dayLabel: "19 Aug",
  location: "Vilnius", title: "Vilnius",
  description: `Cathedral Square, Gediminas Tower, Užupis, Gates of Dawn, the Genocide/KGB Museum.`,
  accommodation: { city: "Vilnius", name: null, status: "tbd" },
  bookings: [],
  travel: ["foot"],
  distance: "Local only (walking)",
  mapPath: [[54.6872, 25.2797]], // stays in Vilnius
};

const dayDepart = {
  date: "2026-08-20", weekday: "Thu", dayLabel: "20 Aug",
  location: "Vilnius", title: "Depart",
  description: `Final morning free, then depart.`,
  accommodation: { city: "—", name: null, status: "n/a" },
  bookings: [],
  travel: [],
  distance: null,
  mapPath: [[54.6872, 25.2797]], // stays in Vilnius
};

// ---- Šiauliai-route-specific days (days 3-4) -------------------------------

const daySiauliai2 = {
  date: "2026-08-14", weekday: "Fri", dayLabel: "14 Aug",
  location: "Riga → Klaipėda", title: "Onward to Klaipėda",
  description: `Late morning or early afternoon, board the daily direct train toward Lithuania; change trains at Šiauliai onto an evening service to Klaipėda. Arrive late evening, straight to bed.`,
  accommodation: { city: "Klaipėda", name: null, status: "tbd", note: "Needs late check-in" },
  bookings: [
    { label: "Riga–Šiauliai train", status: "tbd" },
    { label: "Šiauliai–Klaipėda evening connection", status: "tbd" },
  ],
  travel: ["train"],
  distance: "~305 km (train via Šiauliai)",
  mapPath: [
    [56.9496, 24.1052], // Riga
    [55.9349, 23.3143], // change trains at Šiauliai
    [55.7033, 21.1443], // Klaipėda
  ],
};

// Reused by Option #1 only now — Option #2's version of this leg is folded
// into dayLiepajaToSpit below (see the note at the top of the file).
const daySiauliai3 = {
  date: "2026-08-15", weekday: "Sat", dayLabel: "15 Aug",
  location: "Klaipėda → Curonian Spit", title: "Cycle onto the Spit",
  description: `Pick up rental bikes in Klaipėda. Passenger ferry from the Old Ferry Terminal (foot passengers/cyclists only) across to Smiltynė — board an early crossing, bike space per ferry is limited in peak season. Dedicated EuroVelo 10/13 path down the Spit: ~21km to Juodkrantė for lunch (smoked fish, Hill of Witches sculpture trail if there's time), then ~30km through the Nagliai Nature Reserve and grey dunes into Nida by evening. ~52km total, flat and paved, but a full day of riding.`,
  note: `Confirm ahead of time whether the bike rental allows drop-off in Nida, or whether the bikes need to come back to Klaipėda (doable by bus/ferry on the day you leave the Spit).`,
  accommodation: { city: "Nida", name: null, status: "tbd" },
  bookings: [
    { label: "Bike rental, Klaipėda (confirm Nida drop-off)", status: "tbd" },
  ],
  travel: ["bike"],
  distance: "52 km (cycle)",
  mapPath: [
    [55.7033, 21.1443], // Klaipėda
    [55.5324, 21.1197], // Juodkrantė (lunch)
    [55.3049, 20.9928], // Nida
  ],
};

// ---- Liepāja-route-specific days (days 3, 4, 5, 6) -------------------------
// This route spreads the coast crossing over its own days (bus, drive, cycle)
// and drops the Mingė/lagoon boat day entirely — Curonian Spit is down to 2
// nights, with no spare day. It reconverges with the Šiauliai route for
// Vilnius/departure.

const dayLiepaja2 = {
  date: "2026-08-14", weekday: "Fri", dayLabel: "14 Aug",
  location: "Riga → Liepāja", title: "Riga → Liepāja",
  description: `Late morning or midday, bus or train to Liepāja (~3–3.25h; frequent departures through the day). Afternoon and evening in Liepāja, centred on Karosta, the former Soviet naval garrison: the crumbling Northern Forts, the St. Nicholas Naval Cathedral, and Karosta Prison — standard history tours, or the interactive "Behind the Bars" experience for something more intense. Overnight in Liepāja.`,
  accommodation: { city: "Liepāja", name: null, status: "tbd" },
  bookings: [
    { label: "Riga–Liepāja bus or train", status: "tbd" },
    { label: "Karosta Prison tour (standard, or the \"Behind the Bars\" experience)", status: "tbd" },
  ],
  travel: ["train", "foot"],
  distance: "~210 km (bus/train)",
  mapPath: [
    [56.9496, 24.1052], // Riga
    [56.5142, 21.0128], // Liepāja
  ],
};

const dayLiepaja3 = {
  date: "2026-08-15", weekday: "Sat", dayLabel: "15 Aug",
  location: "Liepāja → Palanga", title: "Liepāja → Palanga",
  description: `Pick up a rental car in Liepāja. Drive south, stopping at Pape Nature Park (~15 min from Liepāja) for the coastal dune trail, the shorter Lake Pape loop, or the full ~30km hike around the lake (<a href="https://www.wikiloc.com/hiking-trails/apkart-papes-ezeram-lv-24842240" target="_blank" rel="noopener noreferrer">Apkārt Papes ezeram</a> on Wikiloc) — plus the wild Konik horses. Continue into Lithuania to Palanga — Lithuania's main beach resort, a good place to land for the evening: the pier, Basanavičiaus Street, the Botanical Park, an 18km beach. Return the rental car in Palanga. Overnight there.`,
  note: `This is a one-way, cross-border rental (Latvia → Lithuania) dropped in Palanga specifically rather than Klaipėda — worth checking the agency supports that exact drop point.`,
  accommodation: { city: "Palanga", name: null, status: "tbd" },
  bookings: [
    { label: "One-way rental car, Liepāja → Palanga (confirm the agency supports this drop point)", status: "tbd" },
  ],
  travel: ["car", "foot"],
  distance: "~75 km (car) + 30 km (hike around Lake Pape)",
  mapPath: [
    [56.5142, 21.0128], // Liepāja
    [56.1670, 21.0340], // Pape Nature Park
    [55.9199, 21.0687], // Palanga
  ],
};

// Replaces the old two-day "hike to Klaipėda, then cycle onto the Spit"
// pair — with Riga's extra night, those two days had to become one. The
// coastal hike is dropped in favour of a short bus/ferry transfer into
// Klaipėda, then the same cycle route onwards to Nida.
const dayLiepajaToSpit = {
  date: "2026-08-16", weekday: "Sun", dayLabel: "16 Aug",
  location: "Palanga → Curonian Spit", title: "Bus to Klaipėda, then cycle onto the Spit",
  description: `Morning bus from Palanga to Klaipėda (~30 min, frequent departures along the coast) — the old plan had a full day's hike here, but with Riga picking up an extra night this leg gets compressed into a quick transfer instead. Pick up rental bikes in Klaipėda. Passenger ferry from the Old Ferry Terminal (foot passengers/cyclists only) across to Smiltynė — board an early crossing, bike space per ferry is limited in peak season. Dedicated EuroVelo 10/13 path down the Spit: ~21km to Juodkrantė for lunch (smoked fish, Hill of Witches sculpture trail if there's time), then ~30km through the Nagliai Nature Reserve and grey dunes into Nida by evening. Short bus hop plus ~52km of cycling — a long day, but doable with an early start out of Palanga.`,
  note: `Confirm ahead of time whether the bike rental allows drop-off in Nida, or whether the bikes need to come back to Klaipėda (doable by bus/ferry on the day you leave the Spit).`,
  accommodation: { city: "Nida", name: null, status: "tbd" },
  bookings: [
    { label: "Palanga–Klaipėda bus", status: "tbd" },
    { label: "Bike rental, Klaipėda (confirm Nida drop-off)", status: "tbd" },
  ],
  travel: ["bus", "bike"],
  distance: "~30 km bus + 52 km cycle",
  mapPath: [
    [55.9199, 21.0687], // Palanga
    [55.7033, 21.1443], // Klaipėda (bus + ferry, no overnight)
    [55.5324, 21.1197], // Juodkrantė (lunch)
    [55.3049, 20.9928], // Nida
  ],
};

const dayLiepajaSpitRest = {
  date: "2026-08-17", weekday: "Mon", dayLabel: "17 Aug",
  location: "Curonian Spit", title: "Curonian Spit, rest day",
  description: `Genuinely nothing else planned — after yesterday's long transfer-plus-cycle day, this one earns its keep. Dune, beach, amber-hunting, however slow you want it.`,
  accommodation: { city: "Nida", name: null, status: "tbd" },
  bookings: [],
  travel: ["foot"],
  distance: "Local only (rest day)",
  mapPath: [[55.3049, 20.9928]], // stays in Nida
};

// ---- The two selectable routes ---------------------------------------------

const TRIP = {
  meta: {
    title: "Soggy Baltic Adventure",
    tagline: "Riga → Curonian Spit → Vilnius",
    dateRangeLabel: "12–20 August · 8 nights",
    nightsFootnote: "",
  },

  routes: {
    siauliai: {
      key: "siauliai",
      label: "Option #1",
      description: "Train via Šiauliai to Klaipėda, then cycle the Curonian Spit down to Nida.",
      // Slideshow images for this route variant, shown beneath the route
      // description near the top of the page. See README.md for how to add
      // your own. Each entry is { src: "images/filename.jpg", caption: "..." }.
      photos: [
        { src: "images/option1/aukstumala-bog-boardwalk.webp", caption: "Boardwalk over Aukštumala bog, near the Nemunas Delta" },
      ],
      itinerary: {
        summary: "This itinerary leans more heavily into Lithuania, with two nights in Riga to cover the Latvian leg. We'll travel the full length of the Curonian Spit and wave our willies most ferociously at the Russians across the border, then hop on a ferry back across the lagoon to the Lithuanian mainland to explore a nature reserve around a river delta, before a full day in Vilnius to finish.",
        nights: "Riga 2 · Klaipėda 1 · Curonian Spit 3 · Vilnius 2",
        days: [
          dayArriveRiga,
          dayRigaTogether,
          daySiauliai2,
          daySiauliai3,
          dayNidaRecovery,
          dayLagoon,
          dayToVilnius,
          dayVilnius,
          dayDepart,
        ],
      },
      // `stops` are the named markers/labels; `path` is the ordered list of
      // coordinates the main polyline follows (Klaipėda appears twice — once
      // heading down to the Spit, once on the way back up to catch the
      // Vilnius train).
      route: {
        stops: [
          { name: "Riga", lat: 56.9496, lng: 24.1052, kind: "overnight", note: "Arrival & departure city — 2 nights" },
          { name: "Šiauliai", lat: 55.9349, lng: 23.3143, kind: "waypoint", note: "Train change only — not an overnight stop" },
          { name: "Klaipėda", lat: 55.7033, lng: 21.1443, kind: "overnight", note: "Gateway to the Spit — 1 night, late arrival, late check-in needed" },
          { name: "Juodkrantė", lat: 55.5324, lng: 21.1197, kind: "waypoint", note: "Lunch stop on the cycle — smoked fish, Hill of Witches", showMarker: false },
          { name: "Curonian Spit", lat: 55.3049, lng: 20.9928, kind: "overnight", note: "3 nights — dunes, we'll all get our willies out to scare off the Russians, lagoon boat trip, near the Kaliningrad border" },
          { name: "Vilnius", lat: 54.6872, lng: 25.2797, kind: "overnight", note: "Old town, Užupis — 2 nights" },
        ],
        path: [
          [56.9496, 24.1052], // Riga
          [55.9349, 23.3143], // Šiauliai (change trains)
          [55.7033, 21.1443], // Klaipėda
          [55.5324, 21.1197], // Juodkrantė
          [55.3049, 20.9928], // Nida
          [55.7033, 21.1443], // back through Klaipėda
          [54.6872, 25.2797], // Vilnius
        ],
        // No day trip on this route any more — dropped to make room for
        // Riga's extra night (see note at top of file).
        sideTrip: null,
      },
    },

    liepaja: {
      key: "liepaja",
      label: "Option #2",
      description: "A slower-paced coastal route via Liepāja and Palanga, trading a bit of walking for a short bus hop into Klaipėda — still covers the entire Lithuanian coastline.",
      photos: [
        { src: "images/option2/folk-costume-countryside.jpg", caption: "Traditional Latvian/Lithuanian coastal countryside" },
        { src: "images/option2/pape-lake-reeds.jpg", caption: "Lake Pape reedbeds, Pape Nature Park" },
        { src: "images/option2/pape-birdwatching-hut.jpg", caption: "Birdwatching hide, Pape Nature Park" },
        { src: "images/option2/pape-konik-horses.jpg", caption: "Wild Konik horses, Pape Nature Park" },
      ],
      itinerary: {
        summary: "Rest assured, all variations of this trip include the sacred ritual of willies being waved at Russians. This route, alongside two nights in Riga, also sees us travel along the Latvian coast to enjoy the fabled Pape Nature Reserve, meaning we'll be able to say we've travelled the entire length of the Lithuanian coastline by the time we're done — Palanga to Klaipėda gets covered by a quick bus hop rather than on foot, to make room for the detour.",
        nights: "Riga 2 · Liepāja 1 · Palanga 1 · Curonian Spit 2 · Vilnius 2",
        days: [
          dayArriveRiga,
          dayRigaTogether,
          dayLiepaja2,
          dayLiepaja3,
          dayLiepajaToSpit,
          dayLiepajaSpitRest,
          dayToVilnius,
          dayVilnius,
          dayDepart,
        ],
      },
      route: {
        stops: [
          { name: "Riga", lat: 56.9496, lng: 24.1052, kind: "overnight", note: "Arrival & departure city — 2 nights" },
          { name: "Liepāja", lat: 56.5142, lng: 21.0128, kind: "overnight", note: "1 night — Karosta naval garrison, Northern Forts, Karosta Prison" },
          { name: "Pape Nature Park", lat: 56.1670, lng: 21.0340, kind: "waypoint", note: "Coastal dune hike or Lake Pape loop — wild Konik horses" },
          { name: "Palanga", lat: 55.9199, lng: 21.0687, kind: "overnight", note: "1 night — pier, Basanavičiaus Street, Botanical Park, 18km beach; rental car dropped here" },
          { name: "Klaipėda", lat: 55.7033, lng: 21.1443, kind: "waypoint", note: "Quick bus + ferry transfer en route to the Spit — no overnight here any more" },
          { name: "Juodkrantė", lat: 55.5324, lng: 21.1197, kind: "waypoint", note: "Lunch stop on the cycle — smoked fish, Hill of Witches", showMarker: false },
          { name: "Curonian Spit", lat: 55.3049, lng: 20.9928, kind: "overnight", note: "2 nights — dunes, we'll all get our willies out to scare off the Russians, near the Kaliningrad border" },
          { name: "Vilnius", lat: 54.6872, lng: 25.2797, kind: "overnight", note: "Old town, Užupis — 2 nights" },
        ],
        path: [
          [56.9496, 24.1052], // Riga
          [56.5142, 21.0128], // Liepāja
          [56.1670, 21.0340], // Pape Nature Park
          [55.9199, 21.0687], // Palanga
          [55.7033, 21.1443], // Klaipėda (transfer only)
          [55.5324, 21.1197], // Juodkrantė
          [55.3049, 20.9928], // Nida
          [55.7033, 21.1443], // back through Klaipėda
          [54.6872, 25.2797], // Vilnius
        ],
        // No day trip on this route — matches Option #1, which dropped its
        // day trip too.
        sideTrip: null,
      },
    },
  },

  openItems: [
    { text: "Book Riga–Šiauliai–Klaipėda train tickets (~30 days out)", routes: ["siauliai"] },
    { text: "Book the Šiauliai–Klaipėda evening connection, with a buffer rather than the tightest possible transfer", routes: ["siauliai"] },
    { text: "Book accommodation: Riga (2 nights), Klaipėda (late check-in), Nida (3 nights), Vilnius (2 nights)", routes: ["siauliai"] },
    { text: "Book the Riga–Liepāja bus or train", routes: ["liepaja"] },
    { text: "Book the Karosta Prison tour in Liepāja (standard, or the \"Behind the Bars\" experience)", routes: ["liepaja"] },
    { text: "Book the one-way rental car, Liepāja → Palanga — confirm the agency supports dropping in Palanga specifically", routes: ["liepaja"] },
    { text: "Book the Palanga–Klaipėda bus", routes: ["liepaja"] },
    { text: "Book accommodation: Riga (2 nights), Liepāja, Palanga, Nida (2 nights), Vilnius (2 nights)", routes: ["liepaja"] },
    { text: "Book bike rental in Klaipėda — confirm whether Nida drop-off is possible" },
    { text: "Book the Mingė / Nemunas Delta boat charter (Nida tourist info or visitneringa.com)", routes: ["siauliai"] },
    { text: "Book the Klaipėda–Vilnius train" },
    { text: "Decide whether to swap in Rundāle Palace" },
  ],
};
