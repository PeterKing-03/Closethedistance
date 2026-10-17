// Nhân vật Chef: người dùng tự chọn nam/nữ, da, tóc, mũ, tạp dề.
// Dữ liệu gọn: c = [da, kiểu tóc, màu tóc, mũ, kiểu tạp dề, màu tạp dề, nhân vật (0 nam, 1 nữ)].
(function () {
  const O = '#4A3B36';

  const GENDERS = ['Nam', 'Nữ'];
  const SKIN = [['#FDE3CF', 'Rất sáng'], ['#F6CBA5', 'Sáng'], ['#E3A982', 'Trung bình'], ['#C68863', 'Ngăm'], ['#8D5A3B', 'Nâu']];
  const HAIR_M = ['Ngắn', 'Xoăn', 'Đầu đinh', 'Vuốt dựng'];
  const HAIR_F = ['Bob', 'Xoăn dài', 'Dài', 'Búi'];
  const HAIR_COLORS = [['#2E2320', 'Đen'], ['#5B3A29', 'Nâu đậm'], ['#A0673E', 'Nâu'], ['#E3B65B', 'Vàng'], ['#C9563C', 'Đỏ']];
  const HATS = ['Mũ Chef', 'Mũ nồi', 'Khăn bandana', 'Không đội'];
  const APRONS = ['Tạp dề yếm', 'Tạp dề ngang hông', 'Áo bếp màu'];
  const APRON_COLORS = [['#E07A5F', 'Cam đất'], ['#81B29A', 'Xanh lá'], ['#5B8DB8', 'Xanh dương'], ['#F2CC8F', 'Vàng'], ['#3F2E2A', 'Nâu đen']];
  const LIMITS = [SKIN.length, 4, HAIR_COLORS.length, HATS.length, APRONS.length, APRON_COLORS.length, GENDERS.length];
  const DEFAULT = [1, 0, 0, 0, 0, 0, 0];

  function sanitize(c) {
    if (!Array.isArray(c)) return DEFAULT.slice();
    return LIMITS.map((n, i) => {
      const v = c[i] | 0;
      return v >= 0 && v < n ? v : DEFAULT[i];
    });
  }

  // Cắt thái, chiên xào, lửa lớn: Chef nghiêm túc nhắc nhở.
  function moodFor(step) {
    if (!step || !step.s) return 'happy';
    if (step.s === 'thot') return 'serious';
    if (step.s === 'chao' && step.a && step.a !== 'nem') return 'serious';
    if (step.h === 3) return 'serious';
    return 'happy';
  }
  function careFor(step) {
    if (moodFor(step) !== 'serious') return '';
    if (step.s === 'thot') return L.t('care.thot');
    if (step.s === 'chao') return L.t('care.chao');
    return L.t('care.heat');
  }

  function face(mood, female) {
    const blush = (op) =>
      `<ellipse cx="41" cy="89" rx="5" ry="3" fill="#F59A9A" stroke="none" opacity="${op}"/>` +
      `<ellipse cx="79" cy="89" rx="5" ry="3" fill="#F59A9A" stroke="none" opacity="${op}"/>`;
    // Lông mi cho Chef nữ, lông mày đậm cho Chef nam.
    const lashes = female ? `<path d="M46.2 78.6 l-2.8 -1 M73.8 78.6 l2.8 -1" stroke-width="1.7"/>` : '';
    if (mood === 'serious') {
      return (
        `<path d="M42 71 L55 75 M78 71 L65 75" stroke-width="${female ? 2.6 : 3.6}"/>` +
        `<circle cx="49" cy="81" r="3.2" fill="${O}" stroke="none"/><circle cx="71" cy="81" r="3.2" fill="${O}" stroke="none"/>` +
        (female ? `<path d="M44.5 79 l-3.5 -2 M75.5 79 l3.5 -2" stroke-width="2"/>` : '') +
        `<path d="M53 94 Q60 90.5 67 94" stroke-width="2.6"/>`
      );
    }
    const brows = female ? '' : `<path d="M43 71.5 Q49 68.5 55 71.5 M65 71.5 Q71 68.5 77 71.5" stroke-width="3.2"/>`;
    if (mood === 'love') {
      return (
        brows +
        `<path d="M45 82 Q49 75 53 82 M67 82 Q71 75 75 82" stroke-width="2.8"/>` + lashes +
        `<path d="M51 89 Q60 101 69 89Z" fill="#C9604A" stroke-width="2.4"/>` + blush(female ? 0.85 : 0.5) +
        `<path class="chef-heart" d="M100 44s-8-4.8-8-10a4.4 4.4 0 0 1 8-2.4 4.4 4.4 0 0 1 8 2.4c0 5.2-8 10-8 10z" fill="#E07A5F" stroke-width="2"/>`
      );
    }
    return (
      brows +
      `<circle cx="49" cy="80" r="3.2" fill="${O}" stroke="none"/><circle cx="71" cy="80" r="3.2" fill="${O}" stroke="none"/>` +
      `<circle cx="50.2" cy="78.8" r="1" fill="#fff" stroke="none"/><circle cx="72.2" cy="78.8" r="1" fill="#fff" stroke="none"/>` +
      lashes +
      `<path d="M52 90 Q60 97 68 90" stroke-width="2.6"/>` + blush(female ? 0.85 : 0.45)
    );
  }

  function head(skin, female) {
    if (female) return `<circle cx="60" cy="78" r="30" fill="${skin}"/>`;
    // Chef nam: cằm vuông hơn.
    return `<path d="M30 72 C30 52 44 45 60 45 C76 45 90 52 90 72 L89 90 C87 102 76 108 60 108 C44 108 33 102 31 90 Z" fill="${skin}"/>`;
  }

  function hairBack(style, col, female) {
    if (!female) return '';
    if (style === 0) return `<path d="M28 80 C26 52 42 44 60 44 C78 44 94 52 92 80 L93 104 Q86 110 78 106 L42 106 Q34 110 27 104Z" fill="${col}"/>`;
    if (style === 1) {
      return `<path d="M26 80 C24 50 42 42 60 42 C78 42 96 50 94 80 L94 120 L26 120Z" fill="${col}"/>` +
        [[26, 92], [24, 108], [28, 122], [94, 92], [96, 108], [92, 122]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${col}"/>`).join('');
    }
    if (style === 2) return `<path d="M28 78 C26 50 42 42 60 42 C78 42 94 50 92 78 L97 126 Q60 134 23 126Z" fill="${col}"/>`;
    return `<circle cx="60" cy="38" r="11" fill="${col}"/>`;
  }

  function curls(list, col) {
    return list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`).join('');
  }

  function hairFront(style, col, female) {
    if (female) {
      if (style === 0) return `<path d="M30 78 C30 54 44 46 60 46 C76 46 90 54 90 78 C84 66 72 62 58 64 C46 64 36 70 30 78Z" fill="${col}"/>`;
      if (style === 1) {
        return curls([[32, 74, 9], [36, 60, 10], [46, 50, 11], [60, 46, 11], [74, 50, 11], [84, 60, 10], [88, 74, 9]], col) +
          `<path d="M30 72 C40 62 80 62 90 72 C84 54 36 54 30 72Z" fill="${col}" stroke="none"/>`;
      }
      if (style === 3) return `<path d="M29 78 C28 54 44 44 60 44 C76 44 92 54 91 78 C84 62 72 58 60 58 C48 58 36 62 29 78Z" fill="${col}"/>`;
      return `<path d="M29 80 C27 52 44 42 62 43 C80 44 93 56 91 80 C86 68 78 62 66 60 C60 66 46 68 29 80Z" fill="${col}"/>`;
    }
    if (style === 1) {
      return curls([[34, 66, 8], [41, 55, 9], [53, 48, 9], [67, 48, 9], [79, 55, 9], [86, 66, 8]], col) +
        `<path d="M32 68 C42 58 78 58 88 68 C82 52 38 52 32 68Z" fill="${col}" stroke="none"/>`;
    }
    if (style === 2) return `<path d="M31 72 C31 52 44 45 60 45 C76 45 89 52 89 72 C80 62 70 59 60 59 C50 59 40 62 31 72Z" fill="${col}"/>`;
    if (style === 3) return `<path d="M30 76 C28 56 38 46 48 44 C50 34 64 28 78 34 C72 36 70 40 72 42 C84 46 92 58 90 76 C86 66 78 60 68 60 C56 62 42 64 30 76Z" fill="${col}"/>`;
    return `<path d="M30 78 C28 54 44 43 62 44 C80 45 92 56 90 78 L88 70 C84 62 76 58 68 58 C58 62 44 62 34 64 L32 80Z" fill="${col}"/>`;
  }

  function hat(kind) {
    if (kind === 0) {
      return (
        `<path d="M36 47 C22 43 22 23 38 23 C38 9 56 3 62 13 C70 3 92 9 86 25 C100 27 100 45 84 47Z" fill="#FFFFFF"/>` +
        `<path d="M50 28 V44 M62 20 V44 M74 28 V44" stroke-width="1.6" opacity=".45"/>` +
        `<rect x="32" y="43" width="56" height="15" rx="5" fill="#FFFFFF"/>`
      );
    }
    if (kind === 1) {
      return (
        `<path d="M25 55 C25 37 50 30 66 32 C84 34 97 42 95 53 C86 58 40 60 25 55Z" fill="#C9563C"/>` +
        `<circle cx="64" cy="30" r="3.2" fill="#C9563C"/>`
      );
    }
    if (kind === 2) {
      return (
        `<path d="M88 61 l13 -7 l-2 13z" fill="#5B8DB8"/><path d="M88 63 l11 9 l-13 2z" fill="#5B8DB8"/>` +
        `<path d="M30 67 C30 46 44 40 60 40 C78 40 90 48 90 67 C76 60 44 60 30 67Z" fill="#5B8DB8"/>` +
        `<circle cx="46" cy="52" r="1.8" fill="#fff" stroke="none"/><circle cx="60" cy="47" r="1.8" fill="#fff" stroke="none"/><circle cx="74" cy="52" r="1.8" fill="#fff" stroke="none"/><circle cx="53" cy="58" r="1.6" fill="#fff" stroke="none"/><circle cx="67" cy="58" r="1.6" fill="#fff" stroke="none"/>`
      );
    }
    return '';
  }

  function body(apron, col, skin, mood, female) {
    const jacket = apron === 2 ? col : '#FFFFFF';
    const btn = apron === 2 ? '#FFFFFF' : O;
    // Chef nam vai rộng hơn.
    const torso = female
      ? 'M14 176 C14 134 28 114 60 114 C92 114 106 134 106 176Z'
      : 'M8 176 C8 130 24 112 60 112 C96 112 112 130 112 176Z';
    let s =
      `<rect x="${female ? 51 : 50}" y="100" width="${female ? 18 : 20}" height="18" fill="${skin}"/>` +
      `<path d="${torso}" fill="${jacket}"/>` +
      `<path d="M47 114 L60 126 L73 114" stroke-width="2.4"/>`;
    if (apron === 0) {
      s += `<path d="M42 129 L50 115 M78 129 L70 115" stroke-width="2.4"/>` +
        `<path d="M42 129 h36 v47 h-36z" fill="${col}"/>` +
        `<path d="M51 150 h18 v12 h-18z" stroke-width="1.8"/>`;
    } else {
      [134, 148].forEach((y) => {
        s += `<circle cx="51" cy="${y}" r="2.4" fill="${btn}" stroke="none"/><circle cx="69" cy="${y}" r="2.4" fill="${btn}" stroke="none"/>`;
      });
      if (apron === 1) s += `<path d="M${female ? 16 : 11} 160 h${female ? 88 : 98} v16 h-${female ? 88 : 98}z" fill="${col}"/><path d="M60 160 l-6 -6 M60 160 l6 -6" stroke-width="2.2"/>`;
    }
    if (mood === 'serious') {
      // Giơ ngón tay nhắc nhở.
      s += `<path d="M94 132 Q112 132 111 100" stroke="${O}" stroke-width="16"/>` +
        `<path d="M94 132 Q112 132 111 100" stroke="${jacket}" stroke-width="10.5"/>` +
        `<rect x="107" y="74" width="7" height="18" rx="3.5" fill="${skin}"/>` +
        `<circle cx="111" cy="95" r="7.5" fill="${skin}"/>`;
    }
    return s;
  }

  // Nội dung SVG trên khung 120 x 176.
  function inner(c, mood = 'happy') {
    const [sk, hs, hc, ht, ap, apc, g] = sanitize(c);
    const female = g === 1;
    const skin = SKIN[sk][0], hair = HAIR_COLORS[hc][0], apronCol = APRON_COLORS[apc][0];
    return (
      `<g class="chef chef-${mood}" fill="none" stroke="${O}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">` +
      hairBack(hs, hair, female) +
      body(ap, apronCol, skin, mood, female) +
      `<circle cx="30" cy="83" r="6" fill="${skin}"/><circle cx="90" cy="83" r="6" fill="${skin}"/>` +
      head(skin, female) +
      hairFront(hs, hair, female) +
      hat(ht) +
      face(mood, female) +
      `</g>`
    );
  }

  function svg(c, mood = 'happy', cls = '') {
    return `<svg class="chef-svg ${cls}" viewBox="0 0 120 176" aria-hidden="true">${inner(c, mood)}</svg>`;
  }

  window.Chef = {
    GENDERS, SKIN, HAIR_M, HAIR_F, HAIR_COLORS, HATS, APRONS, APRON_COLORS, DEFAULT,
    sanitize, moodFor, careFor, inner, svg,
  };
})();
