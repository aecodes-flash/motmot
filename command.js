/* ── FALLING PETALS ── */
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');
let W, H, petals = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

const COLORS = ['#e8546a','#f7c5ce','#c9a96e','#f4a0b0','#f9d4db'];

function rand(a, b) { return a + Math.random() * (b - a); }

class Petal {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = rand(0, W);
    this.y = init ? rand(-H, 0) : -20;
    this.r = rand(5, 12);
    this.vx = rand(-0.6, 0.6);
    this.vy = rand(0.6, 1.6);
    this.rot = rand(0, Math.PI * 2);
    this.drot = rand(-0.03, 0.03);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = rand(0.4, 0.85);
    this.wobble = rand(0, Math.PI * 2);
    this.wobbleSpeed = rand(0.02, 0.06);
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * 0.5;
    this.y += this.vy;
    this.rot += this.drot;
    if (this.y > H + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    const s = this.r;
    ctx.moveTo(0, s * .4);
    ctx.bezierCurveTo(-s, -s * .2, -s * 1.2, s * .6, 0, s * 1.3);
    ctx.bezierCurveTo(s * 1.2, s * .6, s, -s * .2, 0, s * .4);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function initPetals() {
  resize();
  petals = [];
  for (let i = 0; i < 55; i++) petals.push(new Petal());
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
}

/* ── LIVE TIMER ── */
const START = new Date(2025, 1, 6, 22, 0, 0);

function updateTimer() {
  const now = new Date();
  const diff = now - START;

  if (diff < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  document.getElementById('days').textContent = String(d).padStart(2, '0');
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}

/* ── INITIALIZE EVERYTHING AFTER PAGE LOADS ── */
window.addEventListener('load', () => {
  // Start petals
  initPetals();
  loop();
  window.addEventListener('resize', resize);

  // Start timer
  updateTimer();
  setInterval(updateTimer, 1000);

  // Scroll reveal for reason cards
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reason-card').forEach(c => observer.observe(c));
});