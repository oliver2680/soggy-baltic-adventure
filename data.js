// Soggy Baltic Adventure — itinerary data
// Edit this file to fill in gaps (accommodation names, booking statuses, notes).
// Keep the HTML/CSS alone; everything on the page is generated from this object.
//
// Confirmed: David arrives 13 Aug, not the 12th (the other two still arrive
// on the 12th). Riga gets a fixed two nights, with a dedicated "Riga
// together" day once David lands.
//
// This used to offer two route options (train via Šiauliai vs. a coastal
// road trip via Liepāja) — we've settled on the Liepāja route, so the
// Šiauliai variant and the route-toggle UI have been removed. The data
// model still nests everything under TRIP.routes.liepaja for now, in case
// that's useful again later.

// ---- Shared days (identical regardless of route) --------------------------

const dayArriveRiga = {
  date: "2026-08-12", weekday: "Wed", dayLabel: "12 Aug",
  location: "Riga", title: "Arrive Riga",
  description: `Two of three arrive today — David joins tomorrow. Settle in. Evening: UEFA Super Cup final, Aston Villa v PSG, kickoff 22:00 — find a pub in the centre with a big screen.`,
  accommodation: {
    city: "Riga",
    name: '<a href="https://www.airbnb.co.uk/rooms/624487583224851997" target="_blank" rel="noopener noreferrer">Central Chic&amp;Rock Apartment</a> (Blaumaņa iela)',
    status: "booked",
  },
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
  accommodation: {
    city: "Riga",
    name: '<a href="https://www.airbnb.co.uk/rooms/624487583224851997" target="_blank" rel="noopener noreferrer">Central Chic&amp;Rock Apartment</a> (Blaumaņa iela)',
    status: "booked",
  },
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

const dayToVilnius = {
  date: "2026-08-18", weekday: "Tue", dayLabel: "18 Aug",
  location: "Curonian Spit → Klaipėda → Vilnius", title: "Spit → Klaipėda → Vilnius",
  description: `Bus or ferry back to Klaipėda (bringing the bikes if they need returning there), then direct train to Vilnius (~4.5h, several daily departures).`,
  accommodation: { city: "Vilnius", name: "Family flat, or Oliver's wife's family's home (venue TBC — either way, sorted)", status: "confirmed" },
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
  accommodation: { city: "Vilnius", name: "Family flat, or Oliver's wife's family's home (venue TBC — either way, sorted)", status: "confirmed" },
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

// ---- Route-specific days (days 3-6) ----------------------------------------

const dayLiepaja2 = {
  date: "2026-08-14", weekday: "Fri", dayLabel: "14 Aug",
  location: "Riga → Liepāja", title: "Riga → Liepāja",
  description: `Late morning or midday, bus or train to Liepāja (~3–3.25h; frequent departures through the day). Afternoon and evening in Liepāja, centred on Karosta, the former Soviet naval garrison: the crumbling Northern Forts, the St. Nicholas Naval Cathedral, and Karosta Prison — standard history tours, or the interactive "Behind the Bars" experience for something more intense. Overnight in Liepāja.`,
  accommodation: { city: "Liepāja", name: "Vecā ostmala 51, Liepāja, 3401, Latvia", status: "booked" },
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
  note: `This is a one-way, cross-border rental (Latvia → Lithuania) — currently planned to drop in Palanga, but worth pricing up extending it through to Klaipėda instead: dropping there would skip Sunday morning's bus and let the group move straight onto the bikes. Whichever drop point ends up cheaper/available, confirm the agency supports it.`,
  accommodation: { city: "Palanga", name: "Jūros takas 3, Palanga, Klaipėdos apskritis 00135, Lithuania", status: "booked" },
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
  accommodation: { city: "Nida", name: null, status: "tbd", note: "Richard to book" },
  bookings: [
    { label: "Palanga–Klaipėda bus", status: "tbd" },
    { label: "Bike rental, Klaipėda (confirm Nida drop-off) — David to book", status: "tbd" },
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
  accommodation: { city: "Nida", name: null, status: "tbd", note: "Richard to book" },
  bookings: [],
  travel: ["foot"],
  distance: "Local only (rest day)",
  mapPath: [[55.3049, 20.9928]], // stays in Nida
};

// ---- The route ---------------------------------------------------------

const TRIP = {
  meta: {
    title: "Soggy Baltic Adventure",
    tagline: "Riga → Curonian Spit → Vilnius",
    dateRangeLabel: "12–20 August · 8 nights",
    nightsFootnote: "",
  },

  routes: {
    liepaja: {
      key: "liepaja",
      label: "The itinerary",
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
        // No day trip on this route.
        sideTrip: null,
      },
    },
  },

  openItems: [
    { text: "Book the Riga–Liepāja bus or train" },
    { text: "Book the Karosta Prison tour in Liepāja (standard, or the \"Behind the Bars\" experience)" },
    { text: "Decide whether to extend the Liepāja rental car through to Klaipėda instead of dropping in Palanga — would skip the Sunday-morning bus" },
    { text: "Book the rental car, Liepāja → Palanga (or → Klaipėda, if extended)" },
    { text: "Book the Palanga–Klaipėda bus (not needed if the rental car gets extended to Klaipėda)" },
    { text: "Book accommodation: Nida (2 nights) — Richard's booking it" },
    { text: "Book bike rental in Klaipėda — David's booking it; confirm whether Nida drop-off is possible" },
    { text: "Book the Klaipėda–Vilnius train" },
    { text: "Decide whether to swap in Rundāle Palace" },
  ],
};
