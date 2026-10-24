// Các hàm dùng chung cho màn hình soạn và màn hình nấu.
(function () {
  // Tạo phần tử DOM. Chữ của người dùng luôn được chèn dạng text (an toàn).
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v; // chỉ dùng cho SVG do chính app tạo ra
      else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((c) => {
      if (c == null || c === false) return;
      el.append(c instanceof Node ? c : String(c));
    });
    return el;
  }

  const UI = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    share: '<path d="M12 15V4M7 9l5-5 5 5"/><path d="M5 13v6h14v-6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
  };
  function ui(name) {
    return `<svg class="ui" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${UI[name]}</svg>`;
  }

  // Hình của một nguyên liệu: icon có sẵn hoặc hình vẽ tay.
  const UNKNOWN = `<g fill="none" stroke="#4A3B36" stroke-width="2.5" stroke-linecap="round"><circle cx="32" cy="32" r="22" fill="#F3E6DA"/><path d="M26 26a6 6 0 1 1 8 5.6c-1.4.6-2 1.6-2 3.4M32 42v.5"/></g>`;
  function graphic(ing) {
    if (ing && ing.w) return { vb: '0 0 200 200', inner: Whiteboard.render(ing.w) };
    const ic = ing && Icons.list[ing.k];
    if (ic) {
      return { vb: '0 0 64 64', inner: `<g fill="none" stroke="${Icons.OUTLINE}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${ic.body}</g>` };
    }
    return { vb: '0 0 64 64', inner: UNKNOWN };
  }
  function ingSVG(ing, cls = '') {
    const g = graphic(ing);
    return `<svg class="ing-icon ${ing && ing.w ? 'drawn' : ''} ${cls}" viewBox="${g.vb}" aria-hidden="true">${g.inner}</svg>`;
  }

  function str(v, max) {
    return typeof v === 'string' ? v.slice(0, max).trim() : '';
  }

  // Làm sạch công thức đọc từ link: giới hạn độ dài, chỉ giữ giá trị hợp lệ.
  function sanitize(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Không đọc được công thức');
    const r = {
      t: str(raw.t, 80) || L.t('recipe.defaultTitle'),
      to: str(raw.to, 40),
      f: str(raw.f, 40),
      m: str(raw.m, 600),
      e: str(raw.e, 600),
      c: Chef.sanitize(raw.c),
      i: [],
      st: [],
    };
    (Array.isArray(raw.i) ? raw.i : []).slice(0, 40).forEach((x) => {
      if (!x || typeof x !== 'object') return;
      const ing = { n: str(x.n, 40), q: str(x.q, 30), s: str(x.s, 120) };
      if (typeof x.k === 'string' && Icons.list[x.k]) ing.k = x.k;
      // Định lượng: số + đơn vị. Link cũ ghi chữ (VD "2 quả") thì cố đọc ra số và đơn vị.
      if (typeof x.u === 'string' && L.UNITS.includes(x.u)) ing.u = x.u;
      const a = Number(x.a);
      if (isFinite(a) && a > 0) ing.a = Math.min(100000, Math.round(a * 100) / 100);
      if (!ing.u && ing.q) {
        const m = ing.q.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
        const u = m && L.unitFromText(m[2]);
        if (u) { ing.a = Number(m[1].replace(',', '.')); ing.u = u; ing.q = ''; }
      }
      const w = Whiteboard.validate(x.w);
      if (w) ing.w = w;
      // Tên mặc định của icon để trống, khi hiển thị sẽ lấy theo ngôn ngữ người xem.
      if (ing.k && L.iconNames(ing.k).includes(ing.n)) ing.n = '';
      r.i.push(ing);
    });
    // Vị trí gốc của bước trong link → vị trí sau khi lọc (để liên kết giữa các bước vẫn đúng).
    const idxMap = new Map();
    (Array.isArray(raw.st) ? raw.st : []).slice(0, 50).forEach((x, origIdx) => {
      if (!x || typeof x !== 'object') return;
      const S = Kitchen.STATIONS[x.s];
      if (!S || !Object.prototype.hasOwnProperty.call(Kitchen.STATIONS, x.s)) return;
      const step = { s: x.s, a: Object.prototype.hasOwnProperty.call(S.actions, x.a) ? x.a : '' };
      step.g = [...new Set((Array.isArray(x.g) ? x.g : []).map((n) => n | 0))].filter((n) => n >= 0 && n < r.i.length);
      // Mức lửa chỉ áp dụng cho dụng cụ đặt trên bếp ga (chảo, nồi, xửng hấp, ấm).
      step.h = S.stove ? Math.max(0, Math.min(3, x.h | 0)) : 0;
      const t = Number(x.t);
      step.t = isFinite(t) && t > 0 ? Math.min(600, Math.round(t * 2) / 2) : 0;
      // Nhiệt độ (°C) cho lò nướng, nồi chiên không dầu.
      const d = Math.round(Number(x.d));
      step.d = S.temp && isFinite(d) && d >= 30 ? Math.min(300, d) : 0;
      step.n = str(x.n, 400);
      // Thành phẩm của các bước trước dùng trong bước này (chỉ được trỏ về bước đứng trước).
      step.p = [...new Set((Array.isArray(x.p) ? x.p : []).map((n) => idxMap.get(n | 0)))]
        .filter((n) => Number.isInteger(n) && n < r.st.length);
      step.o = str(x.o, 40);
      idxMap.set(origIdx, r.st.length);
      r.st.push(step);
    });
    // Dụng cụ trên bếp (link cũ không có thì dùng bộ mặc định), luôn gồm dụng cụ dùng trong các bước.
    r.k = Kitchen.normalize(raw.k, r.st);
    return r;
  }

  function actionLabel(step) {
    if (!Kitchen.STATIONS[step.s]) return '';
    return L.action(step.a, step.s) || L.t('action.use', { station: L.station(step.s).toLowerCase() });
  }

  function ingName(ing) {
    return (ing && ing.n) || (ing && ing.k ? L.icon(ing.k) : L.t('ing.default'));
  }

  // VD: "200g", "1,5 muỗng canh", "2 cloves", "vừa đủ". Không có số và đơn vị thì dùng chữ cũ (nếu có).
  const COMPACT = ['g', 'kg', 'ml', 'l'];
  function amountLabel(ing) {
    if (!ing) return '';
    if (ing.u === 'vua') return L.unit('vua');
    if (ing.a && ing.u) {
      const num = ing.a.toLocaleString(L.lang === 'vi' ? 'vi-VN' : 'en-US', { maximumFractionDigits: 2 });
      const u = L.unit(ing.u, ing.a);
      return COMPACT.includes(ing.u) && !(ing.u === 'l' && L.lang === 'vi') ? num + u : num + ' ' + u;
    }
    if (ing.a) return String(ing.a);
    return ing.q || '';
  }

  function stepIngredients(step, ings) {
    return (step.g || []).map((n) => ings[n]).filter(Boolean);
  }

  // ---------- Liên kết giữa các bước: thành phẩm của bước trước làm nguyên liệu cho bước sau ----------
  function outName(steps, j) {
    const s = steps[j];
    return (s && s.o) || L.t('out.default', { n: j + 1 });
  }

  // Các bước (vị trí) dùng thành phẩm của bước j.
  function usedBy(steps, j) {
    const out = [];
    steps.forEach((s, i) => { if ((s.p || []).includes(j)) out.push(i); });
    return out;
  }

  // Nguyên liệu thô bên trong thành phẩm của bước j (tính cả các bước nó lấy lại).
  function rawOf(steps, j, ings, seen = new Set()) {
    if (seen.has(j) || !steps[j]) return [];
    seen.add(j);
    const s = steps[j];
    const list = stepIngredients(s, ings);
    (s.p || []).forEach((k) => rawOf(steps, k, ings, seen).forEach((x) => { if (!list.includes(x)) list.push(x); }));
    return list;
  }

  // Hình thành phẩm: một tô có nguyên liệu nhỏ bên trong và số bước ở góc.
  function outGraphic(steps, j, ings) {
    const raws = rawOf(steps, j, ings).slice(0, 3);
    const spots = [[18, 8], [32, 4], [46, 8]];
    const inner =
      raws.map((ing, k) => {
        const g = graphic(ing);
        const [cx, y] = spots[raws.length === 1 ? 1 : k];
        return `<svg x="${cx - 11}" y="${y}" width="22" height="22" viewBox="${g.vb}">${g.inner}</svg>`;
      }).join('') +
      `<g fill="none" stroke="#4A3B36" stroke-width="2.5" stroke-linejoin="round">` +
      `<path d="M6 26 C14 18 50 18 58 26Z" fill="#FFE6BF"/>` +
      `<path d="M4 26 h56 C60 46 48 58 32 58 C16 58 4 46 4 26Z" fill="#F2CC8F"/>` +
      `<circle cx="52" cy="48" r="10" fill="#E07A5F"/></g>` +
      `<text x="52" y="52.5" text-anchor="middle" font-size="12" font-weight="800" font-family="Nunito, sans-serif" fill="#FFFFFF">${j + 1}</text>`;
    return { vb: '0 0 64 64', inner };
  }
  function outSVG(steps, j, ings, cls = '') {
    const g = outGraphic(steps, j, ings);
    return `<svg class="ing-icon out-icon ${cls}" viewBox="${g.vb}" aria-hidden="true">${g.inner}</svg>`;
  }

  // Hình hiển thị trên căn bếp cho một bước: nguyên liệu thô và thành phẩm của bước trước.
  function stepGraphics(step, steps, ings) {
    return stepIngredients(step, ings).map(graphic).concat((step.p || []).map((j) => outGraphic(steps, j, ings)));
  }

  // VD: "Trộn nhẹ: Kem mascarpone (B1), Lòng trắng đánh bông (B2)".
  function stepTitle(step, steps, ings) {
    const names = stepIngredients(step, ings).map(ingName)
      .concat((step.p || []).map((j) => `${outName(steps, j)} (${L.t('step.short', { n: j + 1 })})`));
    return actionLabel(step) + (names.length ? ': ' + names.join(', ') : '');
  }

  // Căn bếp trong khung: bề rộng tự co giãn theo số dụng cụ, cuộn ngang khi quá hẹp,
  // và tự cuộn tới dụng cụ đang dùng.
  function kitchenView(opts, cls = '') {
    const sc = Kitchen.scene(opts);
    const el = h('div', {
      class: 'kitchen' + (opts.active ? ' has-active' : '') + (opts.interactive ? ' interactive' : '') + (cls ? ' ' + cls : ''),
      style: `--sw:${sc.w}`,
      html: sc.svg,
    });
    requestAnimationFrame(() => {
      if (el.scrollWidth > el.clientWidth + 2) {
        el.scrollLeft = (sc.focus / sc.w) * el.scrollWidth - el.clientWidth / 2;
      }
    });
    return el;
  }

  function minutesLabel(t) {
    if (!t) return '';
    if (t < 1) return L.t('time.sec', { s: Math.round(t * 60) });
    const m = Math.floor(t), s = Math.round((t - m) * 60);
    return s ? L.t('time.minSec', { m, s }) : L.t('time.min', { m });
  }

  // Nút chuyển ngôn ngữ VI / EN.
  function langToggle(onChange) {
    const box = h('div', { class: 'lang-toggle', role: 'group', 'aria-label': L.t('lang.label') });
    [['vi', 'VI'], ['en', 'EN']].forEach(([code, label]) => {
      const on = L.lang === code;
      box.append(h('button', {
        type: 'button', class: on ? 'on' : '', 'aria-pressed': on ? 'true' : 'false',
        lang: code, title: code === 'vi' ? 'Tiếng Việt' : 'English',
        onclick: () => { if (L.lang !== code) { L.set(code); onChange(); } },
      }, label));
    });
    return box;
  }

  function topbar(onLangChange, ...extra) {
    return h('header', { class: 'topbar' },
      h('div', { class: 'brand', html: App.logo() + `<div><div class="brand-name">Close the distance</div><div class="brand-sub">${L.t('brand.sub')}</div></div>` }),
      h('div', { class: 'topbar-tools' }, langToggle(onLangChange), extra));
  }

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* bộ nhớ bị chặn: bỏ qua */ }
    },
    del(key) {
      try { localStorage.removeItem(key); } catch (e) { /* bỏ qua */ }
    },
  };

  let toastTimer;
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = h('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
      document.body.append(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Hộp thoại đơn giản. Trả về { el, body, close }.
  function modal(title, { onClose, wide } = {}) {
    const body = h('div', { class: 'modal-body' });
    const closeBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': L.t('modal.close'), html: ui('x') });
    const box = h('div', { class: 'modal' + (wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('div', { class: 'modal-head' }, h('h3', {}, title), closeBtn),
      body);
    const el = h('div', { class: 'modal-backdrop' }, box);
    function close() {
      el.remove();
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      if (onClose) onClose();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    closeBtn.onclick = close;
    el.addEventListener('mousedown', (e) => { if (e.target === el) close(); });
    document.addEventListener('keydown', onKey);
    document.body.append(el);
    document.body.classList.add('no-scroll');
    return { el, body, close };
  }

  window.C = { h, ui, graphic, ingSVG, sanitize, actionLabel, ingName, amountLabel, stepIngredients, minutesLabel, kitchenView,
    outName, usedBy, rawOf, outGraphic, outSVG, stepGraphics, stepTitle, langToggle, topbar, store, toast, modal };
})();
