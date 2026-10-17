// Bảng vẽ nguyên liệu. Nét vẽ được lưu dạng số nguyên trên lưới 200x200
// để nén gọn vào link: mỗi nét = [màu, cỡ bút, x0, y0, x1, y1, ...].
(function () {
  const GRID = 200;
  const COLORS = ['#4A3B36', '#E63946', '#F4A259', '#FFD166', '#7BC47F', '#4E9BD6', '#B57BB3', '#F59A9A', '#9C6B33', '#FFFFFF'];
  const COLOR_NAMES = ['Nâu đậm', 'Đỏ', 'Cam', 'Vàng', 'Xanh lá', 'Xanh dương', 'Tím', 'Hồng', 'Nâu', 'Trắng'];
  const SIZES = [3, 6, 12, 22];
  const MAX_STROKES = 150;
  const MAX_POINTS = 2500;

  // Rút gọn nét vẽ (Ramer–Douglas–Peucker) để link ngắn hơn.
  function simplify(pts, eps) {
    if (pts.length <= 2) return pts.slice();
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    let maxD = 0, idx = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD <= eps) return [pts[0], pts[pts.length - 1]];
    return simplify(pts.slice(0, idx + 1), eps).slice(0, -1).concat(simplify(pts.slice(idx), eps));
  }

  function encodeStroke(s) {
    const pts = simplify(s.pts, 0.9);
    const out = [s.c, s.w];
    let lx = null, ly = null;
    pts.forEach(([x, y]) => {
      const rx = Math.round(x), ry = Math.round(y);
      if (rx === lx && ry === ly) return;
      out.push(rx, ry); lx = rx; ly = ry;
    });
    return out;
  }

  function decodeStroke(a) {
    const pts = [];
    for (let i = 2; i + 1 < a.length; i += 2) pts.push([a[i], a[i + 1]]);
    return { c: a[0], w: a[1], pts };
  }

  // Kiểm tra dữ liệu nét vẽ đến từ link (không tin tưởng đầu vào).
  function validate(raw) {
    if (!Array.isArray(raw)) return null;
    const out = [];
    let total = 0;
    for (const s of raw.slice(0, MAX_STROKES)) {
      if (!Array.isArray(s) || s.length < 4) continue;
      const c = s[0] | 0, w = s[1] | 0;
      if (c < 0 || c >= COLORS.length || w < 0 || w >= SIZES.length) continue;
      const a = [c, w];
      for (let i = 2; i + 1 < s.length && total < MAX_POINTS; i += 2, total++) {
        const x = Number(s[i]), y = Number(s[i + 1]);
        if (!isFinite(x) || !isFinite(y)) break;
        a.push(Math.max(0, Math.min(GRID, Math.round(x))), Math.max(0, Math.min(GRID, Math.round(y))));
      }
      if (a.length >= 4) out.push(a);
    }
    return out.length ? out : null;
  }

  function pathD(pts) {
    if (pts.length === 1) return null;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    if (pts.length === 2) return d + ` L${pts[1][0]} ${pts[1][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ` Q${pts[i][0]} ${pts[i][1]} ${mx} ${my}`;
    }
    const l = pts[pts.length - 1];
    return d + ` L${l[0]} ${l[1]}`;
  }

  // Trả về nội dung SVG (khung 0 0 200 200) từ nét vẽ đã kiểm tra.
  function render(strokes) {
    return (strokes || []).map((a) => {
      const s = decodeStroke(a);
      const col = COLORS[s.c], w = SIZES[s.w];
      const d = pathD(s.pts);
      if (!d) return `<circle cx="${s.pts[0][0]}" cy="${s.pts[0][1]}" r="${w / 2}" fill="${col}"/>`;
      return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join('');
  }

  function drawOn(ctx, s, scale) {
    ctx.strokeStyle = ctx.fillStyle = COLORS[s.c];
    ctx.lineWidth = SIZES[s.w] * scale;
    ctx.lineCap = ctx.lineJoin = 'round';
    const p = s.pts;
    if (p.length === 1) {
      ctx.beginPath(); ctx.arc(p[0][0] * scale, p[0][1] * scale, (SIZES[s.w] * scale) / 2, 0, Math.PI * 2); ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(p[0][0] * scale, p[0][1] * scale);
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
      ctx.quadraticCurveTo(p[i][0] * scale, p[i][1] * scale, mx * scale, my * scale);
    }
    const l = p[p.length - 1];
    ctx.lineTo(l[0] * scale, l[1] * scale);
    ctx.stroke();
  }

  function mount(root) {
    let strokes = [];
    let current = null;
    let color = 0, size = 1;

    root.innerHTML = '';
    root.classList.add('wb');

    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'wb-canvas-wrap';
    const canvas = document.createElement('canvas');
    canvas.className = 'wb-canvas';
    canvas.setAttribute('aria-label', L.t('wb.canvas'));
    canvasWrap.append(canvas);

    const tools = document.createElement('div');
    tools.className = 'wb-tools';

    const colorRow = document.createElement('div');
    colorRow.className = 'wb-colors';
    COLORS.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wb-color';
      b.style.setProperty('--c', c);
      b.title = L.pen(i, COLOR_NAMES[i]);
      b.setAttribute('aria-label', L.t('wb.pen', { c: L.pen(i, COLOR_NAMES[i]) }));
      b.onclick = () => { color = i; sync(); };
      colorRow.append(b);
    });

    const sizeRow = document.createElement('div');
    sizeRow.className = 'wb-sizes';
    SIZES.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wb-size';
      b.setAttribute('aria-label', L.t('wb.size', { n: i + 1 }));
      b.innerHTML = `<span style="width:${Math.max(4, s * 0.9)}px;height:${Math.max(4, s * 0.9)}px"></span>`;
      b.onclick = () => { size = i; sync(); };
      sizeRow.append(b);
    });

    const actions = document.createElement('div');
    actions.className = 'wb-actions';
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button'; undoBtn.className = 'btn btn-ghost btn-sm'; undoBtn.textContent = L.t('wb.undo');
    undoBtn.onclick = () => { strokes.pop(); redraw(); };
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button'; clearBtn.className = 'btn btn-ghost btn-sm'; clearBtn.textContent = L.t('wb.clear');
    clearBtn.onclick = () => { strokes = []; redraw(); };
    actions.append(undoBtn, clearBtn);

    tools.append(colorRow, sizeRow, actions);
    root.append(canvasWrap, tools);

    function sync() {
      [...colorRow.children].forEach((b, i) => b.classList.toggle('on', i === color));
      [...sizeRow.children].forEach((b, i) => {
        b.classList.toggle('on', i === size);
        b.style.setProperty('--c', COLORS[color] === '#FFFFFF' ? '#D8C8BC' : COLORS[color]);
      });
    }

    let scale = 1;
    function resize() {
      const css = canvasWrap.clientWidth || 300;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(css * dpr);
      canvas.height = Math.round(css * dpr);
      canvas.style.height = css + 'px';
      scale = canvas.width / GRID;
      redraw();
    }

    function redraw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.forEach((s) => drawOn(ctx, s, scale));
      if (current) drawOn(ctx, current, scale);
      undoBtn.disabled = clearBtn.disabled = !strokes.length;
    }

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return [
        Math.max(0, Math.min(GRID, ((e.clientX - r.left) / r.width) * GRID)),
        Math.max(0, Math.min(GRID, ((e.clientY - r.top) / r.height) * GRID)),
      ];
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (strokes.length >= MAX_STROKES) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      current = { c: color, w: size, pts: [pos(e)] };
      redraw();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!current) return;
      const p = pos(e);
      const l = current.pts[current.pts.length - 1];
      if (Math.hypot(p[0] - l[0], p[1] - l[1]) < 0.8) return;
      current.pts.push(p);
      redraw();
    });
    const end = () => {
      if (!current) return;
      strokes.push(current);
      current = null;
      redraw();
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    const ro = new ResizeObserver(resize);
    ro.observe(canvasWrap);
    sync();
    resize();

    return {
      isEmpty: () => !strokes.length,
      getStrokes: () => strokes.map(encodeStroke),
      load: (enc) => { strokes = (enc || []).map(decodeStroke); redraw(); },
      destroy: () => ro.disconnect(),
    };
  }

  window.Whiteboard = { mount, render, validate, GRID };
})();
