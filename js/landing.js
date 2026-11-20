import { SCREENSAVERS } from './registry.js?v=15';
import { ICONS } from '../savers/mac-os-9/icons.js?v=3';
import { DESKTOP_PATTERNS } from '../savers/mac-os-9/wallpapers.js?v=3';

function esc(value) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
}

function formatClock(now) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let hrs = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12 || 12;
  return `${days[now.getDay()]} ${hrs}:${mins} ${ampm}`;
}

function fitDiorama() {
  const screen = document.querySelector('.monitor-screen');
  const dio = document.getElementById('diorama');
  if (!screen || !dio) return;
  dio.style.transform = `scale(${screen.clientWidth / 640})`;
}

function paintDiorama() {
  document.querySelectorAll('[data-dio-icon]').forEach((el) => {
    const icon = ICONS[el.dataset.dioIcon];
    if (icon) el.innerHTML = icon;
  });

  const desk = document.getElementById('dio-desk');
  const pat = DESKTOP_PATTERNS[0];
  if (desk && pat) {
    desk.style.backgroundColor = pat.backgroundColor;
    desk.style.backgroundImage = pat.backgroundImage;
    desk.style.backgroundSize = pat.backgroundSize;
  }
}

function renderShelf() {
  const shelf = document.getElementById('shelf');
  if (!shelf) return;
  shelf.replaceChildren();

  for (const saver of SCREENSAVERS) {
    const available = saver.status === 'available';
    const card = document.createElement(available ? 'a' : 'article');
    card.className = `shelf-card ${available ? 'ready' : 'soon'}`;
    if (available) card.href = `watch.html?saver=${encodeURIComponent(saver.id)}`;

    const badge = available ? 'Play' : 'Planned';
    card.innerHTML = `
      <div class="shelf-thumb ${esc(saver.thumbClass)}"><span class="shelf-badge">${badge}</span></div>
      <div class="shelf-body">
        <div class="shelf-era">${esc(saver.era)}</div>
        <div class="shelf-name">${esc(saver.name)}</div>
        <div class="shelf-desc">${esc(saver.description)}</div>
      </div>
    `;
    shelf.appendChild(card);
  }
}

function fillHero() {
  const featured = SCREENSAVERS.find((saver) => saver.status === 'available');
  if (!featured) return;
  const era = document.getElementById('hero-era');
  const name = document.getElementById('hero-name');
  const desc = document.getElementById('hero-desc');
  const play = document.getElementById('hero-play');
  if (era) era.textContent = featured.era;
  if (name) name.textContent = featured.name;
  if (desc) desc.textContent = featured.description;
  if (play) play.href = `watch.html?saver=${encodeURIComponent(featured.id)}`;
}

function tickClock() {
  const el = document.getElementById('diorama-clock');
  if (el) el.textContent = formatClock(new Date());
}

fillHero();
renderShelf();
paintDiorama();
fitDiorama();
tickClock();
window.addEventListener('resize', fitDiorama);
setInterval(tickClock, 1000);

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.metaKey || event.ctrlKey || event.altKey) return;
  if (document.activeElement && document.activeElement !== document.body) return;
  const featured = SCREENSAVERS.find((saver) => saver.status === 'available');
  if (!featured) return;
  window.location.href = `watch.html?saver=${encodeURIComponent(featured.id)}`;
});
