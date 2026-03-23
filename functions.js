// Reel hero - vidéos en fond
function buildReel() {
  const conn = navigator.connection;
  const slow = conn && (conn.saveData || ['slow-2g','2g','3g'].includes(conn.effectiveType));
  const lines = [
    {id:'bgTrack1', order:[1,2,3,4,5]},
    {id:'bgTrack2', order:[5,4,3,2,1]},
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

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollHint')?.classList.toggle('hidden', window.scrollY > 80);
});

function toggleNav() {
  document.getElementById('navLinks')?.classList.toggle('open');
}



document.querySelectorAll('.port-card').forEach(card => {
  card.addEventListener('click', () => {
    window.open(card.dataset.url, '_blank');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  buildReel();
});
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      if (!video.src) video.src = video.dataset.src;
    }
  });
});