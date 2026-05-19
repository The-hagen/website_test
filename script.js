// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== ACTIVITY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const activityCards = document.querySelectorAll('#activities-grid .card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    activityCards.forEach(card => {
      const tags = card.dataset.tags || '';
      card.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
    });
  });
});

// ===== FOOD FILTER =====
const foodCatBtns = document.querySelectorAll('.food-cat-btn');
const foodCards = document.querySelectorAll('#food-grid .food-card');

foodCatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    foodCatBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    foodCards.forEach(card => {
      const cats = card.dataset.cat || '';
      card.classList.toggle('hidden', cat !== 'all' && !cats.includes(cat));
    });
  });
});

// ===== INTERSECTION OBSERVER (fade-in on scroll) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .food-card, .budget-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== INTERACTIVE MAP =====
const map = L.map('map-container', {
  center: [59.3293, 18.0686],
  zoom: 13,
  zoomControl: true,
});

// CARTO light tiles — no API key needed
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);

// Custom marker icons
function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px; height:32px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.28);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const icons = {
  activity:  makeIcon('#1a6ea8'),
  food:      makeIcon('#e8a020'),
  viewpoint: makeIcon('#2a8a4a'),
  transport: makeIcon('#8a3aa8'),
};

// Map points of interest
const places = [
  // Activities
  { lat: 59.3250, lng: 18.0710, type: 'activity', name: 'Gamla Stan', desc: 'Medieval old town — cobblestone streets, Royal Palace, and charming squares. Free to explore.' },
  { lat: 59.3281, lng: 18.1021, type: 'activity', name: 'Vasa Museum', desc: 'Home to the legendary 17th-century warship. ~200 SEK. Located on Djurgården island.' },
  { lat: 59.3320, lng: 18.1080, type: 'activity', name: 'Djurgården Island', desc: 'Royal park island — cycling, walking, picnics and multiple museums. Island entry is free.' },
  { lat: 59.3247, lng: 18.0717, type: 'activity', name: 'Royal Palace', desc: 'One of Europe\'s largest working palaces. ~180 SEK. Changing of the Guard is free to watch.' },
  { lat: 59.3317, lng: 18.0540, type: 'activity', name: 'Moderna Museet', desc: 'World-class modern art museum — Picasso, Dalí & more. Permanent collection is FREE.' },
  { lat: 59.3158, lng: 18.0670, type: 'activity', name: 'Södermalm', desc: 'Hip bohemian neighbourhood with street art, vintage shops, cafés, and great viewpoints.' },
  { lat: 59.3445, lng: 18.1050, type: 'activity', name: 'Kaknästornet', desc: '155m tower with panoramic 360° views over Stockholm. ~150 SEK. Café at the top.' },

  // Food
  { lat: 59.3360, lng: 18.0730, type: 'food', name: 'Östermalm Food Hall', desc: 'Beautiful indoor market (Saluhall) with seafood, meats, cheese & ready meals. 100–200 SEK.' },
  { lat: 59.3135, lng: 18.0720, type: 'food', name: 'Medborgarplatsen Food Stalls', desc: 'Popular square in Södermalm. Find tunnbrödsrulle (hotdog flatbread) for 40–60 SEK.' },
  { lat: 59.3254, lng: 18.0699, type: 'food', name: 'Stortorget — Gamla Stan Cafés', desc: 'Pretty main square in the old town. Great fika spots — cinnamon bun & coffee ~60 SEK.' },
  { lat: 59.3330, lng: 18.0620, type: 'food', name: 'Östermalm Restaurants Row', desc: 'Strandvägen area — upscale Swedish seafood & restaurants. Budget ~300–500 SEK/head.' },

  // Viewpoints
  { lat: 59.3178, lng: 18.0610, type: 'viewpoint', name: 'Monteliusvägen', desc: 'FREE cliffside walkway in Södermalm with sweeping views over Gamla Stan and the water.' },
  { lat: 59.3148, lng: 18.0528, type: 'viewpoint', name: 'Skinnarviksberget', desc: 'Highest natural point in inner Stockholm. Popular picnic spot with fantastic panoramic views.' },
  { lat: 59.3167, lng: 18.0789, type: 'viewpoint', name: 'Fjällgatan', desc: 'Historic street perched above Södermalm — superb views, free, best at sunset.' },

  // Transport
  { lat: 59.3311, lng: 18.0583, type: 'transport', name: 'T-Centralen (Central Metro)', desc: 'Stockholm\'s main metro hub. Buy an SL Access card here. Blue line art gallery is famous.' },
  { lat: 59.3325, lng: 18.0612, type: 'transport', name: 'Stockholm Central Station', desc: 'Main train station for Arlanda Express airport train (~300 SEK) and regional trains.' },
  { lat: 59.3321, lng: 18.0910, type: 'transport', name: 'Djurgårdsbron Ferry Stop', desc: 'Hop-on ferry to Djurgården. SL card valid — free with your transport pass.' },
];

const typeLabels = {
  activity:  { label: 'Activity', color: '#1a6ea8' },
  food:      { label: 'Food & Drink', color: '#e8a020' },
  viewpoint: { label: 'Viewpoint', color: '#2a8a4a' },
  transport: { label: 'Transport', color: '#8a3aa8' },
};

places.forEach(p => {
  const info = typeLabels[p.type];
  const popup = `
    <div class="popup-title">${p.name}</div>
    <div class="popup-type" style="color:${info.color}">${info.label}</div>
    <div class="popup-desc">${p.desc}</div>
  `;
  L.marker([p.lat, p.lng], { icon: icons[p.type] })
    .addTo(map)
    .bindPopup(popup, { maxWidth: 260 });
});

// Smooth pan to map when section is in view
const mapSection = document.getElementById('map');
let mapInvalidated = false;
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !mapInvalidated) {
      map.invalidateSize();
      mapInvalidated = true;
    }
  });
}, { threshold: 0.2 });
mapObserver.observe(mapSection);
