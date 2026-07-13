# Soggy Baltic Adventure

Itinerary site for the Riga → Curonian Spit → Vilnius trip, 12–20 August.

Plain HTML/CSS/JS, no build step, no dependencies. All content lives in `data.js` —
edit that file to fill in accommodation, booking statuses, and notes as they're locked in.

## Preview locally

Just open `index.html` in a browser — double-click it, or drag it into a browser
window. No server required.

If you'd rather run a local server (some browsers restrict things like relative
paths under `file://`, though this site doesn't rely on that), from inside this
folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Filling in gaps

Open `data.js`. Each day has:

- `accommodation` — set `name` and change `status` to `"booked"` or `"confirmed"`
  once you've picked/booked somewhere.
- `bookings` — a list of things to book for that day (trains, ferries, bike
  rental, etc). Change an item's `status` the same way.

The top-level `openItems` array is the master checklist shown at the bottom of
the page — delete a line once it's sorted, or leave it and just update the
underlying day entry.

The itinerary currently assumes all three travellers arrive in Riga on 12
August. If that changes, the whole timeline shifts a day later — Riga picks
up an extra night, Vilnius loses one, departure moves from Thursday to
Friday. Ask Claude to reinstate a two-scenario toggle if that becomes a live
possibility again (an earlier version of this site had one).

## Adding photos to the route slideshow

There's a slideshow near the top of the page, just under each route's
description — a placeholder box until you add images, then a photo carousel
with prev/next arrows, dots, and captions. Each route variant (Šiauliai /
Liepāja) has its own set of photos and its own slideshow.

1. Drop your image files into the `images/` folder in this project.
2. In `data.js`, find the route you want (`TRIP.routes.siauliai` or
   `TRIP.routes.liepaja`) and add entries to its `photos` array, e.g.:

   ```js
   photos: [
     { src: "images/riga-old-town.jpg", caption: "Riga Old Town, first evening" },
     { src: "images/juodkrante-witches-hill.jpg" }, // caption is optional
   ],
   ```

3. Refresh the page. That's it — no other changes needed. Switching between
   routes automatically switches which slideshow (and photos) is showing.

Keep image files reasonably sized (a few hundred KB each is plenty for web
display) so the page doesn't get slow to load once you've added a lot of them.

## Deploying to soggybalticadventure.mvco.agency

### 1. Push to GitHub

A helper script is included: `push-to-github.sh`. It requires the GitHub CLI
(`gh`) installed and logged in (`gh auth login`, one-time setup if you haven't
already). From this folder, in Terminal:

```
chmod +x push-to-github.sh
./push-to-github.sh
```

This creates `github.com/oliver2680/soggy-baltic-adventure` and pushes
everything to it in one go. (If you'd rather do it by hand: `git init -b main
&& git add -A && git commit -m "Initial commit" && gh repo create
soggy-baltic-adventure --public --source=. --remote=origin --push`.)

### 2. Connect Cloudflare Pages

1. In the Cloudflare dashboard, add a Pages project connected to the
   `soggy-baltic-adventure` GitHub repo.
   - Build command: none
   - Build output directory: `/` (repo root, since there's no build step)
2. Add a custom domain on the Pages project: `soggybalticadventure.mvco.agency`.
   Cloudflare will handle the DNS record automatically if `mvco.agency`'s DNS
   is already on Cloudflare.
3. From then on, `git push` to the repo's default branch auto-deploys.
