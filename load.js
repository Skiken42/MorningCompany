async function loadPartials() {
  const header = await fetch('header.html').then(r => r.text());
  const footer = await fetch('footer.html').then(r => r.text());

  document.getElementById('header').innerHTML = header;
  document.getElementById('footer').innerHTML = footer;
}

document.addEventListener("DOMContentLoaded", loadPartials);

function toggleMenu(){document.querySelector('.nav-links').classList.toggle('active');document.querySelector('.nav-burger').classList.toggle('active');}