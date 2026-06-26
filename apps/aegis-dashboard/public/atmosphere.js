/* ============================================================
   AIGENCY — atmosphere.js
   Reusable deep-space "Station Glass" backdrop:
   drifting dust clouds + twinkling stars + shooting stars + floating motes,
   with subtle parallax. Respects prefers-reduced-motion.

   USAGE:
     <script src="atmosphere.js"></script>
     <script>AigencyAtmosphere.mount();</script>   // mounts to <body>
   or
     AigencyAtmosphere.mount({ target: el, density: 1, parallax: true });

   Layers injected (z-index 0..3, content should sit at >=10):
     .aig-atmo-void     base void gradient
     .aig-atmo-nebula   drifting dust clouds (CSS keyframes)
     <canvas>           stars + shooting stars + motes (requestAnimationFrame)
     .aig-atmo-vignette vignette + grain
   ============================================================ */
(function () {
  'use strict';

  const PALETTE = {
    voidDeep:   '#05070a',
    voidBase:   '#080b10',
    teal:       '18, 165, 148',
    amber:      '224, 150, 70',
    purple:     '150, 110, 230',
    star:       '210, 224, 240',
  };

  function injectStyles() {
    if (document.getElementById('aig-atmo-styles')) return;
    const css = `
      .aig-atmo-root { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
      .aig-atmo-root.fixed { position: fixed; }
      .aig-atmo-void {
        position: absolute; inset: 0;
        background:
          radial-gradient(120% 90% at 78% -10%, rgba(${PALETTE.amber},0.10), transparent 46%),
          radial-gradient(90% 80% at 12% 8%, rgba(${PALETTE.teal},0.07), transparent 52%),
          linear-gradient(180deg, ${PALETTE.voidBase} 0%, ${PALETTE.voidDeep} 60%, #04050700 100%),
          ${PALETTE.voidDeep};
      }
      .aig-atmo-nebula {
        position: absolute; inset: -20%;
        background:
          radial-gradient(38% 30% at 70% 18%, rgba(${PALETTE.amber},0.16), transparent 60%),
          radial-gradient(32% 40% at 22% 30%, rgba(${PALETTE.teal},0.13), transparent 62%),
          radial-gradient(46% 36% at 50% 78%, rgba(${PALETTE.purple},0.10), transparent 64%),
          radial-gradient(28% 24% at 85% 62%, rgba(${PALETTE.teal},0.08), transparent 60%);
        filter: blur(36px);
        opacity: 0.9;
        will-change: transform;
        animation: aig-drift 46s ease-in-out infinite alternate;
      }
      .aig-atmo-nebula.b {
        background:
          radial-gradient(40% 34% at 30% 12%, rgba(${PALETTE.amber},0.09), transparent 60%),
          radial-gradient(34% 30% at 80% 80%, rgba(${PALETTE.purple},0.10), transparent 62%);
        animation: aig-drift2 62s ease-in-out infinite alternate;
        filter: blur(52px);
        opacity: 0.7;
      }
      .aig-atmo-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
      .aig-atmo-vignette {
        position: absolute; inset: 0;
        background:
          radial-gradient(140% 130% at 50% 35%, transparent 62%, rgba(0,0,0,0.42) 100%);
        mix-blend-mode: multiply;
      }
      .aig-atmo-grain {
        position: absolute; inset: 0; opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
      @keyframes aig-drift {
        0%   { transform: translate3d(-2%, -1%, 0) scale(1.05); }
        100% { transform: translate3d(3%, 2%, 0) scale(1.12); }
      }
      @keyframes aig-drift2 {
        0%   { transform: translate3d(2%, 1%, 0) scale(1.1); }
        100% { transform: translate3d(-3%, -2%, 0) scale(1.04); }
      }
      @media (prefers-reduced-motion: reduce) {
        .aig-atmo-nebula, .aig-atmo-nebula.b { animation: none; }
      }
    `;
    const style = document.createElement('style');
    style.id = 'aig-atmo-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function mount(opts) {
    opts = opts || {};
    injectStyles();

    const target = opts.target || document.body;
    const fixed = opts.fixed !== undefined ? opts.fixed : (target === document.body);
    const density = opts.density || 1;
    const parallax = opts.parallax !== undefined ? opts.parallax : true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (getComputedStyle(target).position === 'static' && target !== document.body) {
      target.style.position = 'relative';
    }

    const root = document.createElement('div');
    root.className = 'aig-atmo-root' + (fixed ? ' fixed' : '');

    const voidLayer = document.createElement('div');
    voidLayer.className = 'aig-atmo-void';
    const nebula = document.createElement('div');
    nebula.className = 'aig-atmo-nebula';
    const nebulaB = document.createElement('div');
    nebulaB.className = 'aig-atmo-nebula b';
    const canvas = document.createElement('canvas');
    canvas.className = 'aig-atmo-canvas';
    const grain = document.createElement('div');
    grain.className = 'aig-atmo-grain';
    const vignette = document.createElement('div');
    vignette.className = 'aig-atmo-vignette';

    root.appendChild(voidLayer);
    root.appendChild(nebula);
    root.appendChild(nebulaB);
    root.appendChild(canvas);
    root.appendChild(grain);
    root.appendChild(vignette);
    target.insertBefore(root, target.firstChild);

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [], motes = [], shootingStars = [];
    let mx = 0, my = 0, tx = 0, ty = 0;
    let nextShootingStar = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawnShootingStar() {
      const angle = Math.PI - rand(0.26, 0.79); // 150°–165°, down-left from top-right
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const length = rand(120, 200);
      // Start from top or right edge so the streak travels across visible viewport
      const fromTop = Math.random() < 0.6;
      const x = fromTop ? rand(W * 0.4, W + 80) : W + 40;
      const y = fromTop ? -40 : rand(-40, H * 0.4);
      shootingStars.push({
        x, y, cos, sin, length,
        speed: rand(0.018, 0.028), // progress per frame (~800ms–1200ms lifetime)
        progress: 0,
        headWidth: rand(1.5, 2.5),
      });
    }

    function build() {
      const rect = root.getBoundingClientRect();
      W = Math.max(rect.width, 1);
      H = Math.max(rect.height, 1);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const starCount = Math.round((W * H) / 5200 * density);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(0.5, 1.9),
          base: rand(0.35, 1.0),
          tw: rand(0.6, 2.4),
          ph: rand(0, Math.PI * 2),
          depth: rand(0.2, 1),
        });
      }

      const moteCount = Math.round((W * H) / 15000 * density);
      motes = [];
      shootingStars = [];
      nextShootingStar = rand(60, 240); // frames until first streak (~1–4s)
      const tints = [PALETTE.amber, PALETTE.teal, PALETTE.purple, PALETTE.star, PALETTE.star];
      for (let i = 0; i < moteCount; i++) {
        motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(1.0, 3.0),
          vx: rand(-0.10, 0.18),
          vy: rand(-0.06, 0.06),
          a: rand(0.12, 0.42),
          tint: tints[(Math.random() * tints.length) | 0],
          depth: rand(0.4, 1.4),
        });
      }
    }

    let t0 = performance.now();
    function frame(now) {
      const dt = Math.min((now - t0) / 16.6667, 3);
      t0 = now;
      ctx.clearRect(0, 0, W, H);

      // parallax easing
      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;

      // additive glow so stars/motes pop against the void
      ctx.globalCompositeOperation = 'lighter';

      // stars
      for (const s of stars) {
        const tw = reduced ? s.base : s.base * (0.6 + 0.4 * Math.sin(now / 1000 * s.tw + s.ph));
        const px = s.x + tx * 14 * s.depth;
        const py = s.y + ty * 14 * s.depth;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PALETTE.star}, ${tw})`;
        ctx.fill();
        if (s.r > 0.95) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${PALETTE.star}, ${tw * 0.14})`;
          ctx.fill();
        }
      }

      // drifting dust motes
      for (const m of motes) {
        if (!reduced) {
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          if (m.x < -10) m.x = W + 10; else if (m.x > W + 10) m.x = -10;
          if (m.y < -10) m.y = H + 10; else if (m.y > H + 10) m.y = -10;
        }
        const px = m.x + tx * 30 * m.depth;
        const py = m.y + ty * 30 * m.depth;
        const g = ctx.createRadialGradient(px, py, 0, px, py, m.r * 3);
        g.addColorStop(0, `rgba(${m.tint}, ${m.a})`);
        g.addColorStop(1, `rgba(${m.tint}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, m.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // shooting stars
      if (!reduced) {
        nextShootingStar -= dt;
        if (nextShootingStar <= 0) {
          spawnShootingStar();
          nextShootingStar = rand(360, 1200); // next streak in 6–20s
        }
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const sh = shootingStars[i];
        sh.progress += sh.speed * dt;
        if (sh.progress >= 1) {
          shootingStars.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - sh.progress, 3);
        const headX = sh.x + sh.cos * sh.length * eased;
        const headY = sh.y + sh.sin * sh.length * eased;
        const opacity = sh.progress < 0.15
          ? sh.progress / 0.15
          : 1 - (sh.progress - 0.15) / 0.85;
        const tailX = headX - sh.cos * sh.length;
        const tailY = headY - sh.sin * sh.length;
        const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
        grad.addColorStop(0, `rgba(${PALETTE.star}, ${opacity * 0.9})`);
        grad.addColorStop(0.4, `rgba(${PALETTE.star}, ${opacity * 0.35})`);
        grad.addColorStop(1, `rgba(${PALETTE.star}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = sh.headWidth * (0.6 + 0.4 * opacity);
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(frame);
    }

    let raf = null;
    function start() { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    if (parallax && !reduced) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => build());
      ro.observe(root);
    } else {
      window.addEventListener('resize', build);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    build();
    start();

    return {
      destroy() { stop(); if (ro) ro.disconnect(); root.remove(); },
      rebuild: build,
    };
  }

  window.AigencyAtmosphere = { mount };
})();
