// Bộ icon nguyên liệu: tối giản, có màu, có mặt cười nhỏ cho dễ thương.
// Mỗi icon là nội dung SVG trên khung 64x64.
(function () {
  const O = '#4A3B36';

  function face(x, y, s = 1) {
    const r = 1.7 * s;
    return (
      `<circle cx="${x - 5 * s}" cy="${y}" r="${r}" fill="${O}" stroke="none"/>` +
      `<circle cx="${x + 5 * s}" cy="${y}" r="${r}" fill="${O}" stroke="none"/>` +
      `<path d="M${x - 2.2 * s} ${y + 2.6 * s} q${2.2 * s} ${2.2 * s} ${4.4 * s} 0" fill="none" stroke-width="${1.8 * s}"/>` +
      `<ellipse cx="${x - 8.5 * s}" cy="${y + 3.2 * s}" rx="${2.4 * s}" ry="${1.4 * s}" fill="#F59A9A" stroke="none" opacity=".75"/>` +
      `<ellipse cx="${x + 8.5 * s}" cy="${y + 3.2 * s}" rx="${2.4 * s}" ry="${1.4 * s}" fill="#F59A9A" stroke="none" opacity=".75"/>`
    );
  }

  function bottle(body, cap, label) {
    return (
      `<rect x="26" y="5" width="12" height="7" rx="2" fill="${cap}"/>` +
      `<path d="M27 12 h10 v7 C37 22 46 24 46 32 V54 a4 4 0 0 1 -4 4 H22 a4 4 0 0 1 -4 -4 V32 C18 24 27 22 27 19Z" fill="${body}"/>` +
      `<rect x="22" y="34" width="20" height="16" rx="3" fill="${label}"/>` +
      face(32, 41, 0.6)
    );
  }

  function bowl(color, inner) {
    return (
      inner +
      `<path d="M8 34 h48 C56 48 46 56 32 56 C18 56 8 48 8 34Z" fill="${color}"/>` +
      face(32, 44, 0.8)
    );
  }

  function shaker(body, top) {
    return (
      `<path d="M20 22 C20 11 44 11 44 22Z" fill="${top}"/>` +
      `<path d="M20 22 h24 v30 a6 6 0 0 1 -6 6 h-12 a6 6 0 0 1 -6 -6z" fill="${body}"/>` +
      `<circle cx="28" cy="16" r="1.3" fill="${O}" stroke="none"/><circle cx="32" cy="14.5" r="1.3" fill="${O}" stroke="none"/><circle cx="36" cy="16" r="1.3" fill="${O}" stroke="none"/>` +
      face(32, 38, 0.75)
    );
  }

  // Không kế thừa Object.prototype: mã nguyên liệu lạ trong link (VD "constructor") không khớp nhầm.
  const I = Object.create(null);
  function add(key, name, cat, body) {
    I[key] = { key, name, cat, body };
  }

  // ---------- Rau củ ----------
  add('ca_chua', 'Cà chua', 'rau',
    `<circle cx="32" cy="37" r="19" fill="#EF6351"/>` +
    `<path d="M21 20 Q27 13 32 19 Q37 13 43 20 Q37 23 32 21 Q27 23 21 20Z" fill="#7BC47F"/><path d="M32 19 V11"/>` +
    face(32, 40));

  add('hanh_la', 'Hành lá', 'rau',
    `<rect x="20" y="6" width="8" height="38" rx="4" fill="#7BC47F"/>` +
    `<rect x="30" y="11" width="8" height="33" rx="4" fill="#9ED89B"/>` +
    `<rect x="40" y="8" width="8" height="36" rx="4" fill="#7BC47F"/>` +
    `<path d="M18 40 h30 v11 a6 6 0 0 1 -6 6 h-18 a6 6 0 0 1 -6 -6z" fill="#F6F2E6"/>` +
    `<path d="M27 57 v4 M33 57 v5 M39 57 v4" stroke-width="1.8"/>` +
    face(33, 47, 0.7));

  add('hanh_tim', 'Hành tím', 'rau',
    `<path d="M32 9 C33 17 50 22 51 38 C52 52 42 58 32 58 C22 58 12 52 13 38 C14 22 31 17 32 9Z" fill="#B57BB3"/>` +
    `<path d="M32 9 V4"/><path d="M25 24 C19 32 19 46 25 55 M39 24 C45 32 45 46 39 55" stroke-width="1.6" opacity=".5"/>` +
    face(32, 41, 0.85));

  add('toi', 'Tỏi', 'rau',
    `<path d="M32 9 C34 17 48 22 50 36 C52 50 42 57 32 57 C22 57 12 50 14 36 C16 22 30 17 32 9Z" fill="#F7F1E5"/>` +
    `<path d="M32 9 V4"/><path d="M24 26 C19 36 20 48 25 55 M40 26 C45 36 44 48 39 55" stroke-width="1.6" opacity=".45"/>` +
    face(32, 41, 0.85));

  add('ot', 'Ớt', 'rau',
    `<path d="M20 22 C34 20 50 30 50 54 C42 46 26 40 18 30 C16 26 17 23 20 22Z" fill="#E63946"/>` +
    `<path d="M19 23 C15 18 14 13 18 8" stroke="#4E8F4E" stroke-width="3"/>` +
    `<path d="M15 25 C17 19 24 19 26 22 C22 25 18 26 15 25Z" fill="#7BC47F"/>` +
    face(31, 31, 0.7));

  add('ca_rot', 'Cà rốt', 'rau',
    `<path d="M47 18 Q55 4 61 6 Q58 16 50 21Z" fill="#7BC47F"/><path d="M50 21 Q60 18 61 24 Q55 29 49 24Z" fill="#9ED89B"/>` +
    `<path d="M38 14 Q50 14 50 26 L16 55 Q10 58 8 55 Q6 52 11 46 Z" fill="#F4A259"/>` +
    `<path d="M19 44 l4 4 M25 39 l3 3" stroke-width="1.6"/>` +
    face(36, 28, 0.7));

  add('khoai_tay', 'Khoai tây', 'rau',
    `<path d="M14 34 C12 20 26 14 36 16 C50 18 54 30 50 42 C46 54 30 56 22 50 C16 46 15 40 14 34Z" fill="#D9A866"/>` +
    `<circle cx="22" cy="27" r="1.4" fill="#9C6B33" stroke="none"/><circle cx="44" cy="25" r="1.4" fill="#9C6B33" stroke="none"/><circle cx="41" cy="47" r="1.4" fill="#9C6B33" stroke="none"/>` +
    face(32, 36));

  add('bap_cai', 'Bắp cải', 'rau',
    `<circle cx="32" cy="34" r="22" fill="#9ACD6E"/><circle cx="32" cy="36" r="14" fill="#C8E89E"/>` +
    `<path d="M14 30 Q20 25 22 32 M50 30 Q44 25 42 32" stroke-width="1.6"/>` +
    face(32, 37, 0.85));

  add('rau_cai', 'Rau cải', 'rau',
    `<path d="M24 34 C13 26 15 7 32 5 C49 7 51 26 40 34Z" fill="#6CBF6C"/>` +
    `<path d="M24 32 h16 l-2 22 a4 4 0 0 1 -4 4 h-4 a4 4 0 0 1 -4 -4z" fill="#EAF5DC"/>` +
    face(32, 19, 0.85));

  add('nam', 'Nấm', 'rau',
    `<path d="M24 34 h16 v16 a6 6 0 0 1 -6 6 h-4 a6 6 0 0 1 -6 -6z" fill="#F6EAD6"/>` +
    `<path d="M9 34 C9 18 22 9 32 9 C42 9 55 18 55 34Z" fill="#C98B5B"/>` +
    `<circle cx="21" cy="22" r="3" fill="#F6EAD6" stroke="none"/><circle cx="43" cy="20" r="2.5" fill="#F6EAD6" stroke="none"/>` +
    face(32, 43, 0.6));

  add('dua_leo', 'Dưa leo', 'rau',
    `<path d="M14 46 C8 40 12 30 22 24 C32 18 44 12 52 16 C58 20 54 30 44 36 C34 42 22 52 14 46Z" fill="#79B85B"/>` +
    `<circle cx="20" cy="38" r="1.1" fill="#DDF0C8" stroke="none"/><circle cx="46" cy="22" r="1.1" fill="#DDF0C8" stroke="none"/><circle cx="40" cy="31" r="1.1" fill="#DDF0C8" stroke="none"/>` +
    face(31, 32, 0.75));

  add('bap', 'Bắp (ngô)', 'rau',
    `<path d="M32 8 C42 8 44 24 42 40 C40 50 36 54 32 54 C28 54 24 50 22 40 C20 24 22 8 32 8Z" fill="#FFD95A"/>` +
    `<path d="M22 34 C16 42 18 54 30 60 C26 50 26 42 28 36Z" fill="#7BC47F"/><path d="M42 34 C48 42 46 54 34 60 C38 50 38 42 36 36Z" fill="#9ED89B"/>` +
    face(32, 24, 0.75));

  add('gung', 'Gừng', 'rau',
    `<path d="M10 40 C8 32 16 30 20 32 C20 24 28 22 30 28 C32 20 42 20 42 28 C50 26 56 34 50 40 C54 46 46 52 40 48 C34 54 24 52 22 48 C14 52 8 46 10 40Z" fill="#E8C27A"/>` +
    face(32, 38, 0.8));

  add('sa', 'Sả', 'rau',
    `<rect x="21" y="8" width="7" height="46" rx="3.5" fill="#B9DB8A"/>` +
    `<rect x="29" y="5" width="7" height="49" rx="3.5" fill="#CDE6A6"/>` +
    `<rect x="37" y="9" width="7" height="45" rx="3.5" fill="#B9DB8A"/>` +
    `<path d="M19 40 h27 v13 a5 5 0 0 1 -5 5 h-17 a5 5 0 0 1 -5 -5z" fill="#F1E3EE"/>` +
    face(32, 47, 0.65));

  add('chanh', 'Chanh', 'rau',
    `<path d="M32 19 Q38 8 48 10 Q44 20 32 19Z" fill="#5FA85F"/>` +
    `<ellipse cx="32" cy="37" rx="20" ry="17" fill="#8FCB5A"/>` +
    face(32, 38));

  // ---------- Thịt, cá, trứng ----------
  add('trung', 'Trứng', 'dam',
    `<ellipse cx="32" cy="35" rx="17" ry="21" fill="#FFF6E0"/>` +
    face(32, 38));

  add('thit_heo', 'Thịt heo', 'dam',
    `<rect x="8" y="14" width="48" height="12" rx="6" fill="#FFF1EC"/>` +
    `<rect x="8" y="22" width="48" height="28" rx="8" fill="#F6A9A0"/>` +
    face(32, 35));

  add('thit_bo', 'Thịt bò', 'dam',
    `<path d="M12 24 C12 12 30 10 40 14 C54 18 56 34 50 44 C44 54 22 56 14 46 C10 40 12 32 12 24Z" fill="#D9534F"/>` +
    `<path d="M17 46 C25 53 42 52 47 43" stroke="#FBE3DD" stroke-width="3"/>` +
    face(32, 31));

  add('thit_ga', 'Thịt gà', 'dam',
    `<path d="M28 39 L15 52" stroke="${O}" stroke-width="8"/><path d="M28 39 L15 52" stroke="#FFF8EC" stroke-width="3.5"/>` +
    `<circle cx="11" cy="50" r="4" fill="#FFF8EC"/><circle cx="16" cy="56" r="4" fill="#FFF8EC"/>` +
    `<path d="M30 9 C44 7 55 18 53 30 C51 40 41 44 32 42 C24 40 18 32 20 22 C22 14 26 10 30 9Z" fill="#E9A85A"/>` +
    face(37, 25, 0.85));

  add('ca', 'Cá', 'dam',
    `<path d="M46 32 L58 21 L56 32 L58 43Z" fill="#5A9BD3"/>` +
    `<path d="M7 32 C15 18 38 16 48 32 C38 48 15 46 7 32Z" fill="#7DB6E3"/>` +
    `<path d="M29 24 Q33 32 29 40" stroke-width="1.6"/>` +
    `<circle cx="18" cy="30" r="2" fill="${O}" stroke="none"/>` +
    `<path d="M13 35 q2 2 4 0" stroke-width="1.6"/>` +
    `<ellipse cx="21" cy="36" rx="2.4" ry="1.4" fill="#F59A9A" stroke="none" opacity=".75"/>`);

  add('tom', 'Tôm', 'dam',
    `<path d="M44 17 C28 12 14 24 18 38 C20 46 27 50 33 48" stroke="${O}" stroke-width="15"/>` +
    `<path d="M44 17 C28 12 14 24 18 38 C20 46 27 50 33 48" stroke="#F59E6B" stroke-width="10"/>` +
    `<path d="M33 48 L45 41 L43 56Z" fill="#F59E6B"/>` +
    `<circle cx="46" cy="18" r="7" fill="#F59E6B"/>` +
    `<path d="M51 13 Q58 6 61 13 M52 16 Q57 19 60 23" stroke-width="1.5"/>` +
    `<path d="M23 21 l4 6 M17 31 l7 1 M20 42 l6 -3" stroke-width="1.6"/>` +
    `<circle cx="47" cy="16" r="1.6" fill="${O}" stroke="none"/>`);

  add('dau_phu', 'Đậu phụ', 'dam',
    `<path d="M12 24 L32 14 L52 24 L32 34Z" fill="#FFFBEF"/>` +
    `<path d="M12 24 V44 L32 54 V34Z" fill="#F3E6C4"/>` +
    `<path d="M52 24 V44 L32 54 V34Z" fill="#E9D7AA"/>` +
    face(22, 39, 0.6));

  // ---------- Gia vị ----------
  add('nuoc_mam', 'Nước mắm', 'gia_vi', bottle('#E7A64B', '#C0392B', '#FFF5E1'));
  add('nuoc_tuong', 'Nước tương', 'gia_vi', bottle('#7A4B2A', '#E74C3C', '#FFF5E1'));
  add('dau_an', 'Dầu ăn', 'gia_vi', bottle('#F7DC6F', '#7BC47F', '#FFFDF5'));
  add('muoi', 'Muối', 'gia_vi', shaker('#FFFFFF', '#B8D8F0'));
  add('tieu', 'Tiêu', 'gia_vi', shaker('#D9C7B3', '#7A6A60'));
  add('duong', 'Đường', 'gia_vi',
    `<rect x="14" y="20" width="36" height="36" rx="8" fill="#FDF6F0"/>` +
    `<rect x="12" y="13" width="40" height="9" rx="4.5" fill="#F7A1C4"/>` +
    `<rect x="20" y="45" width="7" height="7" rx="1.5" fill="#FFFFFF" stroke-width="1.6"/><rect x="37" y="45" width="7" height="7" rx="1.5" fill="#FFFFFF" stroke-width="1.6"/>` +
    face(32, 33, 0.85));
  add('hat_nem', 'Hạt nêm', 'gia_vi',
    `<path d="M16 14 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 V54 a4 4 0 0 1 -4 4 H20 a4 4 0 0 1 -4 -4Z" fill="#F4C542"/>` +
    `<rect x="16" y="40" width="32" height="8" fill="#E85D4A" stroke="none"/>` +
    face(32, 28, 0.75));

  // ---------- Khác ----------
  add('gao', 'Gạo / cơm', 'tinh_bot',
    bowl('#8EC5E8',
      `<path d="M12 35 C12 20 22 15 32 15 C42 15 52 20 52 35Z" fill="#FFFFFF"/>` +
      `<path d="M22 24 l2 -1 M30 20 l2 0 M40 25 l-2 -1 M34 28 l2 1" stroke-width="1.6"/>`));
  add('mi', 'Mì', 'tinh_bot',
    bowl('#F2A65A',
      `<path d="M40 6 L30 34 M48 9 L34 34" stroke-width="3"/>` +
      `<path d="M12 35 C12 24 22 20 32 20 C42 20 52 24 52 35Z" fill="#F7D774"/>` +
      `<path d="M16 32 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0 q3 -6 6 0" stroke-width="1.6"/>`));
  add('sua', 'Sữa', 'khac',
    `<path d="M18 22 L24 10 H40 L46 22Z" fill="#7DB6E3"/>` +
    `<rect x="18" y="22" width="28" height="36" rx="3" fill="#FFFFFF"/>` +
    `<path d="M18 48 h28" stroke-width="1.6"/>` +
    face(32, 35, 0.75));
  add('bo', 'Bơ', 'khac',
    `<path d="M10 30 L22 22 H54 L42 30Z" fill="#FFF0A8"/>` +
    `<path d="M42 30 L54 22 V40 L42 48Z" fill="#F0CC4A"/>` +
    `<rect x="10" y="30" width="32" height="18" fill="#FFE57A"/>` +
    face(26, 38, 0.65));
  add('bot_mi', 'Bột', 'khac',
    `<path d="M16 22 C16 15 22 13 24 10 H40 C42 13 48 15 48 22 V54 a4 4 0 0 1 -4 4 H20 a4 4 0 0 1 -4 -4Z" fill="#F7F0E3"/>` +
    `<path d="M23 15 h18" stroke-width="3"/>` +
    face(32, 37, 0.85));
  add('nuoc', 'Nước', 'khac',
    `<path d="M16 12 h32 l-4 42 a4 4 0 0 1 -4 4 H24 a4 4 0 0 1 -4 -4Z" fill="#EAF6FD"/>` +
    `<path d="M18.6 26 h26.8 l-2.6 28 a2.5 2.5 0 0 1 -2.5 2.5 H23.7 a2.5 2.5 0 0 1 -2.5 -2.5Z" fill="#9FD3F2" stroke="none"/>` +
    face(32, 40, 0.75));

  // ---------- Làm bánh ----------
  add('long_do', 'Lòng đỏ trứng', 'banh',
    `<circle cx="32" cy="33" r="13" fill="#FFB627"/>` +
    `<path d="M10 38 h44 C54 52 44 58 32 58 C20 58 10 52 10 38Z" fill="#8EC5E8"/>` +
    face(32, 31, 0.7));
  add('long_trang', 'Lòng trắng trứng', 'banh',
    `<path d="M15 39 a8 8 0 0 1 6 -13 a11 11 0 0 1 21 -3 a9 9 0 0 1 8 16z" fill="#FFFFFF"/>` +
    `<path d="M10 38 h44 C54 52 44 58 32 58 C20 58 10 52 10 38Z" fill="#F2CC8F"/>` +
    face(32, 30, 0.7));
  add('mascarpone', 'Mascarpone', 'banh',
    `<path d="M14 26 h36 l-4 28 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4z" fill="#FFF8EC"/>` +
    `<rect x="12" y="19" width="40" height="9" rx="4" fill="#9FD3F2"/>` +
    face(32, 42, 0.75));
  add('kem_tuoi', 'Kem tươi', 'banh',
    `<path d="M18 22 L24 10 H40 L46 22Z" fill="#F7A1C4"/>` +
    `<rect x="18" y="22" width="28" height="36" rx="3" fill="#FFFFFF"/>` +
    `<path d="M18 48 h28" stroke-width="1.6"/>` +
    face(32, 35, 0.75));
  add('pho_mai', 'Phô mai', 'banh',
    `<path d="M8 36 L46 20 L56 30 V50 H8Z" fill="#FFD95A"/>` +
    `<path d="M8 36 H56" stroke-width="2"/>` +
    `<circle cx="18" cy="44" r="2.6" fill="#F2B632" stroke="none"/><circle cx="48" cy="42" r="2.2" fill="#F2B632" stroke="none"/>` +
    face(32, 42, 0.7));
  add('banh_quy', 'Bánh quy', 'banh',
    `<rect x="10" y="18" width="44" height="14" rx="7" fill="#E8C27A"/>` +
    `<rect x="10" y="36" width="44" height="16" rx="8" fill="#F0D08F"/>` +
    `<circle cx="20" cy="25" r="1.2" fill="#fff" stroke="none"/><circle cx="32" cy="24" r="1.2" fill="#fff" stroke="none"/><circle cx="44" cy="25" r="1.2" fill="#fff" stroke="none"/>` +
    face(32, 43, 0.65));
  add('ca_phe', 'Cà phê', 'banh',
    `<path d="M26 8 q-4 5 0 10 M36 8 q-4 5 0 10" stroke-width="2"/>` +
    `<ellipse cx="32" cy="54" rx="24" ry="5" fill="#E8D4C2"/>` +
    `<path d="M48 30 h4 a6 6 0 0 1 0 12 h-5" stroke-width="3"/>` +
    `<path d="M14 22 h36 v18 a14 14 0 0 1 -14 14 h-8 a14 14 0 0 1 -14 -14z" fill="#FFFFFF"/>` +
    `<path d="M16 26 h32" stroke="#7A4B2A" stroke-width="4"/>` +
    face(32, 38, 0.7));
  add('cacao', 'Bột cacao', 'banh',
    `<rect x="16" y="18" width="32" height="40" rx="6" fill="#7A4B2A"/>` +
    `<rect x="14" y="12" width="36" height="8" rx="3" fill="#C98B5B"/>` +
    `<circle cx="32" cy="38" r="11" fill="#FFF5E1"/>` +
    face(32, 37, 0.6));
  add('socola', 'Sô-cô-la', 'banh',
    `<rect x="14" y="10" width="36" height="46" rx="4" fill="#6B4226"/>` +
    `<path d="M26 10 V34 M38 10 V34 M14 22 H50" stroke="#8B5E3C" stroke-width="2"/>` +
    `<path d="M14 34 h36 v18 a4 4 0 0 1 -4 4 h-28 a4 4 0 0 1 -4 -4z" fill="#E85D4A"/>` +
    face(32, 44, 0.7));
  add('men_no', 'Bột nở / men', 'banh',
    `<path d="M16 14 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 V54 a4 4 0 0 1 -4 4 H20 a4 4 0 0 1 -4 -4Z" fill="#9FD3F2"/>` +
    `<rect x="16" y="40" width="32" height="8" fill="#FFD166" stroke="none"/>` +
    face(32, 28, 0.75));
  add('vani', 'Vani', 'banh', bottle('#5B3A29', '#F2CC8F', '#FFF5E1'));

  // =================== Bếp Việt ===================
  function jar(body, lid, extra = '') {
    return (
      `<rect x="16" y="20" width="32" height="36" rx="7" fill="${body}"/>` +
      `<rect x="14" y="14" width="36" height="8" rx="4" fill="${lid}"/>` + extra +
      `<rect x="21" y="32" width="22" height="16" rx="4" fill="#FFF5E1"/>` +
      face(32, 39, 0.6)
    );
  }
  function packet(fill, band, extra = '') {
    return (
      `<path d="M16 14 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 V54 a4 4 0 0 1 -4 4 H20 a4 4 0 0 1 -4 -4Z" fill="${fill}"/>` +
      `<rect x="16" y="40" width="32" height="8" fill="${band}" stroke="none"/>` + extra +
      face(32, 28, 0.75)
    );
  }
  // Bó rau thơm: 3 cọng tỏa ra, lá theo kiểu (oval, hẹp, tròn, kép, mũi tên), buộc dây đỏ.
  function herb(color, kind, stem = '#4E8F4E', withFace = true) {
    const leaf = (x, y, a, s) => {
      if (kind === 'round') {
        return [[-4, 0], [4, 0], [0, -6]].map(([dx, dy]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${5 * s}" fill="${color}"/>`).join('');
      }
      if (kind === 'double') {
        return `<ellipse cx="${x}" cy="${y - 7 * s}" rx="${5 * s}" ry="${7 * s}" transform="rotate(${a} ${x} ${y})" fill="${color}"/>` +
          `<ellipse cx="${x}" cy="${y + 5 * s}" rx="${4 * s}" ry="${6 * s}" transform="rotate(${a} ${x} ${y})" fill="${color}"/>`;
      }
      if (kind === 'arrow') {
        return `<path d="M${x} ${y - 12 * s} L${x + 6 * s} ${y + 6 * s} L${x} ${y + 2 * s} L${x - 6 * s} ${y + 6 * s}Z" transform="rotate(${a} ${x} ${y})" fill="${color}"/>`;
      }
      const [rx, ry] = kind === 'narrow' ? [3.6, 11] : [7, 10.5];
      return `<ellipse cx="${x}" cy="${y}" rx="${rx * s}" ry="${ry * s}" transform="rotate(${a} ${x} ${y})" fill="${color}"/>`;
    };
    const pts = [[23, 35, -55, 0.75], [41, 35, 55, 0.75], [18, 22, -35, 1], [46, 22, 35, 1], [32, 15, 0, 1]];
    return (
      `<path d="M32 58 L18 22 M32 58 L32 15 M32 58 L46 22" stroke="${stem}" stroke-width="2.6"/>` +
      pts.map(([x, y, a, s]) => leaf(x, y, a, s)).join('') +
      `<path d="M26 49 h12" stroke="#E63946" stroke-width="4"/>` +
      (withFace && kind !== 'narrow' ? face(32, 16, 0.42) : '')
    );
  }

  // ---------- Gia vị Việt ----------
  add('bot_ngot', 'Bột ngọt', 'gia_vi', packet('#FFFFFF', '#4E9BD6', '<path d="M26 50 l2 2 M34 51 l2 -2" stroke-width="1.4"/>'));
  add('dau_hao', 'Dầu hào', 'gia_vi', bottle('#5B3A29', '#E85D4A', '#FFD166'));
  add('tuong_ot', 'Tương ớt', 'gia_vi', bottle('#E63946', '#7BC47F', '#FFF5E1'));
  add('sa_te', 'Sa tế', 'gia_vi', jar('#C9302C', '#F2CC8F', '<circle cx="22" cy="52" r="1.6" fill="#FFD166" stroke="none"/><circle cx="42" cy="51" r="1.6" fill="#FFD166" stroke="none"/>'));
  add('mam_tom', 'Mắm tôm', 'gia_vi', jar('#B48CB5', '#E07A5F'));
  add('mam_ruoc', 'Mắm ruốc', 'gia_vi', jar('#D98B8B', '#81B29A'));
  add('giam', 'Giấm', 'gia_vi', bottle('#EAF6FD', '#81B29A', '#FFFFFF'));
  add('me', 'Me', 'gia_vi',
    `<path d="M10 22 C18 14 30 26 38 20 C46 14 54 22 52 28 C44 34 34 26 26 32 C18 38 8 30 10 22Z" fill="#9C6B33"/>` +
    `<path d="M14 40 C22 34 32 44 40 40 C48 36 56 42 52 48 C44 54 34 46 26 52 C18 56 10 48 14 40Z" fill="#B07A43"/>` +
    face(32, 45, 0.6));
  add('nuoc_mau', 'Nước màu', 'gia_vi',
    bowl('#F2CC8F', `<path d="M12 35 C14 26 50 26 52 35Z" fill="#7A4B2A"/><path d="M24 30 q3 -2 6 0" stroke="#C98B5B" stroke-width="1.6"/>`));
  add('ngu_vi', 'Ngũ vị hương', 'gia_vi', jar('#C98B5B', '#5B3A29'));
  add('que', 'Quế', 'gia_vi',
    `<rect x="8" y="18" width="48" height="12" rx="6" fill="#B5713A"/>` +
    `<rect x="8" y="34" width="48" height="12" rx="6" fill="#C98B5B"/>` +
    `<path d="M14 24 a3 3 0 1 1 0.1 0 M14 40 a3 3 0 1 1 0.1 0" stroke-width="1.6"/>` +
    face(36, 39, 0.6));
  add('hoa_hoi', 'Hoa hồi', 'gia_vi',
    `<path d="M32 6 L37 24 L54 16 L42 30 L58 38 L40 38 L42 56 L32 42 L22 56 L24 38 L6 38 L22 30 L10 16 L27 24Z" fill="#8B5A33"/>` +
    `<circle cx="32" cy="32" r="9" fill="#B07A43"/>` +
    face(32, 31, 0.55));
  add('thao_qua', 'Thảo quả', 'gia_vi',
    `<ellipse cx="24" cy="34" rx="12" ry="18" transform="rotate(-15 24 34)" fill="#5B3A29"/>` +
    `<ellipse cx="42" cy="34" rx="11" ry="17" transform="rotate(15 42 34)" fill="#7A4B2A"/>` +
    `<path d="M42 20 v28 M24 20 v28" stroke="#9C6B33" stroke-width="1.4"/>` +
    face(42, 36, 0.55));
  add('duong_phen', 'Đường phèn', 'gia_vi',
    `<path d="M10 40 L20 26 L34 30 L30 48 L14 50Z" fill="#FCE7B8"/>` +
    `<path d="M30 30 L44 18 L56 30 L50 50 L32 48Z" fill="#FFF3D6"/>` +
    face(43, 35, 0.6));
  add('bot_nghe', 'Bột nghệ', 'gia_vi', jar('#F4B400', '#E85D4A'));
  add('dau_dieu', 'Dầu điều', 'gia_vi', bottle('#E8562A', '#F2CC8F', '#FFF5E1'));
  add('me_rang', 'Mè rang', 'gia_vi',
    bowl('#8EC5E8', `<path d="M12 35 C12 24 52 24 52 35Z" fill="#F3E3C3"/>` +
      [[20, 30], [27, 27], [34, 29], [41, 27], [46, 31], [30, 32]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2.2" fill="#B07A43" stroke="none"/>`).join('')));
  add('dau_phong', 'Đậu phộng rang', 'gia_vi',
    `<path d="M12 22 C12 12 28 12 28 22 C28 26 26 28 26 32 C26 36 30 38 30 44 C30 56 10 56 10 44 C10 38 14 36 14 32 C14 28 12 26 12 22Z" fill="#E3B57A"/>` +
    `<path d="M36 26 C36 16 52 16 52 26 C52 30 50 32 50 36 C50 40 54 42 54 48 C54 60 34 60 34 48 C34 42 38 40 38 36 C38 32 36 30 36 26Z" fill="#D9A866"/>` +
    face(44, 46, 0.55));
  add('hanh_phi', 'Hành phi', 'gia_vi',
    bowl('#F2CC8F', `<path d="M12 35 C12 24 52 24 52 35Z" fill="#C98B5B"/><path d="M18 30 q4 -4 8 0 M28 28 q4 -4 8 0 M38 30 q4 -4 8 0" stroke="#8B5E3C" stroke-width="1.6"/>`));
  add('nuoc_cot_dua', 'Nước cốt dừa', 'gia_vi',
    `<path d="M6 30 h52 C58 48 46 58 32 58 C18 58 6 48 6 30Z" fill="#8B5E3C"/>` +
    `<path d="M11 30 h42 C53 44 44 52 32 52 C20 52 11 44 11 30Z" fill="#FFFFFF" stroke="none"/>` +
    `<ellipse cx="32" cy="30" rx="26" ry="5" fill="#FFFDF5"/>` +
    face(32, 42, 0.7));

  // ---------- Rau thơm ----------
  add('rau_ram', 'Rau răm', 'rau_thom', herb('#5FA85F', 'narrow', '#8E5BA8'));
  add('ngo_ri', 'Ngò rí', 'rau_thom', herb('#7BC47F', 'round'));
  add('ngo_gai', 'Ngò gai', 'rau_thom',
    [-40, -20, 0, 20, 40].map((a, k) => `<ellipse cx="32" cy="30" rx="4.5" ry="20" transform="rotate(${a} 32 54)" fill="${k % 2 ? '#5FA85F' : '#4E8F4E'}"/>`).join('') +
    `<path d="M26 50 h12" stroke="#E63946" stroke-width="4"/>` + face(32, 22, 0.45));
  add('hung_que', 'Húng quế', 'rau_thom', herb('#5FA85F', 'oval', '#8E5BA8'));
  add('tia_to', 'Tía tô', 'rau_thom', herb('#9B6BB5', 'oval', '#6B4E7A'));
  add('kinh_gioi', 'Kinh giới', 'rau_thom', herb('#9ED89B', 'oval'));
  add('thi_la', 'Thì là', 'rau_thom',
    `<path d="M32 58 L20 16 M32 58 L32 10 M32 58 L44 16" stroke="#5FA85F" stroke-width="2.4"/>` +
    [[20, 16], [32, 10], [44, 16]].map(([x, y]) => [0, 8, 16, 24].map((d) =>
      `<path d="M${x + (32 - x) * d / 48} ${y + d} l-6 -5 M${x + (32 - x) * d / 48} ${y + d} l6 -5" stroke="#7BC47F" stroke-width="2"/>`).join('')).join('') +
    `<path d="M26 50 h12" stroke="#E63946" stroke-width="4"/>`);
  add('la_chanh', 'Lá chanh', 'rau_thom', herb('#3F7A3F', 'double'));
  add('la_lot', 'Lá lốt', 'rau_thom',
    `<path d="M32 56 V62" stroke="#4E8F4E" stroke-width="3"/>` +
    `<path d="M32 56 C14 48 6 30 14 18 C20 10 30 12 32 20 C34 12 44 10 50 18 C58 30 50 48 32 56Z" fill="#5FA85F"/>` +
    `<path d="M32 22 V52 M32 34 l-10 -6 M32 34 l10 -6 M32 44 l-9 -5 M32 44 l9 -5" stroke="#3F7A3F" stroke-width="1.4"/>` +
    face(32, 28, 0.6));
  add('he', 'Hẹ', 'rau_thom',
    [18, 24, 30, 36, 42].map((x, k) => `<rect x="${x}" y="${6 + (k % 2) * 6}" width="5" height="${44 - (k % 2) * 6}" rx="2.5" fill="${k % 2 ? '#7BC47F' : '#5FA85F'}"/>`).join('') +
    `<path d="M16 48 h32" stroke="#E63946" stroke-width="4"/>` + `<path d="M20 52 v6 M28 52 v7 M36 52 v7 M44 52 v6" stroke="#F6F2E6" stroke-width="3"/>`);
  add('gia_do', 'Giá đỗ', 'rau_thom',
    [[14, 0], [24, 4], [34, -2], [44, 3], [52, -1]].map(([x, d]) =>
      `<path d="M${x} ${54 + d} C${x - 6} ${40 + d} ${x + 8} ${26 + d} ${x} ${16 + d}" stroke="#F6F2E6" stroke-width="5"/>` +
      `<path d="M${x} ${54 + d} C${x - 6} ${40 + d} ${x + 8} ${26 + d} ${x} ${16 + d}" stroke="${O}" stroke-width="1" opacity=".35"/>` +
      `<ellipse cx="${x}" cy="${14 + d}" rx="4" ry="3.2" fill="#FFD95A"/>`).join(''));
  add('rau_muong', 'Rau muống', 'rau_thom', herb('#5FA85F', 'arrow', '#9ED89B'));
  add('bi_do', 'Bí đỏ', 'rau',
    `<path d="M32 16 V8 l5 -2" stroke="#4E8F4E" stroke-width="3"/>` +
    `<ellipse cx="22" cy="38" rx="14" ry="18" fill="#F4A259"/><ellipse cx="42" cy="38" rx="14" ry="18" fill="#F4A259"/>` +
    `<ellipse cx="32" cy="38" rx="11" ry="19" fill="#F7B26F"/>` +
    face(32, 40, 0.75));
  add('kho_qua', 'Khổ qua', 'rau',
    `<path d="M52 12 l4 -4" stroke="#4E8F4E" stroke-width="3"/>` +
    `<path d="M50 14 C58 22 44 44 30 54 C22 60 10 58 10 50 C10 40 28 24 40 14 C44 10 48 10 50 14Z" fill="#7BC47F"/>` +
    [[22, 44], [30, 36], [38, 28], [44, 20], [18, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#B5DD84" stroke="none"/>`).join('') +
    face(32, 42, 0.6));
  add('dau_bap', 'Đậu bắp', 'rau',
    `<path d="M44 10 h10 v8 h-10z" fill="#4E8F4E"/>` +
    `<path d="M46 18 C48 30 34 50 14 58 C24 46 34 32 40 18Z" fill="#7BC47F"/>` +
    `<path d="M43 20 C38 34 30 46 18 55" stroke="#4E8F4E" stroke-width="1.4"/>` +
    face(36, 32, 0.55));

  // ---------- Thịt, hải sản Việt ----------
  add('ba_chi', 'Thịt ba chỉ', 'dam',
    `<rect x="8" y="12" width="48" height="40" rx="8" fill="#F6A9A0"/>` +
    `<rect x="8" y="12" width="48" height="8" rx="4" fill="#E3B07F"/>` +
    `<path d="M9 28 h46 M9 38 h46" stroke="#FFF1EC" stroke-width="4"/>` +
    face(32, 45, 0.7));
  add('suon', 'Sườn', 'dam',
    `<rect x="4" y="20" width="10" height="7" rx="3.5" fill="#FFF8EC"/><rect x="4" y="33" width="10" height="7" rx="3.5" fill="#FFF8EC"/><rect x="4" y="46" width="10" height="7" rx="3.5" fill="#FFF8EC"/>` +
    `<rect x="12" y="14" width="46" height="44" rx="10" fill="#D9534F"/>` +
    `<path d="M14 30 h30 M14 43 h30" stroke="#FBE3DD" stroke-width="2"/>` +
    face(38, 36, 0.75));
  add('muc', 'Mực', 'dam',
    `<path d="M22 40 C18 50 14 54 10 58 M28 42 C26 52 24 56 22 60 M36 42 C38 52 40 56 42 60 M42 40 C46 50 50 54 54 58" stroke="#E8A0A0" stroke-width="4"/>` +
    `<path d="M32 4 C44 12 46 30 44 42 H20 C18 30 20 12 32 4Z" fill="#F6D5D5"/>` +
    `<path d="M20 14 l-8 4 l8 6 M44 14 l8 4 l-8 6" fill="#F6D5D5"/>` +
    face(32, 32, 0.7));
  add('ngheu', 'Nghêu, sò', 'dam',
    `<path d="M8 40 C8 22 20 12 32 12 C44 12 56 22 56 40 C48 46 16 46 8 40Z" fill="#EADFC8"/>` +
    `<path d="M32 14 V44 M20 18 C22 28 22 38 22 44 M44 18 C42 28 42 38 42 44" stroke="#C8B59A" stroke-width="1.6"/>` +
    `<path d="M24 44 h16 l-2 6 h-12z" fill="#D9C7B3"/>` +
    face(32, 32, 0.6));
  add('cua', 'Cua', 'dam',
    `<path d="M14 38 l-8 6 M14 44 l-7 8 M50 38 l8 6 M50 44 l7 8" stroke-width="3"/>` +
    `<path d="M16 26 C8 18 8 10 16 8 C18 14 22 16 24 22Z" fill="#E85D4A"/><path d="M48 26 C56 18 56 10 48 8 C46 14 42 16 40 22Z" fill="#E85D4A"/>` +
    `<ellipse cx="32" cy="38" rx="20" ry="14" fill="#EF6351"/>` +
    face(32, 37, 0.8));
  add('gio_lua', 'Giò lụa', 'dam',
    `<rect x="6" y="20" width="40" height="28" rx="6" fill="#6CBF6C"/>` +
    `<path d="M14 20 v28 M24 20 v28 M34 20 v28" stroke="#4E8F4E" stroke-width="1.4"/>` +
    `<ellipse cx="46" cy="34" rx="12" ry="14" fill="#F3D9D2"/>` +
    face(46, 33, 0.6));

  // ---------- Tinh bột: bún, phở, gạo ----------
  add('bun', 'Bún', 'tinh_bot',
    bowl('#8EC5E8', `<path d="M12 35 C12 24 22 20 32 20 C42 20 52 24 52 35Z" fill="#FFFFFF"/>` +
      `<path d="M16 32 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 M20 26 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0" stroke-width="1.2" opacity=".55"/>`));
  add('banh_pho', 'Bánh phở', 'tinh_bot',
    `<rect x="8" y="40" width="48" height="12" rx="5" fill="#FFFDF5"/>` +
    `<rect x="10" y="29" width="44" height="12" rx="5" fill="#FFFFFF"/>` +
    `<rect x="12" y="18" width="40" height="12" rx="5" fill="#FFFDF5"/>` +
    `<path d="M18 24 h28 M16 35 h32" stroke-width="1.2" opacity=".4"/>` +
    face(32, 46, 0.55));
  add('mien', 'Miến', 'tinh_bot',
    `<path d="M14 14 C20 24 12 36 18 50 M22 12 C28 24 20 36 26 52 M30 12 C36 24 28 36 34 52 M38 12 C44 24 36 36 42 52 M46 14 C52 24 44 36 50 50" stroke="#B9DCEF" stroke-width="3"/>` +
    `<rect x="12" y="28" width="40" height="10" rx="5" fill="#F7A1C4"/>` +
    face(32, 33, 0.5));
  add('banh_trang', 'Bánh tráng', 'tinh_bot',
    `<circle cx="32" cy="32" r="24" fill="#FFF8EC"/>` +
    `<path d="M16 20 L48 44 M16 44 L48 20 M10 32 H54 M32 8 V56" stroke="#E8D4C2" stroke-width="1.4"/>` +
    `<circle cx="32" cy="32" r="11" fill="#FFF8EC" stroke="none"/>` +
    face(32, 31, 0.65));
  add('banh_mi', 'Bánh mì', 'tinh_bot',
    `<path d="M6 40 C6 26 36 14 52 18 C60 20 60 30 54 36 C44 46 14 54 8 48 C6 46 6 43 6 40Z" fill="#E9A85A"/>` +
    `<path d="M20 30 l6 8 M30 26 l6 8 M40 22 l6 8" stroke="#F7D18F" stroke-width="3"/>` +
    face(26, 42, 0.55));
  add('gao_nep', 'Gạo nếp', 'tinh_bot',
    `<path d="M4 44 C14 30 50 30 60 44 L52 52 H12Z" fill="#7BC47F"/>` +
    bowl('#FFFFFF', `<path d="M12 35 C12 20 22 14 32 14 C42 14 52 20 52 35Z" fill="#FFFDF5"/><path d="M22 24 l2 -1 M30 20 l2 0 M40 25 l-2 -1" stroke-width="1.6"/>`));
  add('bot_nang', 'Bột năng', 'tinh_bot', packet('#FFFFFF', '#81B29A'));
  add('bot_chien', 'Bột chiên giòn', 'tinh_bot', packet('#F7D774', '#E85D4A'));

  const CATS = [
    { key: 'gia_vi', name: 'Gia vị' },
    { key: 'rau', name: 'Rau củ' },
    { key: 'rau_thom', name: 'Rau thơm' },
    { key: 'dam', name: 'Thịt, cá, trứng' },
    { key: 'tinh_bot', name: 'Bún, phở, gạo' },
    { key: 'banh', name: 'Làm bánh' },
    { key: 'khac', name: 'Khác' },
  ];

  function iconSVG(key, cls = '') {
    const ic = I[key];
    if (!ic) return '';
    return `<svg class="ing-icon ${cls}" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${ic.body}</g></svg>`;
  }

  window.Icons = { list: I, cats: CATS, svg: iconSVG, OUTLINE: O };
})();
