// Màn hình nấu (người thương mở link trên điện thoại).
(function () {
  const { h, ui, ingSVG, graphic, actionLabel, ingName, minutesLabel, store, toast } = C;
  const t = L.t;
  const S = Kitchen.STATIONS;

  let R, root, view, progressKey, rawData;
  let screen = 'cover', idx = 0, checked = [];
  let timer = null, timerEl = null, tickId = null, audioCtx = null;
  let wakeLock = null;

  function hashStr(s) {
    let x = 5381;
    for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0;
    return x.toString(36);
  }

  function saveProgress() {
    store.set(progressKey, { screen, idx, checked });
  }

  function from() { return R.f ? t('cook.chefName', { name: R.f }) : t('cook.chef'); }

  // ---------- Giữ màn hình sáng ----------
  async function keepAwake() {
    try {
      if ('wakeLock' in navigator && !wakeLock && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (e) { /* không hỗ trợ hoặc bị từ chối: bỏ qua */ }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && screen === 'step') keepAwake();
  });

  // ---------- Các màn hình ----------
  function go(next, i) {
    screen = next;
    if (i != null) idx = i;
    saveProgress();
    render();
    window.scrollTo({ top: 0 });
    if (screen === 'step') keepAwake();
  }

  function render() {
    view.innerHTML = '';
    if (screen === 'step' && R.st.length) renderStep();
    else if (screen === 'done') renderDone();
    else renderCover();
  }

  function renderCover() {
    const letter = h('section', { class: 'card letter' },
      h('div', { class: 'letter-chef', html: Chef.svg(R.c, 'love') }),
      h('div', { class: 'letter-to' }, t('cook.sends', { chef: from(), to: R.to || t('cook.toDefault') })),
      h('h1', {}, R.t),
      R.m ? h('p', { class: 'letter-msg hand' }, R.m) : null,
      h('div', { class: 'letter-from hand' }, '— ' + from()));

    const counter = h('span', { class: 'pill' });
    const list = h('ul', { class: 'check-list' });
    function sync() {
      counter.textContent = t('cook.have', { a: checked.length, b: R.i.length });
    }
    R.i.forEach((ing, n) => {
      const on = checked.includes(n);
      list.append(h('li', {},
        h('button', { class: 'check-row' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: (e) => {
          const b = e.currentTarget;
          const now = !checked.includes(n);
          checked = now ? checked.concat(n) : checked.filter((x) => x !== n);
          b.classList.toggle('on', now);
          b.setAttribute('aria-pressed', now ? 'true' : 'false');
          sync(); saveProgress();
        } },
          h('span', { class: 'check-box', html: ui('check') }),
          h('span', { class: 'check-pic', html: ingSVG(ing) }),
          h('span', { class: 'check-text' },
            h('span', { class: 'check-name' }, ingName(ing)),
            C.amountLabel(ing) ? h('span', { class: 'check-qty' }, C.amountLabel(ing)) : null,
            ing.s ? h('span', { class: 'check-sub' }, t('cook.sub', { s: ing.s })) : null))));
    });
    sync();

    view.append(letter,
      h('section', { class: 'card' },
        h('div', { class: 'card-head spread' }, h('h2', {}, t('cook.prep')), counter),
        h('p', { class: 'muted' }, t('cook.tapHint')),
        list),
      h('div', { class: 'cook-nav single' },
        h('button', { class: 'btn btn-primary btn-lg', type: 'button', onclick: () => go('step', idx || 0), html: `<span>${idx ? t('cook.resume', { n: idx + 1 }) : t('cook.start')}</span>` + ui('right') })));
  }

  function renderStep() {
    const step = R.st[idx];
    const ings = C.stepIngredients(step, R.i);
    const n = R.st.length;

    const progress = h('div', { class: 'progress' },
      h('div', { class: 'progress-top' },
        h('button', { class: 'link-btn', type: 'button', onclick: () => go('cover'), html: ui('left') + `<span>${t('cook.backIng')}</span>` }),
        h('span', { class: 'pill' }, t('cook.step', { a: idx + 1, b: n }))),
      h('div', { class: 'progress-bar' }, h('span', { style: `width:${((idx + 1) / n) * 100}%` })));

    const scene = h('div', {
      class: 'kitchen has-active',
      html: Kitchen.scene({ active: step.s, heat: step.h, items: ings.map(graphic), chef: { c: R.c, mood: Chef.moodFor(step) } }),
    });
    const care = Chef.careFor(step);

    const meta = h('div', { class: 'chips static' }, h('span', { class: 'chip' }, L.station(step.s)));
    if (step.h) meta.append(h('span', { class: 'chip heat-' + step.h }, L.heat(step.h)));
    if (step.t) meta.append(h('span', { class: 'chip' }, minutesLabel(step.t)));

    const body = h('section', { class: 'card step-card' },
      care ? h('div', { class: 'care' }, h('strong', {}, t('cook.reminds', { chef: from() })), care) : null,
      h('h2', { class: 'step-action' }, actionLabel(step)),
      ings.length ? h('ul', { class: 'step-ings' }, ings.map((ing) =>
        h('li', {}, h('span', { html: ingSVG(ing) }), h('span', {}, h('strong', {}, ingName(ing)), C.amountLabel(ing) ? h('span', { class: 'muted' }, ' · ' + C.amountLabel(ing)) : null)))) : null,
      meta,
      step.t ? h('button', { class: 'btn btn-soft timer-btn', type: 'button', onclick: () => startTimer(step.t, idx), html: ui('clock') + `<span>${t('cook.timer', { t: minutesLabel(step.t) })}</span>` }) : null,
      step.n ? h('div', { class: 'note' }, h('div', { class: 'note-from' }, t('cook.says', { chef: from() })), h('p', { class: 'hand' }, step.n)) : null);

    const last = idx === n - 1;
    const nav = h('div', { class: 'cook-nav' },
      h('button', { class: 'btn btn-ghost btn-lg', type: 'button', onclick: () => (idx ? go('step', idx - 1) : go('cover')), html: ui('left') + `<span>${t('cook.back')}</span>` }),
      h('button', { class: 'btn btn-primary btn-lg', type: 'button', onclick: () => (last ? go('done') : go('step', idx + 1)), html: `<span>${last ? t('cook.done') : t('cook.next')}</span>` + ui(last ? 'check' : 'right') }));

    // Thanh tiến độ và căn bếp dính ở đầu màn hình khi cuộn xem nội dung bước.
    view.append(h('div', { class: 'cook-stage' }, progress, scene), body, nav);
  }

  function renderDone() {
    view.append(
      h('section', { class: 'card done-card' },
        h('div', { class: 'done-art', html: Chef.svg(R.c, 'love') }),
        h('h1', {}, t('cook.finished')),
        h('p', { class: 'muted' }, R.t),
        R.e ? h('div', { class: 'note big' }, h('div', { class: 'note-from' }, t('cook.message', { chef: from() })), h('p', { class: 'hand' }, R.e)) : null,
        h('p', { class: 'cta-photo' }, t('cook.photo', { chef: from() }))),
      h('div', { class: 'cook-nav' },
        h('button', { class: 'btn btn-ghost btn-lg', type: 'button', onclick: () => go('step', R.st.length - 1), html: ui('left') + `<span>${t('cook.review')}</span>` }),
        h('button', { class: 'btn btn-soft btn-lg', type: 'button', onclick: () => { checked = []; go('cover', 0); }, html: ui('refresh') + `<span>${t('cook.again')}</span>` })),
      h('p', { class: 'center muted small' }, h('a', { href: location.href.split('#')[0] }, t('cook.sendBack'))));
  }

  // ---------- Hẹn giờ ----------
  function fmt(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function startTimer(min, stepIdx) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { audioCtx = null; }
    const total = min * 60000;
    timer = { total, left: total, endAt: Date.now() + total, running: true, stepIdx, ring: false };
    clearInterval(tickId);
    tickId = setInterval(tick, 250);
    renderTimer();
    toast(t('timer.set', { t: minutesLabel(min) }));
  }

  function tick() {
    if (!timer || !timer.running) return;
    timer.left = timer.endAt - Date.now();
    if (timer.left <= 0) {
      timer.left = 0;
      timer.running = false;
      timer.ring = true;
      clearInterval(tickId);
      ring();
    }
    renderTimer();
  }

  function ring() {
    if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 300]);
    if (!audioCtx) return;
    [0, 0.35, 0.7].forEach((s) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + s);
      g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + s + 0.28);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + s);
      o.stop(audioCtx.currentTime + s + 0.3);
    });
  }

  function renderTimer() {
    if (!timer) { if (timerEl) timerEl.remove(); timerEl = null; return; }
    if (!timerEl) {
      timerEl = h('div', { class: 'timer-bar', role: 'timer', 'aria-live': 'off' });
      document.body.append(timerEl);
    }
    timerEl.className = 'timer-bar' + (timer.ring ? ' ring' : '');
    timerEl.innerHTML = '';
    const pct = timer.total ? (1 - timer.left / timer.total) * 100 : 100;
    const toggle = h('button', { class: 'icon-btn', type: 'button', 'aria-label': timer.running ? t('timer.pause') : t('timer.resume'), html: ui(timer.running ? 'pause' : 'play'), onclick: () => {
      if (timer.running) { timer.running = false; timer.left = timer.endAt - Date.now(); }
      else { timer.running = true; timer.endAt = Date.now() + timer.left; clearInterval(tickId); tickId = setInterval(tick, 250); }
      renderTimer();
    } });
    timerEl.append(
      h('span', { class: 'timer-fill', style: `width:${pct}%` }),
      h('span', { class: 'timer-icon', html: ui('clock') }),
      h('span', { class: 'timer-text' },
        h('strong', {}, timer.ring ? t('timer.up') : fmt(timer.left)),
        h('span', { class: 'timer-label' }, actionLabel(R.st[timer.stepIdx]))),
      timer.ring ? null : toggle,
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('timer.stop'), html: ui('x'), onclick: () => { clearInterval(tickId); timer = null; renderTimer(); } }));
  }

  // ---------- Khởi động ----------
  function shell() {
    root.innerHTML = '';
    view = h('main', { class: 'wrap' });
    root.append(C.topbar(changeLang), view);
  }

  let errorCode = null;

  function renderError() {
    const old = errorCode === 'unsupported';
    view.append(h('section', { class: 'card center' },
      h('h1', {}, t(old ? 'cook.oldTitle' : 'cook.errTitle')),
      h('p', {}, t(old ? 'cook.oldBody' : 'cook.errBody')),
      h('a', { class: 'btn btn-primary', href: location.href.split('#')[0] }, t('cook.errBtn'))));
  }

  // Đổi ngôn ngữ: giữ nguyên màn hình, bước đang nấu, vị trí cuộn và hẹn giờ.
  function changeLang() {
    const y = window.scrollY;
    shell();
    if (!R) { renderError(); return; }
    // Đọc lại để tên món mặc định (khi Chef không đặt tên) cũng đổi theo ngôn ngữ.
    R = C.sanitize(rawData);
    render();
    if (timer) renderTimer();
    window.scrollTo(0, y);
  }

  async function mount(el, data) {
    root = el;
    root.className = 'cook';
    shell();

    try {
      rawData = await Codec.decode(data);
      R = C.sanitize(rawData);
      if (!R.st.length) throw new Error('Recipe không có bước nào');
    } catch (e) {
      R = null;
      errorCode = e && e.code;
      renderError();
      return;
    }

    document.title = R.t + ' · Close the distance';
    progressKey = 'ctd-progress-' + hashStr(data);
    const p = store.get(progressKey, null);
    if (p) {
      checked = Array.isArray(p.checked) ? p.checked.filter((n) => Number.isInteger(n) && n < R.i.length) : [];
      idx = Number.isInteger(p.idx) && p.idx >= 0 && p.idx < R.st.length ? p.idx : 0;
      screen = ['cover', 'step', 'done'].includes(p.screen) ? p.screen : 'cover';
      if (screen === 'step') screen = 'cover'; // mở lại thì cho xem nguyên liệu trước, nút sẽ là "Nấu tiếp"
    }
    render();

    document.addEventListener('keydown', (e) => {
      if (!R || screen !== 'step' || e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight') idx < R.st.length - 1 ? go('step', idx + 1) : go('done');
      if (e.key === 'ArrowLeft') idx ? go('step', idx - 1) : go('cover');
    });
  }

  window.Cook = { mount };
})();
