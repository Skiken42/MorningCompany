// Reel hero - vidéos en fond
function buildReel() {
  const conn = navigator.connection;
  const slow = conn && (conn.saveData || ['slow-2g','2g','3g'].includes(conn.effectiveType));
  const lines = [
    {id:'bgTrack1', order:[1,2,3,4,5,6,7,8,9]},
    {id:'bgTrack2', order:[4,5,6,7,8,9,1,2,3]},
    {id:'bgTrack3', order:[7,8,9,1,2,3,4,5,6]},
  ];
  (slow ? [lines[0]] : lines).forEach(line => {
    const track = document.getElementById(line.id);
    if (!track) return;
    const order = slow ? line.order.slice(0,3) : line.order;
    [...order, ...order].forEach((n, i) => {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.autoplay = true;
      v.preload = i < 3 ? 'auto' : 'none';
      v.src = 'videos/reels/reel' + n + '.mp4';
      track.appendChild(v);
    });
  });
}

// Nav scroll + burger
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollHint')?.classList.toggle('hidden', window.scrollY > 80);
});
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Ajouter les classes sur les svc pour fond blanc
document.querySelectorAll('.svc-light').forEach(el => {
  el.style.background = 'var(--white)';
  el.style.borderColor = '#e5e5e5';
});

buildReel();
