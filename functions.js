/* ── CONFIG ─────────────────────────────────────────── */
const portfolio = [
  { id:'paladium',     name:'Paladium',        sector:'Gaming',     views:'592k', bg:'linear-gradient(160deg,#0d2b1a,#1a4d2e)', stats:[{n:'592k',l:'vues'},{n:'En cours',l:'statut'}],  playlistUrl:'' },
  { id:'nationsglory', name:'NationsGlory',    sector:'Gaming',     views:'312k', bg:'linear-gradient(160deg,#0d1b2b,#1a2d4d)', stats:[{n:'312k',l:'vues'},{n:'En cours',l:'statut'}],  playlistUrl:'https://www.youtube.com/watch?v=nqMRZmwl0QE&list=PL3CdIvZmviURuCTDnUMGKYgmgR4g9nV1Y' },
  { id:'legendaires',  name:'Les Légendaires', sector:'Gaming',     views:'647k', bg:'linear-gradient(160deg,#2b0d15,#4d1a24)', stats:[{n:'647k',l:'vues'},{n:'Terminé',l:'statut'}],  playlistUrl:'' },
  { id:'hypenetwork',  name:'HypeNetwork',     sector:'Gaming',     views:'706k', bg:'linear-gradient(160deg,#2b1a0d,#4d3318)', stats:[{n:'706k',l:'vues'},{n:'Terminé',l:'statut'}],  playlistUrl:'' },
  { id:'badlands',     name:'BadLands',        sector:'Gaming',     views:'33k',  bg:'linear-gradient(160deg,#1a0d2b,#2e1a4d)', stats:[{n:'33k', l:'vues'},{n:'Terminé',l:'statut'}],  playlistUrl:'' },
  { id:'macoloc',      name:'Macoloc',         sector:'Immobilier', views:'43k',  bg:'linear-gradient(160deg,#0d2b2b,#1a4d4d)', stats:[{n:'43k', l:'vues'},{n:'Terminé',l:'statut'}],  playlistUrl:'' },
];
const nbAvis = 4;
const faqData = [
  { q:'Combien de temps pour voir des résultats ?',           a:"En général, les premiers résultats significatifs apparaissent en moins de 4 semaines. C'est pourquoi nous recommandons de démarrer sur au moins 3 mois pour profiter pleinement de l'effet composé que proposent les réseaux sociaux." },
  { q:'Est-ce que je dois apparaître sur la vidéo ?',         a:"Non ! Enfin, comme vous le souhaitez. Si vous voulez créer un lien fort avec votre audience en montrant votre visage, on peut tout à fait le faire. Dans tous les cas, on se charge de tout : script, production, montage et publication." },
  { q:'Comment se passe le suivi au quotidien ?',            a:'Vous avez un espace Discord dédié et un espace client en ligne. On livre, vous validez, on publie. Visibilité totale sur chaque action en temps réel.' },
  { q:'Puis-je arrêter à tout moment ?',                     a:'Nos contrats sont mensuels sans engagement longue durée. Vous pouvez arrêter avec un préavis de 30 jours, sans frais ni justification.' },
  { q:'Travaillez-vous avec tous les secteurs ?',            a:"On travaille principalement avec le gaming, l'immobilier, la formation et la tech. Mais on s'adapte selon les projets." },
  { q:"Que se passe-t-il après le setup ?",                  a:'Après la mise en place (1 à 2 semaines), la production démarre immédiatement. Un reporting mensuel complet vous est envoyé en fin de mois.' },
];

/* ── HERO VIDÉOS ────────────────────────────────────── */
function buildReel() {
  const lines = [
    { id: 'bgTrack1', order: [1,2,3,4,5,6,1,2,3,4,5,6] },
    { id: 'bgTrack2', order: [4,5,6,1,2,3,4,5,6,1,2,3] },
    { id: 'bgTrack3', order: [2,4,6,1,3,5,2,4,6,1,3,5] },
  ];
  lines.forEach(line => {
    const track = document.getElementById(line.id);
    if (!track) return;
    line.order.forEach(n => {
      const video = document.createElement('video');
      video.src = 'videos/reels/reel' + n + '.mp4';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      track.appendChild(video);
    });
  });
}

/* ── PORTFOLIO ──────────────────────────────────────── */
function buildPortfolio() {
  const grid = document.getElementById('portGrid');
  portfolio.forEach(c => {
    const el = document.createElement('div');
    el.className = 'port-card';
    el.onclick = () => openPopup(c.id);
    el.innerHTML =
      '<img class="port-thumb" src="images/presse/cover_' + c.id + '.jpg" alt="' + c.name + '" loading="lazy" onerror="this.style.display=\'none\'">' +
      '<div class="port-card-cursor"><div class="port-card-cursor-circle">Voir</div></div>' +
      '<div class="port-overlay"><div class="port-client-name">' + c.name + ' - ' + c.sector + '</div><div class="port-stat">' + c.views + '</div><div class="port-label">vues générées</div></div>';
    grid.appendChild(el);
  });
}

/* ── YOUTUBE ────────────────────────────────────────── */
function extractPlaylistId(url) {
  if (!url) return null;
  const m = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}
