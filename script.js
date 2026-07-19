// Soggy Baltic Adventure — page renderer
// Reads the TRIP object from data.js and builds the DOM. No build step required.

(function () {
  let mapInstance = null;
  let currentMarker = null;
  let markerAnimFrame = null;
  let currentRouteKey = "liepaja";
  let scrollHandlerRef = null;
  let resizeHandlerRef = null;

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function currentRoute() {
    return TRIP.routes[currentRouteKey];
  }

  function statusBadge(status) {
    const map = {
      tbd: { label: "TBD", cls: "badge-tbd" },
      booked: { label: "Booked", cls: "badge-booked" },
      confirmed: { label: "Confirmed", cls: "badge-confirmed" },
      "n/a": { label: "—", cls: "badge-na" },
    };
    const s = map[status] || map.tbd;
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  const TRAVEL_MODES = {
    train: { icon: "🚆", label: "Train" },
    bike: { icon: "🚲", label: "Bicycle" },
    foot: { icon: "🚶", label: "On foot" },
    car: { icon: "🚗", label: "Car" },
    bus: { icon: "🚌", label: "Bus" },
  };

  function renderTravelModes(modes) {
    if (!modes || !modes.length) return null;
    const wrap = el("div", "day-travel");
    modes.forEach((key) => {
      const mode = TRAVEL_MODES[key];
      if (!mode) return;
      const chip = el("span", "travel-chip", `<span class="travel-icon" aria-hidden="true">${mode.icon}</span>${mode.label}`);
      wrap.appendChild(chip);
    });
    return wrap;
  }

  function renderMeta() {
    document.getElementById("trip-title").textContent = TRIP.meta.title;
    document.getElementById("trip-tagline").textContent = TRIP.meta.tagline;
    document.getElementById("trip-date-range").textContent = TRIP.meta.dateRangeLabel;
    document.title = `${TRIP.meta.title} — ${TRIP.meta.tagline}`;

    const footnoteEl = document.getElementById("nights-footnote");
    if (footnoteEl) footnoteEl.textContent = TRIP.meta.nightsFootnote || "";
  }

  function renderRouteMap() {
    const mapEl = document.getElementById("route-map");
    if (!mapEl) return;

    // Only show the "optional day-trip (dashed)" legend entry when the
    // current route actually has one (the Liepāja route doesn't).
    const sideTripLegend = document.getElementById("legend-sidetrip");
    if (sideTripLegend) {
      sideTripLegend.style.display = currentRoute().route.sideTrip ? "" : "none";
    }

    // Tear down any previously-built map before rebuilding for the newly
    // selected route (Leaflet won't re-init a container that's still bound
    // to an existing map instance).
    if (mapInstance) {
      if (markerAnimFrame) cancelAnimationFrame(markerAnimFrame);
      mapInstance.remove();
      mapInstance = null;
      currentMarker = null;
    }
    mapEl.innerHTML = "";

    if (typeof L === "undefined") {
      mapEl.innerHTML = '<p class="map-fallback">Map couldn\'t load (no internet connection?) — see the stop list below.</p>';
      return;
    }

    const routeData = currentRoute().route;
    const map = L.map(mapEl, { scrollWheelZoom: false });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    L.polyline(routeData.path, {
      color: "#d98c3d",
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    if (routeData.sideTrip) {
      L.polyline(routeData.sideTrip.path, {
        color: "#16405c",
        weight: 3,
        opacity: 0.7,
        dashArray: "6 8",
      }).addTo(map);
    }

    const bounds = [];

    routeData.stops.forEach((stop) => {
      bounds.push([stop.lat, stop.lng]);
      if (stop.showMarker === false) return;

      const isOvernight = stop.kind === "overnight";
      const marker = L.circleMarker([stop.lat, stop.lng], {
        radius: isOvernight ? 9 : 6,
        color: "#0f2a3f",
        weight: 2,
        fillColor: isOvernight ? "#d98c3d" : "#ffffff",
        fillOpacity: 1,
      }).addTo(map);
      marker.bindPopup(`<strong>${stop.name}</strong><br>${stop.note}`);
      marker.bindTooltip(stop.name, {
        permanent: true,
        direction: "top",
        offset: [0, -8],
        className: "route-label",
      });
    });

    if (routeData.sideTrip) {
      routeData.sideTrip.stops.forEach((stop) => {
        bounds.push([stop.lat, stop.lng]);
        if (stop.showMarker === false) return;

        const marker = L.circleMarker([stop.lat, stop.lng], {
          radius: 7,
          color: "#16405c",
          weight: 2,
          dashArray: "3 3",
          fillColor: "#ffffff",
          fillOpacity: 1,
        }).addTo(map);
        marker.bindPopup(`<strong>${stop.name}</strong> <em>(${routeData.sideTrip.label})</em><br>${stop.note}`);
        marker.bindTooltip(stop.name, {
          permanent: true,
          direction: "top",
          offset: [0, -8],
          className: "route-label route-label-side",
        });
      });
    }

    map.fitBounds(bounds, { padding: [40, 40] });
    // Net zoom adjustment relative to fitBounds' tightest fit.
    const zoomOffset = 0;
    if (zoomOffset !== 0) map.setZoom(map.getZoom() + zoomOffset);

    // "Where we are" marker — tracks the day card centred in the viewport
    // as the itinerary is scrolled (see setupMapScrollSync), travelling
    // along the actual route line rather than cutting straight-line corners.
    const startPosition = currentRoute().itinerary.days[0].mapPath[0];
    const currentIcon = L.divIcon({
      className: "current-position-marker",
      html: '<span class="pulse-dot"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    currentMarker = L.marker(startPosition, {
      icon: currentIcon,
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(map);

    mapInstance = map;
  }

  // Animates the "current position" marker along a sequence of [lat, lng]
  // points (following the real route rather than a straight line), and
  // pans the map to keep the marker centred throughout the movement.
  function animateMarkerAlong(points) {
    if (!currentMarker || !points || points.length === 0) return;

    if (markerAnimFrame) cancelAnimationFrame(markerAnimFrame);

    if (points.length === 1) {
      currentMarker.setLatLng(points[0]);
      if (mapInstance) mapInstance.setView(points[0], mapInstance.getZoom(), { animate: false });
      return;
    }

    // Cumulative distance along the point sequence, so movement speed is
    // roughly constant regardless of how many hops the path has.
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) {
      const [lat1, lng1] = points[i - 1];
      const [lat2, lng2] = points[i];
      cumulative.push(cumulative[i - 1] + Math.hypot(lat2 - lat1, lng2 - lng1));
    }
    const total = cumulative[cumulative.length - 1];
    if (total === 0) {
      currentMarker.setLatLng(points[points.length - 1]);
      if (mapInstance) mapInstance.setView(points[points.length - 1], mapInstance.getZoom(), { animate: false });
      return;
    }

    const duration = Math.min(1800, Math.max(500, total * 2600));
    const startTime = performance.now();

    function pointAtDistance(dist) {
      let segIndex = 0;
      while (segIndex < cumulative.length - 2 && cumulative[segIndex + 1] < dist) segIndex++;
      const segStart = cumulative[segIndex];
      const segEnd = cumulative[segIndex + 1];
      const segT = segEnd > segStart ? (dist - segStart) / (segEnd - segStart) : 1;
      const p1 = points[segIndex];
      const p2 = points[segIndex + 1];
      return [p1[0] + (p2[0] - p1[0]) * segT, p1[1] + (p2[1] - p1[1]) * segT];
    }

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      // easeInOutQuad
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const pos = pointAtDistance(ease * total);
      currentMarker.setLatLng(pos);
      if (mapInstance) mapInstance.setView(pos, mapInstance.getZoom(), { animate: false });
      if (t < 1) {
        markerAnimFrame = requestAnimationFrame(step);
      }
    }
    markerAnimFrame = requestAnimationFrame(step);
  }

  // Watches scroll position and, as each day card crosses the vertical
  // centre of the viewport, walks the map marker along that day's
  // mapPath (reversed when scrolling back up) and highlights the active
  // card. Jumping across multiple days at once (e.g. a big scroll) walks
  // through every day in between so the line is always traced correctly.
  function setupMapScrollSync(dayEls) {
    // Remove any listeners from a previous route's render before attaching
    // new ones, so switching routes doesn't stack up duplicate handlers.
    if (scrollHandlerRef) {
      window.removeEventListener("scroll", scrollHandlerRef);
      window.removeEventListener("resize", resizeHandlerRef);
      scrollHandlerRef = null;
      resizeHandlerRef = null;
    }

    if (!dayEls.length) return;

    let ticking = false;
    let lastIndex = -1;

    function updateActive() {
      ticking = false;
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDist = Infinity;

      dayEls.forEach((cardEl, i) => {
        const rect = cardEl.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      if (closestIndex === lastIndex) return;

      dayEls.forEach((cardEl, i) => cardEl.classList.toggle("active", i === closestIndex));

      const days = currentRoute().itinerary.days;

      if (lastIndex === -1) {
        // First run: just place the marker, no animation needed.
        lastIndex = closestIndex;
        animateMarkerAlong([days[closestIndex].mapPath[days[closestIndex].mapPath.length - 1]]);
        return;
      }

      let trail = [];
      if (closestIndex > lastIndex) {
        for (let i = lastIndex + 1; i <= closestIndex; i++) {
          trail = trail.concat(days[i].mapPath);
        }
      } else {
        for (let i = lastIndex; i > closestIndex; i--) {
          trail = trail.concat([...days[i].mapPath].reverse());
        }
      }
      lastIndex = closestIndex;
      animateMarkerAlong(trail);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    scrollHandlerRef = onScroll;
    resizeHandlerRef = onScroll;
    updateActive();
  }

  // Slideshow of images for the currently selected route variant, shown
  // beneath the route description near the top of the page. Falls back to
  // a placeholder box when the route's `photos` array (in data.js) is
  // empty. Re-rendered from scratch on every route switch.
  let slideshowIndex = 0;

  function renderRouteSlideshow() {
    const wrap = document.getElementById("route-slideshow");
    if (!wrap) return;
    wrap.innerHTML = "";
    slideshowIndex = 0;

    const photos = currentRoute().photos || [];

    if (!photos.length) {
      wrap.appendChild(el(
        "p",
        "slideshow-placeholder",
        `No photos yet for this route — drop image files into the <code>images/</code> folder, then add them to this route's <code>photos</code> array in <code>data.js</code> — e.g. <code>{ src: "images/your-photo.jpg", caption: "..." }</code>.`
      ));
      return;
    }

    const stage = el("div", "slideshow-stage");
    const img = document.createElement("img");
    img.className = "slideshow-image";
    stage.appendChild(img);

    if (photos.length > 1) {
      const prevBtn = el("button", "slideshow-nav slideshow-prev", "&#8249;");
      prevBtn.type = "button";
      prevBtn.setAttribute("aria-label", "Previous photo");
      prevBtn.addEventListener("click", () => show(slideshowIndex - 1));

      const nextBtn = el("button", "slideshow-nav slideshow-next", "&#8250;");
      nextBtn.type = "button";
      nextBtn.setAttribute("aria-label", "Next photo");
      nextBtn.addEventListener("click", () => show(slideshowIndex + 1));

      stage.appendChild(prevBtn);
      stage.appendChild(nextBtn);
    }

    const caption = el("p", "slideshow-caption");
    const counter = el("span", "slideshow-counter");
    const dotsWrap = el("div", "slideshow-dots");
    const dots = photos.map((_, i) => {
      const dot = el("span", "slideshow-dot");
      dot.addEventListener("click", () => show(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function show(index) {
      slideshowIndex = ((index % photos.length) + photos.length) % photos.length;
      const photo = photos[slideshowIndex];
      img.src = photo.src;
      img.alt = photo.caption || `${currentRoute().label} photo ${slideshowIndex + 1}`;
      caption.textContent = photo.caption || "";
      caption.style.display = photo.caption ? "" : "none";
      dots.forEach((dot, i) => dot.classList.toggle("active", i === slideshowIndex));
      counter.textContent = `${slideshowIndex + 1} / ${photos.length}`;
    }

    const footer = el("div", "slideshow-footer");
    footer.appendChild(dotsWrap);
    footer.appendChild(counter);

    wrap.appendChild(stage);
    wrap.appendChild(caption);
    wrap.appendChild(footer);

    show(0);
  }

  function renderDayCard(day, index) {
    const card = el("article", "day-card");
    card.dataset.dayIndex = String(index);

    const head = el("div", "day-card-head");

    const dateCol = el("div", "day-date-col");
    dateCol.appendChild(el("p", "day-number", `Day ${index + 1}`));
    dateCol.appendChild(el("div", "day-date", `<span class="day-weekday">${day.weekday}</span><span class="day-num">${day.dayLabel}</span>`));
    head.appendChild(dateCol);

    const headText = el("div", "day-head-text");
    headText.appendChild(el("p", "day-location", day.location));
    headText.appendChild(el("h3", "day-title", day.title));
    if (day.distance) {
      headText.appendChild(el("p", "day-distance", `📏 ${day.distance}`));
    }
    head.appendChild(headText);

    const travelModes = renderTravelModes(day.travel);
    if (travelModes) head.appendChild(travelModes);

    card.appendChild(head);

    card.appendChild(el("p", "day-description", day.description));

    if (day.note) {
      card.appendChild(el("p", "day-note", `<strong>Note:</strong> ${day.note}`));
    }

    const details = el("div", "day-details");

    const accom = el("div", "day-accom");
    const accomLabel = day.accommodation && day.accommodation.name
      ? day.accommodation.name
      : (day.accommodation && day.accommodation.city !== "—" ? `${day.accommodation.city} — not yet booked` : "—");
    accom.innerHTML = `<span class="detail-label">Accommodation</span> <span class="detail-value">${accomLabel}</span> ${day.accommodation ? statusBadge(day.accommodation.status) : ""}`;
    if (day.accommodation && day.accommodation.note) {
      accom.innerHTML += ` <span class="detail-note">(${day.accommodation.note})</span>`;
    }
    details.appendChild(accom);

    if (day.bookings && day.bookings.length) {
      const bookingsWrap = el("div", "day-bookings");
      bookingsWrap.appendChild(el("span", "detail-label", "To book"));
      const list = el("ul", "booking-list");
      day.bookings.forEach((b) => {
        list.appendChild(el("li", "", `${b.label} ${statusBadge(b.status)}`));
      });
      bookingsWrap.appendChild(list);
      details.appendChild(bookingsWrap);
    }

    card.appendChild(details);
    return card;
  }

  function renderItinerary() {
    const trip = currentRoute().itinerary;

    document.getElementById("trip-summary-text").textContent = trip.summary;
    document.getElementById("trip-nights").textContent = `Nights: ${trip.nights}`;

    // The David's-arrival footnote only makes sense when this route's
    // nights actually carry an asterisk (some routes' night counts are
    // fixed regardless of arrival timing, so there's nothing to footnote).
    const footnoteEl = document.getElementById("nights-footnote");
    if (footnoteEl) {
      footnoteEl.style.display = trip.nights.includes("*") ? "" : "none";
    }

    const daysWrap = document.getElementById("days");
    daysWrap.innerHTML = "";
    trip.days.forEach((day, i) => daysWrap.appendChild(renderDayCard(day, i)));

    setupMapScrollSync(Array.from(daysWrap.querySelectorAll(".day-card")));
  }

  function itemAppliesToCurrentRoute(item) {
    return !item.routes || item.routes.includes(currentRouteKey);
  }

  function renderOpenItems() {
    const list = document.getElementById("open-items-list");
    list.innerHTML = "";
    TRIP.openItems
      .filter(itemAppliesToCurrentRoute)
      .forEach((item) => {
        list.appendChild(el("li", "", item.text));
      });
  }

  // Re-renders every route-dependent part of the page for the currently
  // selected route (map, itinerary, logistics, open items).
  function renderForCurrentRoute() {
    renderRouteSlideshow();
    renderRouteMap();
    renderItinerary();
    renderOpenItems();
  }

  function initRouteToggle() {
    const buttons = document.querySelectorAll(".route-btn");

    function selectRoute(key) {
      if (!TRIP.routes[key]) return;
      currentRouteKey = key;

      buttons.forEach((btn) => {
        const active = btn.dataset.route === key;
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.classList.toggle("active", active);
      });

      renderForCurrentRoute();
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => selectRoute(btn.dataset.route));
    });

    selectRoute(currentRouteKey);
  }

  // Toggles all day cards between full detail and a condensed single-row
  // view (day number, date, location, and travel chips only). The class
  // lives on the #days container itself, which renderItinerary() never
  // replaces (only its children), so the collapsed state survives switching
  // routes.
  function initCondenseToggle() {
    const btn = document.getElementById("condense-toggle");
    const daysWrap = document.getElementById("days");
    if (!btn || !daysWrap) return;

    let condensed = false;

    function apply() {
      daysWrap.classList.toggle("condensed", condensed);
      btn.setAttribute("aria-pressed", condensed ? "true" : "false");
      btn.textContent = condensed ? "Expand days" : "Condense days";
    }

    btn.addEventListener("click", () => {
      condensed = !condensed;
      apply();
    });

    apply();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderMeta();
    initRouteToggle();
    initCondenseToggle();
  });
})();
