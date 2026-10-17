// Căn bếp: các vị trí nấu, hành động và hình minh họa SVG.
(function () {
  const O = '#4A3B36';

  const STATIONS = {
    thot: {
      name: 'Thớt', cx: 130, top: 248,
      actions: { thai_lat: 'Thái lát', thai_hat_luu: 'Thái hạt lựu', thai_soi: 'Thái sợi', cat_khuc: 'Cắt khúc', bam: 'Băm nhỏ', dap: 'Đập dập', got_vo: 'Gọt vỏ', so_che: 'Sơ chế' },
    },
    to: {
      name: 'Tô', cx: 280, top: 222,
      actions: { rua: 'Rửa sạch', ngam: 'Ngâm', uop: 'Ướp', tron: 'Trộn đều', danh_tan: 'Đánh tan', pha: 'Pha' },
    },
    dia: {
      name: 'Đĩa', cx: 385, top: 252,
      actions: { bay: 'Bày ra đĩa', rac: 'Rắc lên trên', an: 'Thưởng thức' },
    },
    chao: {
      name: 'Chảo', cx: 530, top: 216, heat: true,
      actions: { lam_nong: 'Làm nóng dầu', phi: 'Phi thơm', xao: 'Xào', chien: 'Chiên', ap_chao: 'Áp chảo', dao: 'Đảo đều', nem: 'Nêm nếm' },
    },
    noi: {
      name: 'Nồi', cx: 700, top: 148, heat: true,
      actions: { dun_soi: 'Đun sôi', luoc: 'Luộc', nau: 'Nấu', ham: 'Hầm', kho: 'Kho', nem: 'Nêm nếm' },
    },
  };

  const HEAT = ['Không dùng lửa', 'Lửa nhỏ', 'Lửa vừa', 'Lửa lớn'];

  let uid = 0;

  function flames(cx, level) {
    if (!level) return '';
    const n = [0, 3, 5, 7][level];
    const hgt = [0, 8, 11, 14][level];
    let s = '<g class="flames">';
    for (let k = 0; k < n; k++) {
      const x = cx - 36 + (72 * (k + 0.5)) / n;
      s +=
        `<path style="animation-delay:${(k % 3) * 0.15}s" d="M${x} 253 q-6 -${hgt * 0.45} 0 -${hgt} q6 ${hgt * 0.55} 0 ${hgt}z" fill="#FF9F43" stroke="none"/>` +
        `<path style="animation-delay:${(k % 3) * 0.15}s" d="M${x} 253 q-3 -${hgt * 0.3} 0 -${hgt * 0.55} q3 ${hgt * 0.3} 0 ${hgt * 0.55}z" fill="#FFD166" stroke="none"/>`;
    }
    return s + '</g>';
  }

  function steam(cx, y) {
    let s = '<g class="steam" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".85">';
    [-18, 0, 18].forEach((dx, k) => {
      s += `<path style="animation-delay:${k * 0.4}s" d="M${cx + dx} ${y} q-7 -9 0 -18 q7 -9 0 -18"/>`;
    });
    return s + '</g>';
  }

  // items: [{vb, inner}] hình nguyên liệu hiển thị phía trên vị trí đang dùng.
  // Chef đứng sau quầy, cạnh chỗ đang làm (không che bong bóng nguyên liệu).
  function chefLayer(chef, active) {
    if (!chef) return '';
    const st = STATIONS[active];
    let x = 400;
    if (st) x = st.cx < 400 ? st.cx + 135 : st.cx - 135;
    return `<g class="chef-wrap" transform="translate(${x - 60} 92)">${Chef.inner(chef.c, chef.mood)}</g>`;
  }

  function scene({ active = null, heat = 0, items = [], interactive = false, chef = null } = {}) {
    const id = 'k' + ++uid;
    const st = STATIONS[active];
    const hasHeat = st && st.heat && heat > 0;
    const stAttr = (key) =>
      `class="station${key === active ? ' active' : ''}" data-station="${key}"` +
      (interactive ? ` role="button" tabindex="0" aria-label="${L.station(key)}"` : '');

    let glow = '';
    if (st) {
      const w = { thot: 96, to: 64, dia: 66, chao: 78, noi: 66 }[active];
      glow = `<ellipse class="glow" cx="${st.cx}" cy="262" rx="${w}" ry="9" fill="#FFD166" opacity=".7"/>`;
    }

    let bubble = '';
    if (st && items.length) {
      const shown = items.slice(0, 4);
      const size = 46, gap = 6;
      const w = shown.length * (size + gap) + gap + 6;
      const hgt = size + 14;
      let x = Math.max(8, Math.min(792 - w, st.cx - w / 2));
      const y = Math.max(24, st.top - hgt - 18);
      const tipX = Math.max(x + 14, Math.min(x + w - 14, st.cx));
      bubble =
        `<g class="bubble">` +
        `<path d="M${tipX - 9} ${y + hgt - 1} L${tipX} ${y + hgt + 11} L${tipX + 9} ${y + hgt - 1}Z" fill="#FFFFFF" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="16" fill="#FFFFFF" stroke="${O}" stroke-width="2.5"/>` +
        `<rect x="${tipX - 8}" y="${y + hgt - 4}" width="16" height="5" fill="#FFFFFF"/>` +
        shown.map((it, k) =>
          `<svg x="${x + gap + 3 + k * (size + gap)}" y="${y + 7}" width="${size}" height="${size}" viewBox="${it.vb}">${it.inner}</svg>`
        ).join('') +
        (items.length > 4 ? `<text x="${x + w - 4}" y="${y + hgt - 4}" text-anchor="end" font-size="13" font-weight="800" fill="${O}">+${items.length - 4}</text>` : '') +
        `</g>`;
    }

    return `
<svg class="kitchen-svg" viewBox="0 18 800 322" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.t('kitchen.aria')}">
  <defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFC98B"/><stop offset="1" stop-color="#FFE6BF"/>
    </linearGradient>
    <pattern id="${id}tile" width="28" height="28" patternUnits="userSpaceOnUse">
      <rect width="28" height="28" fill="#F8D9BF"/>
      <path d="M28 0 V28 H0" fill="none" stroke="#F1C8A8" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="800" height="340" fill="#FCEBDB"/>
  <rect y="150" width="800" height="112" fill="url(#${id}tile)"/>

  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <!-- cửa sổ -->
    <rect x="300" y="26" width="200" height="110" rx="8" fill="#C98B5B"/>
    <rect x="311" y="37" width="178" height="88" rx="4" fill="url(#${id}sky)"/>
    <circle cx="452" cy="62" r="13" fill="#FFF4D6" stroke="none"/>
    <path d="M400 37 V125 M311 81 H489" stroke="#C98B5B" stroke-width="6"/>
    <path d="M282 18 H518" stroke="#8B5E3C" stroke-width="4"/>
    <path d="M288 20 h44 q-10 60 -28 122 h-16z" fill="#E9967A"/>
    <path d="M512 20 h-44 q10 60 28 122 h16z" fill="#E9967A"/>
    <rect x="292" y="136" width="216" height="9" rx="3" fill="#C98B5B"/>
    <path d="M342 136 l-4 -16 h20 l-4 16z" fill="#E07A5F"/>
    <path d="M348 120 q-12 -10 -8 -22 q10 6 8 22 q2 -16 14 -20 q2 12 -14 20" fill="#81B29A"/>

    <!-- kệ -->
    <rect x="40" y="110" width="200" height="8" rx="3" fill="#C98B5B"/>
    <rect x="56" y="78" width="30" height="32" rx="7" fill="#FDF6F0"/><rect x="54" y="72" width="34" height="8" rx="3" fill="#E07A5F"/>
    <rect x="100" y="86" width="26" height="24" rx="6" fill="#FFF0C2"/><rect x="98" y="80" width="30" height="7" rx="3" fill="#81B29A"/>
    <rect x="140" y="72" width="30" height="38" rx="7" fill="#E8F3EE"/><rect x="138" y="66" width="34" height="8" rx="3" fill="#F2CC8F"/>
    <path d="M196 110 l-4 -18 h26 l-4 18z" fill="#F2CC8F"/>
    <path d="M205 92 q-16 -6 -16 -22 q14 2 16 22 q0 -18 14 -26 q6 16 -14 26" fill="#81B29A"/>

    <!-- đèn -->
    <path d="M680 0 V40" stroke-width="2.5"/>
  </g>
  <circle cx="680" cy="74" r="58" fill="#FFE8A3" opacity=".3"/>
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round">
    <path d="M650 70 L664 40 H696 L710 70Z" fill="#F2CC8F"/>
    <circle cx="680" cy="74" r="6" fill="#FFF4C2"/>
  </g>

  ${chefLayer(chef, active)}
  ${glow}

  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <!-- tủ bếp -->
    <rect x="-4" y="276" width="808" height="70" fill="#C98B5B"/>
    <rect x="22" y="288" width="180" height="44" rx="5" fill="#D59A69"/>
    <rect x="214" y="288" width="210" height="44" rx="5" fill="#D59A69"/>
    <path d="M190 304 v12 M226 304 v12" stroke-width="3.5"/>
    <rect x="450" y="284" width="322" height="52" rx="6" fill="#6B5B57"/>
    <rect x="474" y="306" width="274" height="24" rx="4" fill="#8C7B76"/>
    <circle cx="500" cy="295" r="4.5" fill="#F2CC8F"/><circle cx="560" cy="295" r="4.5" fill="#F2CC8F"/>
    <circle cx="662" cy="295" r="4.5" fill="#F2CC8F"/><circle cx="722" cy="295" r="4.5" fill="#F2CC8F"/>
    <rect x="-4" y="262" width="808" height="14" fill="#E3B07F"/>
    <!-- bếp -->
    <rect x="452" y="254" width="318" height="8" rx="2" fill="#4A3B36"/>
    <path d="M490 238 V254 M570 238 V254 M660 238 V254 M740 238 V254" stroke-width="4"/>
  </g>

  ${hasHeat ? flames(st.cx, heat) : ''}

  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <g ${stAttr('thot')}>
      <rect x="50" y="248" width="160" height="14" rx="5" fill="#E2A86B"/>
      <circle cx="196" cy="255" r="3" fill="#FCEBDB" stroke-width="2"/>
      <rect class="hit" x="40" y="200" width="180" height="62" fill="transparent" stroke="none"/>
    </g>
    <g ${stAttr('to')}>
      <path d="M232 222 h96 C328 250 306 262 280 262 C254 262 232 250 232 222Z" fill="#8EC5E8"/>
      <path d="M244 238 h72" stroke-width="2" stroke-dasharray="1 9"/>
      <rect class="hit" x="226" y="196" width="108" height="66" fill="transparent" stroke="none"/>
    </g>
    <g ${stAttr('dia')}>
      <path d="M335 255 h100 q-6 7 -16 7 h-68 q-10 0 -16 -7z" fill="#FFFFFF"/>
      <rect class="hit" x="330" y="210" width="110" height="52" fill="transparent" stroke="none"/>
    </g>
    <g ${stAttr('chao')}>
      <path d="M590 224 L628 212" stroke-width="10"/><path d="M590 224 L628 212" stroke="#8B5E3C" stroke-width="5"/>
      <path d="M470 220 h120 q-4 18 -20 18 h-80 q-16 0 -20 -18z" fill="#5C5470"/>
      <path d="M470 220 h120" stroke-width="4"/>
      <rect class="hit" x="464" y="180" width="168" height="74" fill="transparent" stroke="none"/>
    </g>
    <g ${stAttr('noi')}>
      <rect x="636" y="182" width="16" height="9" rx="4" fill="#C9604A"/>
      <rect x="748" y="182" width="16" height="9" rx="4" fill="#C9604A"/>
      <path d="M650 170 h100 v56 q0 12 -12 12 h-76 q-12 0 -12 -12z" fill="#E07A5F"/>
      <path d="M644 170 q56 -26 112 0z" fill="#EB9C86"/>
      <circle cx="700" cy="153" r="5" fill="${O}"/>
      <rect class="hit" x="630" y="130" width="140" height="124" fill="transparent" stroke="none"/>
    </g>
  </g>

  ${hasHeat ? steam(st.cx, active === 'noi' ? 140 : 206) : ''}
  ${bubble}
</svg>`;
  }

  window.Kitchen = { STATIONS, HEAT, scene };
})();