async function fetchPlaylistVideos(playlistId) {
  // Utilise le RSS feed YouTube via allorigins (proxy CORS gratuit)
  try {
    const feed = 'https://www.youtube.com/feeds/videos.xml?playlist_id=' + playlistId;
    const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(feed);
    const res = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('proxy failed');
    const json = await res.json();
    const xml = new DOMParser().parseFromString(json.contents, 'text/xml');
    const entries = [...xml.querySelectorAll('entry')];
    
    return entries.map(e => {
      // yt:videoId est dans le namespace YouTube
      const videoId = e.querySelector('videoId')?.textContent
        || e.getElementsByTagName('yt:videoId')[0]?.textContent
        || (e.querySelector('link')?.getAttribute('href') || '').match(/v=([^&]+)/)?.[1]
        || '';
      const title = e.querySelector('title')?.textContent || '';
      return { id: videoId, title };
    }).filter(v => v.id.length > 5);
  } catch(e) {
    console.warn('RSS fetch failed:', e.message);
    return [];
  }
}

const clientVideoIds = {
  // Ajoute ici les IDs manuellement si tu veux bypasser le RSS
  // nationsglory: ['ID1', 'ID2'],
};

/* ── POPUP ──────────────────────────────────────────── */
async function openPopup(id) {
  const c = portfolio.find(x => x.id === id);
  if (!c) return;
  document.getElementById('popupName').textContent = c.name;
  document.getElementById('popupMeta').textContent = c.sector;
  document.getElementById('popupStats').innerHTML = c.stats.map(s =>
    '<div class="popup-stat"><div class="popup-stat-n">' + s.n + '</div><div class="popup-stat-l">' + s.l + '</div></div>'
  ).join('');
  const container = document.getElementById('popupVids');
  container.className = 'popup-vids-grid';
  container.innerHTML = '<div class="popup-loading">Chargement...</div>';
  document.getElementById('popup').classList.add('open');
  document.body.style.overflow = 'hidden';
  const playlistId = extractPlaylistId(c.playlistUrl);
  if (!playlistId) {
    container.innerHTML = '<div class="popup-no-vids"><p>Playlist YouTube bientôt disponible.</p></div>';
    return;
  }
  let videos = await fetchPlaylistVideos(playlistId);
  if (!videos.length) {
    const ytLink = playlistId ? '<a href="https://www.youtube.com/playlist?list=' + playlistId + '" target="_blank" style="color:var(--red)">Voir sur YouTube</a>' : '';
    container.innerHTML = '<div class="popup-no-vids"><p>Vidéos bientôt disponibles. ' + ytLink + '</p></div>';
    return;
  }
  document.getElementById('popupMeta').textContent = c.sector + ' - ' + videos.length + ' vidéos';
  container.innerHTML = '';
  videos.forEach(v => {
    const card = document.createElement('div');
    card.className = 'popup-vid-card';
    card.innerHTML =
      '<img class="popup-vid-thumb" src="https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg" onerror="this.src=\'https://img.youtube.com/vi/' + v.id + '/default.jpg\'" alt="' + v.title + '">' +
      '<div class="popup-vid-card-ov"></div><div class="popup-vid-play"></div>' +
      '<iframe class="popup-vid-iframe" src="" data-src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    card.addEventListener('click', () => {
      container.querySelectorAll('.popup-vid-card.playing').forEach(x => { x.classList.remove('playing'); x.querySelector('.popup-vid-iframe').src = ''; });
      card.querySelector('.popup-vid-iframe').src = card.querySelector('.popup-vid-iframe').dataset.src;
      card.classList.add('playing');
    });
    container.appendChild(card);
  });
}
function closePopup() {
  document.getElementById('popup').classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.popup-vid-iframe').forEach(f => f.src = '');
  document.querySelectorAll('.popup-vid-card').forEach(c => c.classList.remove('playing'));
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
document.getElementById('popup').addEventListener('click', function(e) { if (e.target === this) closePopup(); });

/* ── AVIS ───────────────────────────────────────────── */
function buildAvis() {
  const track = document.getElementById('avisTrack');
  const srcs = Array.from({length: nbAvis}, (_, i) => 'images/avis/avis' + (i+1) + '.png');
  [...srcs, ...srcs].forEach(src => {
    const img = document.createElement('img');
    img.className = 'avis-img';
    img.src = src;
    img.alt = 'Avis client';
    img.loading = 'lazy';
    track.appendChild(img);
  });
}

/* ── FAQ ────────────────────────────────────────────── */
function buildFaq() {
  const grid = document.getElementById('faqGrid');
  faqData.forEach(f => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = '<div class="faq-q" onclick="this.parentElement.classList.toggle(\'open\')">' + f.q + ' <span class="faq-q-chevron">▼</span></div><div class="faq-a">' + f.a + '</div>';
    grid.appendChild(el);
  });
}

/* ── NAV ────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  const hint = document.getElementById('scrollHint');
  if (hint) hint.classList.toggle('hidden', window.scrollY > 80);
});
function toggleNav() { document.getElementById('navLinks').classList.toggle('open'); }

/* INIT */
buildReel();
buildPortfolio();
buildAvis();
buildFaq();