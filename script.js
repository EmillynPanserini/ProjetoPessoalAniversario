'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// O botão mantém distância do ponteiro e continua dentro da tela, inclusive no celular.
const noButton = document.querySelector('#no-button');
if (noButton) {
  const yesButton = document.querySelector('#yes-button');
  const hint = document.querySelector('#answer-hint');
  let escapes = 0;

  function escapeFrom(pointerX, pointerY) {
    const width = noButton.offsetWidth;
    const height = noButton.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    const maxX = Math.max(margin, viewportWidth - width - margin);
    const maxY = Math.max(margin, viewportHeight - height - margin);
    const yes = yesButton.getBoundingClientRect();
    const current = noButton.getBoundingClientRect();
    let best = null;
    let bestScore = -Infinity;

    // Escolhe a melhor de várias posições; nunca cobre o botão Sim.
    for (let i = 0; i < 45; i += 1) {
      const x = margin + Math.random() * (maxX - margin);
      const y = margin + Math.random() * (maxY - margin);
      if (x < yes.right + 14 && x + width > yes.left - 14 && y < yes.bottom + 14 && y + height > yes.top - 14) continue;
      const pointerDistance = Math.hypot(x + width / 2 - pointerX, y + height / 2 - pointerY);
      const movement = Math.hypot(x - current.left, y - current.top);
      const score = pointerDistance + Math.min(movement, 150);
      if (score > bestScore) { best = { x, y }; bestScore = score; }
    }

    if (!best) best = { x: maxX, y: maxY };
    noButton.classList.add('is-running');
    noButton.style.left = `${best.x}px`;
    noButton.style.top = `${best.y}px`;
    escapes += 1;
    if (escapes === 1) hint.textContent = 'Ih, o “Não” é tímido. Tenta o “Sim”!';
    if (escapes === 5) hint.textContent = 'Ele pode fugir. A verdade, não. ☺';
  }

  // Um mouse próximo já faz o botão fugir antes que o clique aconteça.
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = noButton.getBoundingClientRect();
    const nearX = event.clientX >= rect.left - 38 && event.clientX <= rect.right + 38;
    const nearY = event.clientY >= rect.top - 38 && event.clientY <= rect.bottom + 38;
    if (nearX && nearY) escapeFrom(event.clientX, event.clientY);
  });
  noButton.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    escapeFrom(event.clientX, event.clientY);
  });
  noButton.addEventListener('click', (event) => {
    event.preventDefault();
    const rect = noButton.getBoundingClientRect();
    escapeFrom(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  noButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = noButton.getBoundingClientRect();
      escapeFrom(rect.left, rect.top);
      yesButton.focus({ preventScroll: true });
    }
  });
  window.addEventListener('resize', () => {
    noButton.classList.remove('is-running');
    noButton.style.removeProperty('left');
    noButton.style.removeProperty('top');
  });
}

// Um cilindro de fatias compõe o bolo em 3D; a etiqueta gira com ele.
const cakeBody = document.querySelector('#cake-body');
if (cakeBody) {
  const slices = document.createDocumentFragment();
  for (let i = 0; i < 40; i += 1) {
    const slice = document.createElement('div');
    slice.className = 'cake-slice';
    slice.style.transform = `rotateY(${i * 9}deg) translateZ(108px)`;
    slices.appendChild(slice);
  }
  cakeBody.prepend(slices);
}

// Fogos desenhados localmente, sem bibliotecas, áudio ou chamadas externas.
const canvas = document.querySelector('#fireworks');
if (canvas) {
  const context = canvas.getContext('2d');
  const motionToggle = document.querySelector('#motion-toggle');
  const particles = [];
  const colors = ['#eed3a0', '#e9ad70', '#b8d69d', '#f6f4e9'];
  let width = 0;
  let height = 0;
  let frameId = null;
  let lastTime = 0;
  let nextBurst = 0;
  let paused = reducedMotion.matches;

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function burst(x, y) {
    const count = width < 600 ? 38 : 58;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 28 + Math.random() * 66;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color, size: 1 + Math.random() });
    }
  }

  function draw(time) {
    frameId = null;
    if (!context || paused || document.hidden) return;
    const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.04);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    if (time >= nextBurst) {
      // As explosões ficam nas laterais, preservando a leitura do título.
      const x = Math.random() < 0.5 ? width * (0.04 + Math.random() * 0.22) : width * (0.74 + Math.random() * 0.22);
      burst(x, height * (0.12 + Math.random() * 0.55));
      nextBurst = time + 950 + Math.random() * 650;
    }
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 19 * dt;
      p.vx *= Math.pow(0.7, dt);
      p.life -= dt * 0.46;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      context.globalAlpha = p.life * 0.75;
      context.fillStyle = p.color;
      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    frameId = requestAnimationFrame(draw);
  }

  function syncMotion() {
    document.body.classList.toggle('animations-paused', paused);
    motionToggle.textContent = paused ? 'Ativar animações' : 'Pausar animações';
    motionToggle.setAttribute('aria-pressed', String(paused));
    if (frameId !== null) { cancelAnimationFrame(frameId); frameId = null; }
    if (paused) context?.clearRect(0, 0, width, height);
    if (!paused && !document.hidden && context) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(draw);
    }
  }

  motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  syncMotion();
}
