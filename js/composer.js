// Màn hình soạn công thức (Chef).
(function () {
  const { h, ui, ingSVG, graphic, actionLabel, ingName, minutesLabel, store, toast, modal } = C;
  const t = L.t;
  const DRAFT_KEY = 'ctd-draft-v1';
  const LIB_KEY = 'ctd-drawings-v1';
  const CHEF_KEY = 'ctd-chef-v1';
  const MAX_DRAWN = 6;
  // Khớp với giới hạn khi đọc link (C.sanitize).
  const MAX_ING = 40;
  const MAX_STEPS = 50;
  const S = Kitchen.STATIONS;

  const TOOLS_KEY = 'ctd-tools-v1';
  const INTRO_KEY = 'ctd-intro-seen-v1';
  const savedChef = () => Chef.sanitize(store.get(CHEF_KEY, null));
  const savedTools = () => Kitchen.normalize(store.get(TOOLS_KEY, null));
  const THEME_KEY = 'ctd-theme-v1';
  const savedTheme = () => (store.get(THEME_KEY, 'viet') === 'modern' ? 'modern' : 'viet');
  const blank = () => ({ t: '', to: '', f: '', m: '', e: '', c: savedChef(), k: savedTools(), th: savedTheme(), i: [], st: [] });
  // p: thành phẩm của các bước trước dùng trong bước này; o: tên thành phẩm của bước này.
  const blankStep = () => ({ s: null, a: '', g: [], p: [], h: 0, d: 0, t: '', n: '', o: '' });

  let state = blank();
  let builder = blankStep();
  let editing = null;
  // Bước đang được xem lại trên căn bếp (bấm vào một bước trong danh sách).
  let viewing = null;
  let els = {};

  let saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set(DRAFT_KEY, state), 250);
  }

  function loadDraft() {
    const d = store.get(DRAFT_KEY, null);
    if (!d) return blank();
    try {
      const r = C.sanitize(d);
      if (!d.t) r.t = '';
      if (!d.c) r.c = savedChef();
      if (!d.k) r.k = Kitchen.normalize(savedTools(), r.st);
      if (!d.th) r.th = savedTheme();
      return r;
    } catch (e) { return blank(); }
  }

  function field(label, input, hint) {
    return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), input, hint ? h('span', { class: 'field-hint' }, hint) : null);
  }
  function bindText(key, tag, attrs) {
    const el = h(tag, Object.assign({ value: state[key] }, attrs));
    el.addEventListener('input', () => { state[key] = el.value; save(); });
    return el;
  }
  function chip(label, on, onclick, extra = {}) {
    return h('button', Object.assign({ class: 'chip' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick }, extra), label);
  }
  function cardHead(num, title) {
    return h('div', { class: 'card-head' }, h('span', { class: 'num' }, String(num)), h('h2', {}, title));
  }

  // ---------- Phần 1: Chef ----------
  let chefMood = 'happy';

  function setChef(i, v) {
    state.c[i] = v;
    store.set(CHEF_KEY, state.c);
    save();
    renderChef();
    renderBuilder();
  }

  function swatches(list, group, i, label) {
    const cur = state.c[i];
    return h('div', { class: 'swatches' }, list.map(([col, viName], v) => {
      const name = L.chefOpt(group, v, viName);
      return h('button', {
        class: 'swatch' + (cur === v ? ' on' : ''), type: 'button', style: `--c:${col}`,
        title: name, 'aria-label': label + ': ' + name, 'aria-pressed': cur === v ? 'true' : 'false',
        onclick: () => setChef(i, v),
      });
    }));
  }

  function renderChef() {
    const c = state.c;
    els.chefPreview.innerHTML = Chef.svg(c, chefMood);
    els.chefMoods.innerHTML = '';
    ['happy', 'serious', 'love'].forEach((k) =>
      els.chefMoods.append(chip(t('mood.' + k), chefMood === k, () => { chefMood = k; renderChef(); })));
    const box = els.chefOptions;
    box.innerHTML = '';
    const group = (label, ctrl) => h('div', { class: 'group' }, h('span', { class: 'field-label' }, label), ctrl);
    const chips = (list, groupKey, i) => h('div', { class: 'chips' },
      list.map((viName, v) => chip(L.chefOpt(groupKey, v, viName), c[i] === v, () => setChef(i, v))));
    const female = c[6] === 1;
    box.append(
      group(t('chef.gender'), chips(Chef.GENDERS, 'gender', 6)),
      group(t('chef.skin'), swatches(Chef.SKIN, 'skin', 0, t('chef.skin'))),
      group(t('chef.hair'), chips(female ? Chef.HAIR_F : Chef.HAIR_M, female ? 'hairF' : 'hairM', 1)),
      group(t('chef.hairColor'), swatches(Chef.HAIR_COLORS, 'hairColor', 2, t('chef.hairColor'))),
      group(t('chef.hat'), chips(Chef.HATS, 'hat', 3)),
      group(t('chef.apron'), chips(Chef.APRONS, 'apron', 4)),
      group(t('chef.apronColor'), swatches(Chef.APRON_COLORS, 'apronColor', 5, t('chef.apronColor'))));
  }

  function chefSection() {
    els.chefPreview = h('div', { class: 'chef-preview' });
    els.chefMoods = h('div', { class: 'chips chef-moods' });
    els.chefOptions = h('div', { class: 'chef-options' });
    const name = bindText('f', 'input', { type: 'text', maxlength: 40, placeholder: t('chef.namePh') });
    name.addEventListener('input', renderHero);
    return h('section', { class: 'card' },
      cardHead(1, t('chef.title')),
      h('div', { class: 'chef-maker' },
        h('div', { class: 'chef-stage' }, els.chefPreview, els.chefMoods),
        h('div', { class: 'chef-side' }, field(t('chef.name'), name), els.chefOptions)));
  }

  function renderHero() {
    const n = state.f.trim();
    els.heroTitle.textContent = n ? t('hero.hiName', { name: n }) : t('hero.hi');
  }

  // ---------- Phần 2: recipe ----------
  // ---------- Recipe món Việt mẫu ----------
  function templateBox() {
    return h('div', { class: 'tpl-box' },
      h('div', { class: 'tpl-title' }, t('tpl.title')),
      h('div', { class: 'tpl-list' }, Templates.LIST.map((tpl) =>
        h('button', { class: 'tpl-item', type: 'button', onclick: () => loadTemplate(tpl) },
          h('span', { class: 'tpl-pic', html: Icons.svg(tpl.icon) }),
          h('span', {}, tpl.name[L.lang] || tpl.name.vi)))),
      h('p', { class: 'field-hint' }, t('tpl.hint')));
  }

  // Nạp món mẫu: giữ Chef, tên Chef, người nhận, kiểu bếp; thay tên món, nguyên liệu, dụng cụ, các bước.
  function loadTemplate(tpl) {
    const name = tpl.name[L.lang] || tpl.name.vi;
    const busy = state.i.length || state.st.length || state.t.trim();
    if (busy && !confirm(t('tpl.confirm', { name }))) return;
    const r = C.sanitize(tpl.build(L.lang));
    state = Object.assign(r, { c: state.c, f: state.f, to: state.to, th: state.th, m: state.m, e: state.e });
    builder = blankStep();
    editing = null;
    viewing = null;
    clearTimeout(saveTimer);
    store.set(DRAFT_KEY, state);
    build();
    toast(t('tpl.loaded', { name }));
    const ing = els.ingList && els.ingList.closest('.card');
    if (ing) ing.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function infoSection() {
    return h('section', { class: 'card' },
      cardHead(2, t('recipe.title')),
      templateBox(),
      field(t('recipe.dish'), bindText('t', 'input', { type: 'text', maxlength: 80, placeholder: t('recipe.dishPh'), id: 'f-title' })),
      field(t('recipe.to'), bindText('to', 'input', { type: 'text', maxlength: 40, placeholder: t('recipe.toPh') })),
      field(t('recipe.msg'), bindText('m', 'textarea', { rows: 3, maxlength: 600, class: 'hand', placeholder: t('recipe.msgPh') })));
  }

  // ---------- Phần 3: nguyên liệu ----------
  function ingredientSection() {
    els.ingList = h('div', { class: 'ing-list' });
    return h('section', { class: 'card' },
      cardHead(3, t('ing.title')),
      els.ingList,
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn btn-soft', type: 'button', onclick: openPicker, html: ui('plus') + `<span>${t('ing.add')}</span>` }),
        h('button', { class: 'btn btn-soft', type: 'button', onclick: () => openDraw(), html: ui('pen') + `<span>${t('ing.draw')}</span>` })));
  }

  function renderIngredients() {
    const list = els.ingList;
    list.innerHTML = '';
    if (!state.i.length) {
      list.append(h('p', { class: 'empty' }, t('ing.empty')));
      return;
    }
    state.i.forEach((ing, idx) => {
      const name = h('input', { type: 'text', value: ingName(ing), maxlength: 40, 'aria-label': t('ing.nameAria') });
      name.addEventListener('input', () => {
        const v = name.value;
        // Giữ trống nếu là tên mặc định của icon, để tên tự đổi theo ngôn ngữ người xem.
        ing.n = ing.k && L.iconNames(ing.k).includes(v.trim()) ? '' : v;
        save();
        renderSteps();
      });
      name.addEventListener('change', renderBuilder);
      const sub = h('input', { type: 'text', value: ing.s, maxlength: 120, class: 'sub', placeholder: t('ing.subPh'), 'aria-label': t('ing.subAria') });
      sub.addEventListener('input', () => { ing.s = sub.value; save(); });
      list.append(h('div', { class: 'ing-row' },
        h('div', { class: 'ing-pic', html: ingSVG(ing) }),
        h('div', { class: 'ing-fields' }, h('div', { class: 'ing-main' }, name, amountControl(ing)), sub),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('ing.del', { name: ingName(ing) }), html: ui('trash'), onclick: () => removeIngredient(idx) })));
    });
  }

  // Đơn vị gợi ý sẵn theo loại nguyên liệu.
  const DEFAULT_UNIT = {
    trung: 'qua', ca_chua: 'qua', chanh: 'trai', ot: 'trai', dua_leo: 'trai', bap: 'trai',
    toi: 'tep', hanh_tim: 'cu', hanh_la: 'cong', sa: 'cong', gung: 'nhanh', rau_cai: 'bo',
    nuoc_mam: 'tbsp', nuoc_tuong: 'tbsp', dau_an: 'tbsp',
    muoi: 'tsp', duong: 'tsp', tieu: 'tsp', hat_nem: 'tsp',
    sua: 'ml', nuoc: 'ml', gao: 'cup',
    long_do: 'qua', long_trang: 'qua', kem_tuoi: 'ml', banh_quy: 'mieng', ca_phe: 'ml',
    cacao: 'tbsp', men_no: 'tsp', vani: 'tsp',
    // Bếp Việt
    bot_ngot: 'tsp', dau_hao: 'tbsp', tuong_ot: 'tbsp', sa_te: 'tsp', mam_tom: 'tsp', mam_ruoc: 'tbsp', giam: 'tbsp',
    me: 'trai', nuoc_mau: 'tbsp', ngu_vi: 'tsp', que: 'mieng', hoa_hoi: 'qua', thao_qua: 'trai', duong_phen: 'g',
    bot_nghe: 'tsp', dau_dieu: 'tbsp', me_rang: 'tbsp', dau_phong: 'tbsp', hanh_phi: 'tbsp', nuoc_cot_dua: 'ml',
    rau_ram: 'nam', ngo_ri: 'nam', ngo_gai: 'nam', hung_que: 'nam', tia_to: 'nam', kinh_gioi: 'nam', thi_la: 'nam',
    la_chanh: 'la', la_lot: 'nam', he: 'bo', gia_do: 'nam', rau_muong: 'bo', bi_do: 'g', kho_qua: 'trai', dau_bap: 'trai',
    ba_chi: 'lang', suon: 'lang', muc: 'con', ngheu: 'g', cua: 'con', gio_lua: 'lang',
    bun: 'g', banh_pho: 'g', mien: 'g', banh_trang: 'goi', banh_mi: 'qua', gao_nep: 'bat', bot_nang: 'tbsp', bot_chien: 'g',
  };

  // Ô nhập số + menu chọn đơn vị (g, kg, ml, muỗng canh, quả...).
  function amountControl(ing) {
    const num = h('input', {
      type: 'number', min: 0, step: 'any', inputmode: 'decimal', class: 'amount-num',
      value: ing.a || '', placeholder: ing.q || '0', 'aria-label': t('ing.amountAria'),
    });
    num.addEventListener('input', () => {
      const v = parseFloat(num.value);
      if (v > 0) { ing.a = Math.min(100000, Math.round(v * 100) / 100); ing.q = ''; }
      else delete ing.a;
      save();
    });
    const sel = h('select', { class: 'amount-unit', 'aria-label': t('ing.unitAria') },
      L.UNIT_GROUPS.map(([g, list]) => h('optgroup', { label: t('unitGroup.' + g) },
        list.map((u) => h('option', { value: u, selected: (ing.u || 'g') === u }, L.unit(u, 2))))));
    const sync = () => num.classList.toggle('hidden', sel.value === 'vua');
    sel.addEventListener('change', () => { ing.u = sel.value; sync(); save(); });
    if (!ing.u) ing.u = sel.value;
    sync();
    return h('div', { class: 'amount' }, num, sel);
  }

  // Trả về false nếu đã đủ số nguyên liệu tối đa (người nhận chỉ đọc được chừng đó).
  function addIngredient(ing) {
    if (state.i.length >= MAX_ING) { toast(t('limit.ing', { n: MAX_ING })); return false; }
    const x = { n: String(ing.n || '').slice(0, 40), q: '', s: '', u: DEFAULT_UNIT[ing.k] || 'g' };
    if (ing.k) x.k = ing.k;
    if (ing.w) x.w = ing.w;
    state.i.push(x);
    save();
    renderIngredients();
    renderBuilder();
    return true;
  }

  function removeIngredient(idx) {
    state.i.splice(idx, 1);
    const fix = (g) => g.filter((n) => n !== idx).map((n) => (n > idx ? n - 1 : n));
    state.st.forEach((st) => { st.g = fix(st.g); });
    builder.g = fix(builder.g);
    save();
    renderIngredients();
    renderBuilder();
    renderSteps();
  }

  function openPicker() {
    const m = modal(t('picker.title'), { wide: true });
    const tabs = h('div', { class: 'tabs', role: 'tablist' });
    const grid = h('div', { class: 'icon-grid' });
    const cats = Icons.cats.map((c) => ({ key: c.key, name: L.cat(c.key) })).concat([{ key: 've', name: t('picker.drawn') }]);
    let cur = Icons.cats[0].key;

    function count(k) { return state.i.filter((x) => x.k === k).length; }

    function show() {
      [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.k === cur));
      grid.innerHTML = '';
      if (cur === 've') {
        const lib = store.get(LIB_KEY, []);
        if (!lib.length) grid.append(h('p', { class: 'empty' }, t('picker.libEmpty')));
        lib.forEach((d, n) => {
          const w = d && Whiteboard.validate(d.w);
          if (!w) return;
          const dn = String(d.n || t('draw.defaultName')).slice(0, 40);
          grid.append(h('div', { class: 'icon-tile-wrap' },
            h('button', { class: 'icon-tile', type: 'button', onclick: () => {
              if (state.i.filter((x) => x.w).length >= MAX_DRAWN) { toast(t('draw.max', { n: MAX_DRAWN })); return; }
              if (addIngredient({ w, n: dn })) toast(t('toast.added', { name: dn }));
            } },
              h('span', { html: ingSVG({ w }) }), h('span', { class: 'icon-name' }, dn)),
            h('button', { class: 'tile-del', type: 'button', 'aria-label': t('picker.delDrawing', { name: dn }), html: ui('x'), onclick: () => {
              const l = store.get(LIB_KEY, []); l.splice(n, 1); store.set(LIB_KEY, l); show();
            } })));
        });
        return;
      }
      Object.values(Icons.list).filter((ic) => ic.cat === cur).forEach((ic) => {
        const c = count(ic.key);
        const name = L.icon(ic.key);
        const badge = h('span', { class: 'badge' + (c ? '' : ' hidden') }, String(c));
        grid.append(h('button', { class: 'icon-tile', type: 'button', onclick: () => {
          if (!addIngredient({ k: ic.key })) return;
          badge.textContent = count(ic.key); badge.classList.remove('hidden');
          toast(t('toast.added', { name }));
        } }, h('span', { html: Icons.svg(ic.key) }), h('span', { class: 'icon-name' }, name), badge));
      });
    }

    cats.forEach((c) => tabs.append(h('button', { class: 'tab', type: 'button', role: 'tab', 'data-k': c.key, onclick: () => { cur = c.key; show(); } }, c.name)));
    m.body.append(tabs, grid,
      h('div', { class: 'modal-foot' },
        h('button', { class: 'btn btn-soft', type: 'button', html: ui('pen') + `<span>${t('picker.drawOwn')}</span>`, onclick: () => { m.close(); openDraw(); } }),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: m.close }, t('picker.done'))));
    show();
  }

  function openDraw() {
    if (state.i.filter((x) => x.w).length >= MAX_DRAWN) {
      toast(t('draw.max', { n: MAX_DRAWN }));
      return;
    }
    let wb;
    const m = modal(t('draw.title'), { onClose: () => wb && wb.destroy() });
    const name = h('input', { type: 'text', maxlength: 40, placeholder: t('draw.namePh') });
    const board = h('div');
    const saveBtn = h('button', { class: 'btn btn-primary', type: 'button' }, t('draw.save'));
    m.body.append(field(t('ing.nameAria'), name), board,
      h('div', { class: 'modal-foot' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: m.close }, t('btn.cancel')), saveBtn));
    wb = Whiteboard.mount(board);
    name.focus();
    saveBtn.onclick = () => {
      // Kiểm tra giống lúc người nhận đọc link, để hình gửi đi và hình nhận được y hệt nhau.
      const w = Whiteboard.validate(wb.getStrokes());
      if (!w) { toast(t('draw.empty')); return; }
      const n = name.value.trim() || t('draw.defaultName');
      if (!addIngredient({ w, n })) return;
      const lib = store.get(LIB_KEY, []);
      lib.unshift({ n, w });
      store.set(LIB_KEY, lib.slice(0, 30));
      m.close();
      toast(t('toast.added', { name: n }));
    };
  }

  // ---------- Phần 4: vào bếp ----------
  function kitchenSection() {
    els.scene = h('div', { class: 'kitchen-sticky' });
    els.builder = h('div', { class: 'builder' });
    els.steps = h('ol', { class: 'step-list' });
    els.scene.addEventListener('click', (e) => {
      const st = e.target.closest('[data-station]');
      if (st) selectStation(st.dataset.station);
    });
    els.scene.addEventListener('keydown', (e) => {
      const st = e.target.closest('[data-station]');
      if (st && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectStation(st.dataset.station); }
    });
    els.themeRow = h('div', { class: 'theme-row' });
    renderTheme();
    return h('section', { class: 'card', id: 'kitchen-card' },
      cardHead(4, t('kitchen.title')),
      h('p', { class: 'muted' }, t('kitchen.help')),
      els.themeRow,
      els.scene,
      els.builder,
      h('h3', { class: 'sub-head' }, t('steps.title')),
      h('p', { class: 'field-hint' }, t('steps.hint')),
      els.steps);
  }

  // Kiểu bếp: Bếp Việt (mặc định) hoặc Bếp hiện đại. Ghi nhớ cho lần sau và gửi kèm trong link.
  function renderTheme() {
    els.themeRow.innerHTML = '';
    els.themeRow.append(
      h('span', { class: 'field-label' }, t('theme.label')),
      h('div', { class: 'seg', role: 'group', 'aria-label': t('theme.label') },
        ['viet', 'modern'].map((v) => h('button', {
          type: 'button', class: state.th === v ? 'on' : '', 'aria-pressed': state.th === v ? 'true' : 'false',
          onclick: () => {
            if (state.th === v) return;
            state.th = v;
            App.setTheme(v);
            store.set(THEME_KEY, v);
            save();
            renderTheme();
            renderScene();
          },
        }, t('theme.' + v)))));
  }

  // Căn bếp luôn dính ở đầu mục khi cuộn, hiển thị bước đang soạn hoặc đang xem lại.
  function renderScene() {
    const b = builder;
    let step = null, caption;
    if (viewing != null && state.st[viewing]) {
      step = state.st[viewing];
      caption = t('scene.viewing', { n: viewing + 1, title: stepTitle(step) });
    } else if (b.s) {
      step = b;
      caption = editing != null ? t('scene.editing', { n: editing + 1 }) : t('scene.drafting', { n: state.st.length + 1 });
    } else {
      caption = t('scene.idle');
    }
    els.scene.innerHTML = '';
    els.scene.append(
      C.kitchenView({
        tools: state.k, theme: state.th,
        active: step ? step.s : null, heat: step ? step.h : 0, temp: step ? step.d : 0,
        items: step ? C.stepGraphics(step, state.st, state.i) : [], interactive: true,
        chef: { c: state.c, mood: Chef.moodFor(step) },
      }),
      h('div', { class: 'scene-caption' + (viewing != null ? ' previewing' : '') }, caption));
  }

  // ---------- Bộ dụng cụ trong bếp ----------
  function toolInUse(key) {
    const i = state.st.findIndex((s) => s.s === key);
    if (i >= 0) return i + 1;
    if (builder.s === key) return editing != null ? editing + 1 : state.st.length + 1;
    return 0;
  }

  function saveTools() {
    store.set(TOOLS_KEY, state.k);
    save();
    renderBuilder();
  }

  function addTool(k) {
    state.k = Kitchen.normalize(state.k.concat(k), state.st);
    saveTools();
  }

  // Bỏ dụng cụ khỏi bếp. Không bỏ được nếu đang dùng trong một bước hoặc là dụng cụ cuối cùng.
  function removeTool(k) {
    const used = toolInUse(k);
    if (used) { toast(t('tools.inUse', { tool: L.station(k), n: used })); return false; }
    if (state.k.length <= 1) { toast(t('tools.min')); return false; }
    state.k = state.k.filter((x) => x !== k);
    saveTools();
    toast(t('tools.removed', { tool: L.station(k) }));
    return true;
  }

  function openTools() {
    const m = modal(t('tools.title'), { wide: true });
    const tabs = h('div', { class: 'tabs', role: 'tablist' });
    const grid = h('div', { class: 'icon-grid tool-grid' });
    const count = h('span', { class: 'pill' });
    let cur = 'prep';

    function show() {
      [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.k === cur));
      count.textContent = t('tools.count', { n: state.k.length });
      grid.innerHTML = '';
      Kitchen.ORDER.filter((k) => Kitchen.TOOLS[k].cat === cur).forEach((k) => {
        const on = state.k.includes(k);
        grid.append(h('button', {
          class: 'icon-tile tool-tile' + (on ? ' on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false',
          title: on ? t('tools.remove', { tool: L.station(k) }) : L.station(k),
          onclick: () => toggleTool(k),
        },
          h('span', { class: 'tool-pic', html: Kitchen.toolSVG(k) }),
          h('span', { class: 'icon-name' }, L.station(k)),
          h('span', { class: 'tool-check', html: ui('check') }),
          h('span', { class: 'tool-x', html: ui('x') })));
      });
    }

    function toggleTool(k) {
      if (state.k.includes(k)) removeTool(k);
      else addTool(k);
      show();
    }

    Kitchen.CATS.forEach((c) => tabs.append(h('button', { class: 'tab', type: 'button', role: 'tab', 'data-k': c, onclick: () => { cur = c; show(); } }, L.toolCat(c))));
    m.body.append(
      h('p', { class: 'muted small' }, t('tools.hint')),
      tabs, grid,
      h('div', { class: 'modal-foot spread' }, count, h('button', { class: 'btn btn-primary', type: 'button', onclick: m.close }, t('picker.done'))));
    show();
  }

  function togglePreview(idx) {
    viewing = viewing === idx ? null : idx;
    renderScene();
    renderSteps();
  }

  function selectStation(key) {
    if (!S[key]) return;
    viewing = null;
    builder.s = key;
    if (!Object.prototype.hasOwnProperty.call(S[key].actions, builder.a)) builder.a = '';
    builder.h = Kitchen.hasHeat(key) ? (builder.h || 2) : 0;
    builder.d = S[key].temp ? (builder.d || 180) : 0;
    renderBuilder();
  }

  function renderBuilder() {
    const b = builder;
    const box = els.builder;
    box.innerHTML = '';
    renderScene();

    // Mỗi dụng cụ: bấm tên để chọn chỗ làm, bấm ✕ để bỏ khỏi bếp.
    box.append(h('div', { class: 'chips station-chips' },
      state.k.map((k) => h('span', { class: 'tool-chip' + (b.s === k ? ' on' : '') },
        h('button', { class: 'tool-chip-name', type: 'button', 'aria-pressed': b.s === k ? 'true' : 'false', onclick: () => selectStation(k) }, L.station(k)),
        h('button', { class: 'tool-chip-x', type: 'button', 'aria-label': t('tools.remove', { tool: L.station(k) }), title: t('tools.remove', { tool: L.station(k) }), html: ui('x'), onclick: () => removeTool(k) }))),
      h('button', { class: 'chip chip-tools', type: 'button', onclick: openTools, html: ui('plus') + `<span>${t('tools.btn')}</span>` })));

    if (!b.s) return;

    const st = S[b.s];
    const panel = h('div', { class: 'step-panel' });

    panel.append(h('div', { class: 'group' }, h('span', { class: 'field-label' }, t('builder.what')),
      h('div', { class: 'chips' }, Object.keys(st.actions).map((k) => chip(L.action(k, b.s), b.a === k, () => { b.a = k; renderBuilder(); })))));

    // Bước đang soạn nằm ở vị trí nào: chỉ được lấy thành phẩm của các bước đứng trước nó.
    const here = editing != null ? editing : state.st.length;
    const usedAt = (n) => state.st.map((s, i) => (i !== editing && s.g.includes(n) ? L.t('step.short', { n: i + 1 }) : null)).filter(Boolean);
    const ingChips = state.i.length
      ? h('div', { class: 'chips' }, state.i.map((ing, n) => {
        const on = b.g.includes(n);
        const c = chip('', on, () => {
          b.g = on ? b.g.filter((x) => x !== n) : b.g.concat(n);
          renderBuilder();
        }, { class: 'chip chip-ing' + (on ? ' on' : '') });
        const used = usedAt(n);
        c.append(h('span', { html: ingSVG(ing) }), h('span', {}, ingName(ing)),
          used.length ? h('span', { class: 'chip-sub' }, t('builder.usedIn', { list: used.join(', ') })) : null);
        return c;
      }))
      : h('p', { class: 'hint' }, t('builder.noIng'));
    const prevChips = here > 0
      ? h('div', { class: 'chips' }, state.st.slice(0, here).map((s, j) => {
        const on = b.p.includes(j);
        const c = chip('', on, () => {
          b.p = on ? b.p.filter((x) => x !== j) : b.p.concat(j).sort((x, y) => x - y);
          renderBuilder();
        }, { class: 'chip chip-ing chip-out' + (on ? ' on' : '') });
        c.append(h('span', { html: C.outSVG(state.st, j, state.i) }), h('span', {}, C.outName(state.st, j)),
          h('span', { class: 'chip-sub' }, L.t('step.short', { n: j + 1 })));
        return c;
      }))
      : null;
    panel.append(h('div', { class: 'group' }, h('span', { class: 'field-label' }, t('builder.with')),
      prevChips ? h('span', { class: 'group-sub' }, t('builder.raw')) : null, ingChips,
      prevChips ? h('span', { class: 'group-sub' }, t('builder.prev')) : null, prevChips));

    if (Kitchen.hasHeat(b.s)) {
      panel.append(h('div', { class: 'group' }, h('span', { class: 'field-label' }, t('builder.heat')),
        h('div', { class: 'chips' }, [1, 2, 3, 0].map((lv) => chip(L.heat(lv), b.h === lv, () => { b.h = lv; renderBuilder(); })))));
    }
    if (st.temp) {
      const temp = h('input', { type: 'number', min: 30, max: 300, step: 5, inputmode: 'numeric', value: b.d || '', class: 'temp-input', 'aria-label': t('builder.temp') });
      temp.addEventListener('input', () => { b.d = Math.max(0, Math.min(300, Math.round(Number(temp.value) || 0))); });
      temp.addEventListener('change', renderScene);
      panel.append(h('div', { class: 'group' }, h('span', { class: 'field-label' }, t('builder.temp')),
        h('div', { class: 'chips' }, temp, [150, 160, 170, 180, 200].map((v) => chip(v + '°C', b.d === v, () => { b.d = v; renderBuilder(); })))));
    }

    const time = h('input', { type: 'number', min: 0, max: 600, step: 0.5, inputmode: 'decimal', value: b.t, placeholder: '0' });
    time.addEventListener('input', () => { b.t = time.value; });
    const note = h('textarea', { rows: 2, maxlength: 400, class: 'hand', value: b.n, placeholder: t('builder.notePh') });
    note.addEventListener('input', () => { b.n = note.value; });
    const outName = h('input', { type: 'text', maxlength: 40, value: b.o, placeholder: t('out.default', { n: here + 1 }) });
    outName.addEventListener('input', () => { b.o = outName.value; });
    panel.append(
      h('div', { class: 'row-time' }, field(t('builder.time'), time, t('builder.timeHint'))),
      field(t('builder.note'), note),
      field(t('builder.outName'), outName, t('builder.outHint')));

    const label = b.a ? stepTitle(b) : t('builder.pickAction');
    panel.append(h('div', { class: 'preview-line' }, h('span', { class: 'muted' }, t('builder.preview')), h('strong', {}, label)));
    const care = Chef.careFor(b);
    if (care) panel.append(h('div', { class: 'care' }, h('strong', {}, t('builder.care')), care));

    panel.append(h('div', { class: 'btn-row' },
      h('button', { class: 'btn btn-primary', type: 'button', onclick: commitStep, html: ui(editing != null ? 'check' : 'plus') + `<span>${editing != null ? t('builder.save', { n: editing + 1 }) : t('builder.add')}</span>` }),
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: cancelStep }, t('btn.cancel'))));
    box.append(panel);
  }

  function stepTitle(step) {
    return C.stepTitle(step, state.st, state.i);
  }

  function commitStep() {
    const b = builder;
    if (!b.a) { toast(t('toast.pickAction')); return; }
    if (editing == null && state.st.length >= MAX_STEPS) { toast(t('limit.step', { n: MAX_STEPS })); return; }
    const tm = Math.max(0, Math.min(600, Number(b.t) || 0));
    const d = S[b.s].temp && b.d >= 30 ? Math.min(300, b.d) : 0;
    const here = editing != null ? editing : state.st.length;
    const step = {
      s: b.s, a: b.a, g: b.g.slice(), p: b.p.filter((j) => j < here), h: b.h, d,
      t: Math.round(tm * 2) / 2, n: (b.n || '').trim(), o: (b.o || '').trim().slice(0, 40),
    };
    if (editing != null) {
      state.st[editing] = step;
      toast(t('toast.stepSaved', { n: editing + 1 }));
    } else {
      state.st.push(step);
      toast(t('toast.stepAdded', { n: state.st.length }));
    }
    editing = null;
    viewing = null;
    builder = blankStep();
    save();
    renderBuilder();
    renderSteps();
  }

  function cancelStep() {
    editing = null;
    viewing = null;
    builder = blankStep();
    renderBuilder();
    renderSteps();
  }

  function renderSteps() {
    const list = els.steps;
    list.innerHTML = '';
    if (!state.st.length) {
      list.append(h('li', { class: 'empty' }, t('steps.empty')));
      return;
    }
    state.st.forEach((step, idx) => {
      const ings = C.stepIngredients(step, state.i);
      const meta = [L.station(step.s)];
      if (step.h) meta.push(L.heat(step.h));
      if (step.d) meta.push(step.d + '°C');
      if (step.t) meta.push(minutesLabel(step.t));
      // Liên kết: dùng thành phẩm bước nào, và thành phẩm của bước này được dùng ở đâu.
      const uses = (step.p || []).map((j) => `${C.outName(state.st, j)} (${L.t('step.short', { n: j + 1 })})`);
      const later = C.usedBy(state.st, idx);
      const makes = step.o || later.length
        ? t('steps.makes', { name: C.outName(state.st, idx) }) + (later.length ? ' → ' + later.map((i) => L.t('step.short', { n: i + 1 })).join(', ') : '')
        : '';
      list.append(h('li', { class: 'step-item' + (editing === idx ? ' editing' : '') + (viewing === idx ? ' previewing' : '') },
        h('span', { class: 'step-num' }, String(idx + 1)),
        h('div', {
          class: 'step-body', role: 'button', tabindex: 0, 'aria-pressed': viewing === idx ? 'true' : 'false',
          'aria-label': t('steps.view', { n: idx + 1 }),
          onclick: () => togglePreview(idx),
          onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePreview(idx); } },
        },
          h('div', { class: 'step-title' }, stepTitle(step)),
          h('div', { class: 'step-meta' }, meta.join(' · ')),
          ings.length || uses.length ? h('div', { class: 'step-icons', html: ings.map((x) => ingSVG(x)).join('') + (step.p || []).map((j) => C.outSVG(state.st, j, state.i)).join('') }) : null,
          uses.length ? h('div', { class: 'step-link uses' }, '← ' + t('steps.uses', { list: uses.join(', ') })) : null,
          makes ? h('div', { class: 'step-link makes' }, '→ ' + makes) : null,
          step.n ? h('div', { class: 'step-note hand' }, step.n) : null),
        h('div', { class: 'step-tools' },
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('steps.up'), disabled: idx === 0, html: ui('up'), onclick: () => moveStep(idx, -1) }),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('steps.down'), disabled: idx === state.st.length - 1, html: ui('down'), onclick: () => moveStep(idx, 1) }),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('steps.edit', { n: idx + 1 }), html: ui('edit'), onclick: () => editStep(idx) }),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('steps.del', { n: idx + 1 }), html: ui('trash'), onclick: () => deleteStep(idx) }))));
    });
  }

  // Đổi chỗ hai bước liền kề. Bước sau dùng thành phẩm của bước trước thì không đổi được.
  function moveStep(idx, d) {
    const j = idx + d;
    if (j < 0 || j >= state.st.length) return;
    const [first, second] = idx < j ? [idx, j] : [j, idx];
    if ((state.st[second].p || []).includes(first)) {
      toast(t('flow.moveBlocked', { a: second + 1, b: first + 1 }));
      return;
    }
    [state.st[idx], state.st[j]] = [state.st[j], state.st[idx]];
    // Cập nhật các liên kết trỏ tới hai bước vừa đổi chỗ.
    const swap = (n) => (n === idx ? j : n === j ? idx : n);
    state.st.forEach((s) => { s.p = (s.p || []).map(swap).sort((x, y) => x - y); });
    if (viewing === idx) viewing = j;
    else if (viewing === j) viewing = idx;
    if (editing != null) cancelStep();
    save();
    renderScene();
    renderSteps();
  }
  function deleteStep(idx) {
    const users = C.usedBy(state.st, idx);
    if (users.length) { toast(t('flow.deleteBlocked', { a: users[0] + 1 })); return; }
    state.st.splice(idx, 1);
    state.st.forEach((s) => { s.p = (s.p || []).map((n) => (n > idx ? n - 1 : n)); });
    if (viewing === idx) viewing = null;
    else if (viewing > idx) viewing--;
    if (editing != null) cancelStep();
    save();
    renderScene();
    renderSteps();
  }
  function editStep(idx) {
    const s = state.st[idx];
    builder = { s: s.s, a: s.a, g: s.g.slice(), p: (s.p || []).slice(), h: s.h, d: s.d || 0, t: s.t || '', n: s.n || '', o: s.o || '' };
    editing = idx;
    viewing = null;
    renderBuilder();
    renderSteps();
    els.scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Phần 5 & tạo link ----------
  function endSection() {
    return h('section', { class: 'card' },
      cardHead(5, t('end.title')),
      field(t('end.label'), bindText('e', 'textarea', { rows: 3, maxlength: 600, class: 'hand', placeholder: t('end.ph') })));
  }

  function payload() {
    const p = { v: 1, t: state.t.trim(), c: state.c, k: state.k };
    if (state.th === 'modern') p.th = 'm';
    ['to', 'f', 'm', 'e'].forEach((k) => { if (state[k].trim()) p[k] = state[k].trim(); });
    p.i = state.i.map((ing) => {
      const o = {};
      if (ing.k) o.k = ing.k;
      if (ing.w) o.w = ing.w;
      if (ing.n.trim()) o.n = ing.n.trim();
      if (ing.u === 'vua') o.u = 'vua';
      else if (ing.a) { o.a = ing.a; o.u = ing.u || 'g'; }
      else if (ing.q.trim()) o.q = ing.q.trim();
      if (ing.s.trim()) o.s = ing.s.trim();
      return o;
    });
    p.st = state.st.map((s) => {
      const o = { s: s.s, a: s.a };
      if (s.g.length) o.g = s.g;
      if (s.h) o.h = s.h;
      if (s.d) o.d = s.d;
      if (s.t) o.t = s.t;
      if (s.n) o.n = s.n;
      if (s.p && s.p.length) o.p = s.p;
      if (s.o) o.o = s.o;
      return o;
    });
    return p;
  }

  // warnUnused: trước khi gửi, nhắc nếu còn nguyên liệu chưa dùng ở bước nào.
  function check(warnUnused) {
    if (!state.t.trim()) {
      toast(t('check.title'));
      const f = document.getElementById('f-title');
      f.focus(); f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    if (!state.i.length) { toast(t('check.ing')); return false; }
    if (!state.st.length) { toast(t('check.step')); return false; }
    if (warnUnused) {
      const unused = state.i.filter((ing, n) => !state.st.some((s) => s.g.includes(n))).map(ingName);
      if (unused.length && !confirm(t('check.unused', { list: unused.join(', ') }))) return false;
    }
    return true;
  }

  async function makeLink() {
    const data = await Codec.encode(payload());
    return location.href.split('#')[0] + '#r=' + data;
  }

  async function preview() {
    if (!check()) return;
    // Mở tab ngay trong lúc bấm (trước khi chờ nén link) để Safari không chặn popup.
    const win = window.open('', '_blank');
    let url;
    try { url = await makeLink(); } catch (e) { if (win) win.close(); return; }
    if (win) {
      win.opener = null;
      win.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  async function share() {
    if (!check(true)) return;
    const url = await makeLink();
    const m = modal(t('share.title'));
    const who = state.to.trim() || t('share.whoDefault');
    const area = h('textarea', { class: 'link-box', rows: 4, readonly: true, value: url });
    const copyBtn = h('button', { class: 'btn btn-primary', type: 'button', html: ui('copy') + `<span>${t('share.copy')}</span>` });
    copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(url); }
      catch (e) { area.select(); document.execCommand('copy'); }
      toast(t('share.copied', { who }));
    };
    const row = h('div', { class: 'btn-row' }, copyBtn);
    if (navigator.share) {
      row.append(h('button', { class: 'btn btn-soft', type: 'button', html: ui('share') + `<span>${t('share.via')}</span>`, onclick: () => {
        navigator.share({ title: state.t, text: t('share.text', { dish: state.t, who }), url }).catch(() => {});
      } }));
    }
    row.append(h('a', { class: 'btn btn-ghost', href: url, target: '_blank', rel: 'noopener', html: ui('eye') + `<span>${t('share.open')}</span>` }));
    m.body.append(h('div', { class: 'modal-body' },
      h('div', { class: 'share-hero' },
        h('div', { class: 'share-chef', html: Chef.svg(state.c, 'love') }),
        h('p', {}, t('share.body', { who }))),
      area, row,
      url.length > 7000 ? h('p', { class: 'field-hint' }, t('share.long')) : null,
      h('p', { class: 'field-hint' }, t('share.private'))));
    area.addEventListener('focus', () => area.select());
  }

  function resetAll() {
    if (!confirm(t('confirm.reset'))) return;
    store.del(DRAFT_KEY);
    mount(els.root);
    window.scrollTo({ top: 0 });
  }

  // Đổi ngôn ngữ: lưu bản nháp ngay, dựng lại giao diện, giữ bước đang soạn và vị trí cuộn.
  function changeLang() {
    clearTimeout(saveTimer);
    store.set(DRAFT_KEY, state);
    const y = window.scrollY;
    build();
    window.scrollTo(0, y);
  }

  function build() {
    const root = els.root;
    els = { root };
    root.innerHTML = '';
    root.className = 'compose';
    App.setTheme(state.th);
    document.title = 'Close the distance';
    els.heroTitle = h('h1', {});
    root.append(
      C.topbar(changeLang,
        h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: resetAll, 'aria-label': t('btn.newRecipe'), html: ui('refresh') + `<span>${t('btn.newRecipe')}</span>` })),
      h('main', { class: 'wrap' },
        h('div', { class: 'hero' },
          els.heroTitle,
          h('p', { class: 'hero-lead' }, t('hero.lead')),
          h('p', {}, t('hero.body'))),
        chefSection(),
        infoSection(),
        ingredientSection(),
        kitchenSection(),
        endSection(),
        h('p', { class: 'center small' },
          h('button', { class: 'link-btn creator-link', type: 'button', onclick: showIntro, html: ui('heart') + `<span>${t('intro.reopen')}</span>` }))),
      h('div', { class: 'actionbar' },
        h('div', { class: 'actionbar-inner' },
          h('button', { class: 'btn btn-ghost', type: 'button', onclick: preview, html: ui('eye') + `<span>${t('btn.preview')}</span>` }),
          h('button', { class: 'btn btn-primary btn-lg', type: 'button', onclick: share, html: ui('heart') + `<span>${t('btn.send')}</span>` }))));
    renderHero();
    renderChef();
    renderIngredients();
    renderBuilder();
    renderSteps();
  }

  // Mở lại lời nhắn từ nhà sáng tạo; bấm "Bắt đầu" thì quay về đúng chỗ đang soạn.
  function showIntro() {
    clearTimeout(saveTimer);
    store.set(DRAFT_KEY, state);
    App.intro(els.root, build);
  }

  function mount(root) {
    state = loadDraft();
    App.setTheme(state.th);
    builder = blankStep();
    editing = null;
    viewing = null;
    els = { root };
    // Lần đầu ghé trang soạn: hiện lời nhắn từ nhà sáng tạo trước.
    if (!store.get(INTRO_KEY, false)) {
      store.set(INTRO_KEY, true);
      App.intro(root, build);
      return;
    }
    build();
  }

  window.Composer = { mount };
})();
