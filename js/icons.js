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
  add('gao', 'Gạo / cơm', 'khac',
    bowl('#8EC5E8',
      `<path d="M12 35 C12 20 22 15 32 15 C42 15 52 20 52 35Z" fill="#FFFFFF"/>` +
      `<path d="M22 24 l2 -1 M30 20 l2 0 M40 25 l-2 -1 M34 28 l2 1" stroke-width="1.6"/>`));
  add('mi', 'Mì / bún', 'khac',
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

  const CATS = [
    { key: 'rau', name: 'Rau củ' },
    { key: 'dam', name: 'Thịt, cá, trứng' },
    { key: 'gia_vi', name: 'Gia vị' },
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
