// Căn bếp: bộ dụng cụ (sơ chế, nấu, làm bánh), hành động và hình minh họa SVG.
// Người dùng chọn dụng cụ nào có trên bếp; căn bếp tự rộng ra theo số dụng cụ.
(function () {
  const O = '#4A3B36';
  const COUNTER = 262;   // mặt quầy
  const GRATE = 238;     // dụng cụ đặt trên bếp ga nằm trên kiềng
  const SCENE_H = 322;   // chiều cao khung nhìn (y từ 18 đến 340)

  // Kích thước theo cùng một tỉ lệ (khoảng 3 đơn vị = 1 cm) để dụng cụ cân đối với nhau.
  // w, h: khung bao; body: bề rộng thân (để đặt bếp ga, lửa); cx: tâm thân tính từ mép trái.
  // stove: đặt trên bếp ga (có lửa); temp: có nhiệt độ °C; appliance: đồ điện, sáng đèn khi dùng.
  const TOOLS = Object.create(null);
  function tool(key, def) { TOOLS[key] = Object.assign({ key, cx: def.w / 2, body: def.w }, def); }

  // ---------- Sơ chế ----------
  tool('thot', {
    name: 'Thớt', cat: 'prep', w: 130, h: 17,
    actions: { thai_lat: 'Thái lát', thai_hat_luu: 'Thái hạt lựu', thai_soi: 'Thái sợi', cat_khuc: 'Cắt khúc', bam: 'Băm nhỏ', dap: 'Đập dập', got_vo: 'Gọt vỏ', so_che: 'Sơ chế' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 10}" width="130" height="10" rx="4" fill="#E2A86B"/>` +
      `<circle cx="${x + 120}" cy="${b - 5}" r="2.4" fill="#FCEBDB" stroke-width="2"/>` +
      `<rect x="${x + 8}" y="${b - 17}" width="16" height="6" rx="2" fill="#6B4226" stroke-width="2"/>` +
      `<path d="M${x + 24} ${b - 17} h48 q10 0 12 6 h-60z" fill="#E6ECF0" stroke-width="2"/>`,
  });
  tool('coi', {
    name: 'Cối giã', cat: 'prep', w: 50, h: 50, cx: 22, body: 44,
    actions: { gia: 'Giã nhuyễn', gia_dap: 'Giã dập' },
    draw: (x, b) =>
      `<path d="M${x + 30} ${b - 24} L${x + 44} ${b - 48}" stroke="${O}" stroke-width="10"/>` +
      `<path d="M${x + 30} ${b - 24} L${x + 44} ${b - 48}" stroke="#D9C7B3" stroke-width="5"/>` +
      `<path d="M${x} ${b - 28} h44 C${x + 44} ${b - 6} ${x + 36} ${b} ${x + 22} ${b} C${x + 8} ${b} ${x} ${b - 6} ${x} ${b - 28}Z" fill="#B7A99A"/>`,
  });
  tool('to', {
    name: 'Tô trộn', cat: 'prep', w: 84, h: 36,
    actions: { rua: 'Rửa sạch', ngam: 'Ngâm', uop: 'Ướp', tron: 'Trộn đều', danh_tan: 'Đánh tan', pha: 'Pha', nhao: 'Nhào bột' },
    draw: (x, b) =>
      `<path d="M${x} ${b - 36} h84 C${x + 84} ${b - 10} ${x + 66} ${b} ${x + 42} ${b} C${x + 18} ${b} ${x} ${b - 10} ${x} ${b - 36}Z" fill="#8EC5E8"/>` +
      `<path d="M${x + 10} ${b - 22} h64" stroke-width="2" stroke-dasharray="1 9"/>`,
  });
  tool('ro', {
    name: 'Rổ', cat: 'prep', w: 92, h: 32, cx: 46, body: 80,
    actions: { rua: 'Rửa sạch', de_rao: 'Để ráo', nhat: 'Nhặt rau' },
    draw: (x, b) => {
      let s = `<path d="M${x} ${b - 30} h10 M${x + 82} ${b - 30} h10" stroke-width="4"/>` +
        `<path d="M${x + 6} ${b - 30} h80 C${x + 86} ${b - 8} ${x + 70} ${b - 2} ${x + 46} ${b - 2} C${x + 22} ${b - 2} ${x + 6} ${b - 8} ${x + 6} ${b - 30}Z" fill="#F2CC8F"/>`;
      [[b - 22, [20, 32, 46, 60, 72]], [b - 12, [28, 40, 52, 64]]].forEach(([y, xs]) => {
        xs.forEach((dx) => { s += `<circle cx="${x + dx}" cy="${y}" r="1.7" fill="${O}" stroke="none"/>`; });
      });
      return s;
    },
  });
  tool('dia', {
    name: 'Đĩa', cat: 'prep', w: 80, h: 7,
    actions: { bay: 'Bày ra đĩa', rac: 'Rắc lên trên', an: 'Thưởng thức' },
    draw: (x, b) => `<path d="M${x} ${b - 7} h80 q-5 7 -14 7 h-52 q-9 0 -14 -7z" fill="#FFFFFF"/>`,
  });
  tool('can', {
    name: 'Cân', cat: 'prep', w: 56, h: 17,
    actions: { can: 'Cân' },
    draw: (x, b) =>
      `<rect x="${x + 4}" y="${b - 17}" width="48" height="5" rx="2" fill="#E3E9EE"/>` +
      `<rect x="${x}" y="${b - 12}" width="56" height="12" rx="4" fill="#FFFFFF"/>` +
      `<rect x="${x + 18}" y="${b - 9}" width="20" height="6" rx="2" fill="#9FD3F2" stroke-width="1.6"/>`,
  });
  tool('may_xay', {
    name: 'Máy xay', cat: 'prep', w: 60, h: 120, cx: 27, body: 54, appliance: true,
    actions: { xay: 'Xay nhuyễn', xay_sinh_to: 'Xay sinh tố' },
    draw: (x, b, on) =>
      `<path d="M${x + 50} ${b - 100} h8 v44 h-10" stroke-width="4"/>` +
      `<path d="M${x + 8} ${b - 30} L${x + 3} ${b - 108} h48 L${x + 46} ${b - 30}Z" fill="#EAF6FD"/>` +
      `<path d="M${x + 6.5} ${b - 62} h41 L${x + 45} ${b - 31} h-36Z" fill="#F7A1C4" opacity=".65" stroke="none"/>` +
      `<rect x="${x}" y="${b - 120}" width="54" height="13" rx="5" fill="#5C5470"/>` +
      `<rect x="${x}" y="${b - 31}" width="54" height="31" rx="7" fill="#E07A5F"/>` +
      `<circle cx="${x + 27}" cy="${b - 15}" r="5.5" fill="${on ? '#FFD166' : '#FFF4D6'}"/>`,
  });

  // ---------- Nấu (bếp ga và đồ điện) ----------
  tool('chao', {
    name: 'Chảo', cat: 'cook', w: 134, h: 26, cx: 42, body: 84, stove: true,
    actions: { lam_nong: 'Làm nóng dầu', phi: 'Phi thơm', xao: 'Xào', chien: 'Chiên', ap_chao: 'Áp chảo', dao: 'Đảo đều', nem: 'Nêm nếm' },
    draw: (x, b) =>
      `<path d="M${x + 82} ${b - 14} L${x + 132} ${b - 26}" stroke="${O}" stroke-width="9"/>` +
      `<path d="M${x + 82} ${b - 14} L${x + 132} ${b - 26}" stroke="#8B5E3C" stroke-width="4.5"/>` +
      `<path d="M${x} ${b - 18} h84 q-3 18 -18 18 h-48 q-15 0 -18 -18z" fill="#5C5470"/>` +
      `<path d="M${x} ${b - 18} h84" stroke-width="4"/>`,
  });
  tool('noi', {
    name: 'Nồi', cat: 'cook', w: 100, h: 74, body: 76, stove: true,
    actions: { dun_soi: 'Đun sôi', luoc: 'Luộc', nau: 'Nấu', ham: 'Hầm', kho: 'Kho', nem: 'Nêm nếm' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 46}" width="14" height="8" rx="4" fill="#C9604A"/>` +
      `<rect x="${x + 86}" y="${b - 46}" width="14" height="8" rx="4" fill="#C9604A"/>` +
      `<path d="M${x + 12} ${b - 56} h76 v46 q0 10 -10 10 h-56 q-10 0 -10 -10z" fill="#E07A5F"/>` +
      `<path d="M${x + 7} ${b - 56} q43 -22 86 0z" fill="#EB9C86"/>` +
      `<circle cx="${x + 50}" cy="${b - 70}" r="4" fill="${O}"/>`,
  });
  tool('xung_hap', {
    name: 'Xửng hấp', cat: 'cook', w: 84, h: 70, stove: true,
    actions: { hap: 'Hấp' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 28}" width="84" height="28" rx="4" fill="#E8C27A"/>` +
      `<rect x="${x}" y="${b - 54}" width="84" height="27" rx="4" fill="#EDD08F"/>` +
      `<path d="M${x + 6} ${b - 14} h72 M${x + 6} ${b - 40} h72" stroke-width="1.6" opacity=".5"/>` +
      `<path d="M${x + 2} ${b - 54} q40 -22 80 0z" fill="#F3DCA5"/>` +
      `<circle cx="${x + 42}" cy="${b - 66}" r="3.5" fill="#C98B5B"/>`,
  });
  tool('am_dun', {
    name: 'Ấm đun nước', cat: 'cook', w: 70, h: 58, cx: 36, body: 54, stove: true,
    actions: { dun_nuoc: 'Đun nước sôi', rot: 'Rót nước sôi' },
    draw: (x, b) =>
      `<path d="M${x + 14} ${b - 22} L${x + 1} ${b - 38} l5 -3 L${x + 18} ${b - 32}" fill="#81B29A"/>` +
      `<path d="M${x + 10} ${b} C${x + 4} ${b - 30} ${x + 16} ${b - 46} ${x + 36} ${b - 46} C${x + 56} ${b - 46} ${x + 68} ${b - 30} ${x + 62} ${b}Z" fill="#81B29A"/>` +
      `<path d="M${x + 22} ${b - 44} q14 -18 28 0" stroke-width="4"/>` +
      `<circle cx="${x + 36}" cy="${b - 47}" r="3" fill="${O}"/>`,
  });
  tool('noi_com', {
    name: 'Nồi cơm điện', cat: 'cook', w: 80, h: 66, appliance: true,
    actions: { nau_com: 'Nấu cơm', hap: 'Hấp', giu_am: 'Giữ ấm' },
    draw: (x, b, on) =>
      `<rect x="${x}" y="${b - 54}" width="80" height="54" rx="18" fill="#FDF6F0"/>` +
      `<path d="M${x + 5} ${b - 50} q35 -26 70 0z" fill="#F2CC8F"/>` +
      `<rect x="${x + 28}" y="${b - 26}" width="24" height="12" rx="4" fill="#E8D4C2"/>` +
      `<circle cx="${x + 40}" cy="${b - 20}" r="3" fill="${on ? '#7BC47F' : '#CFC3B8'}" stroke="none"/>`,
  });
  tool('noi_chien', {
    name: 'Nồi chiên không dầu', cat: 'cook', w: 80, h: 94, appliance: true, temp: true,
    actions: { chien_kd: 'Chiên không dầu', nuong: 'Nướng', lat: 'Lật mặt' },
    draw: (x, b, on) =>
      `<rect x="${x}" y="${b - 94}" width="80" height="94" rx="16" fill="#5C5470"/>` +
      `<rect x="${x + 20}" y="${b - 84}" width="40" height="16" rx="4" fill="#2E2A3A"/>` +
      `<circle cx="${x + 40}" cy="${b - 76}" r="3" fill="${on ? '#FFD166' : '#6F6787'}" stroke="none"/>` +
      `<rect x="${x + 10}" y="${b - 58}" width="60" height="44" rx="8" fill="#6F6787"/>` +
      `<rect x="${x + 28}" y="${b - 40}" width="24" height="7" rx="3.5" fill="#F2CC8F"/>`,
  });

  // ---------- Làm bánh ----------
  tool('ray', {
    name: 'Rây bột', cat: 'bake', w: 74, h: 30, cx: 27, body: 54,
    actions: { ray_bot: 'Rây bột' },
    draw: (x, b) =>
      `<path d="M${x + 52} ${b - 22} L${x + 72} ${b - 30}" stroke-width="5"/>` +
      `<path d="M${x} ${b - 26} h54 C${x + 54} ${b - 6} ${x + 42} ${b} ${x + 27} ${b} C${x + 12} ${b} ${x} ${b - 6} ${x} ${b - 26}Z" fill="#E3E9EE"/>` +
      `<path d="M${x + 8} ${b - 18} h38 M${x + 14} ${b - 10} h26 M${x + 18} ${b - 24} v20 M${x + 27} ${b - 24} v22 M${x + 36} ${b - 24} v20" stroke-width="1.2" opacity=".5"/>`,
  });
  tool('can_lan', {
    name: 'Cây cán bột', cat: 'bake', w: 124, h: 13,
    actions: { can_mong: 'Cán mỏng', cat_hinh: 'Cắt hình' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 10}" width="18" height="7" rx="3.5" fill="#C98B5B"/>` +
      `<rect x="${x + 106}" y="${b - 10}" width="18" height="7" rx="3.5" fill="#C98B5B"/>` +
      `<rect x="${x + 16}" y="${b - 13}" width="92" height="13" rx="6.5" fill="#E8C27A"/>`,
  });
  tool('tui_ban', {
    name: 'Túi bắt kem', cat: 'bake', w: 36, h: 68,
    actions: { bat_kem: 'Bắt kem', trang_tri: 'Trang trí' },
    draw: (x, b) =>
      `<path d="M${x + 4} ${b - 58} h28 L${x + 18} ${b - 12} Z" fill="#FFFFFF"/>` +
      `<path d="M${x + 4} ${b - 58} q14 -12 28 0z" fill="#F7A1C4"/>` +
      `<rect x="${x}" y="${b - 30}" width="36" height="30" rx="5" fill="#EAF6FD" opacity=".85"/>`,
  });
  tool('khuon', {
    name: 'Khuôn bánh', cat: 'bake', w: 70, h: 20,
    actions: { lot_giay: 'Lót giấy nến', do_khuon: 'Đổ vào khuôn', dan_deu: 'Dàn đều mặt', lay_banh: 'Lấy bánh ra khỏi khuôn' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 20}" width="70" height="20" rx="3" fill="#C8CDD3"/>` +
      `<path d="M${x + 4} ${b - 14} h62" stroke-width="1.6" opacity=".5"/>`,
  });
  tool('may_danh_trung', {
    name: 'Máy đánh trứng', cat: 'bake', w: 66, h: 70, cx: 44, body: 40, appliance: true,
    actions: { danh_bong: 'Đánh bông', danh_min: 'Đánh mịn', danh_tan: 'Đánh tan' },
    draw: (x, b, on) =>
      `<rect x="${x}" y="${b - 10}" width="66" height="10" rx="4" fill="#F59A9A"/>` +
      `<rect x="${x + 4}" y="${b - 62}" width="14" height="54" rx="5" fill="#F59A9A"/>` +
      `<path d="M${x + 26} ${b - 36} h36 C${x + 62} ${b - 14} ${x + 54} ${b - 10} ${x + 44} ${b - 10} C${x + 34} ${b - 10} ${x + 26} ${b - 14} ${x + 26} ${b - 36}Z" fill="#EAF6FD"/>` +
      `<path d="M${x + 44} ${b - 56} v22" stroke-width="3"/>` +
      `<path d="M${x + 2} ${b - 70} h48 q12 0 12 10 v6 h-60z" fill="#F59A9A"/>` +
      `<circle cx="${x + 10}" cy="${b - 62}" r="2.4" fill="${on ? '#FFD166' : '#FBE3DD'}" stroke="none"/>`,
  });
  tool('lo_nuong', {
    name: 'Lò nướng', cat: 'bake', w: 136, h: 92, appliance: true, temp: true,
    actions: { lam_nong_lo: 'Làm nóng lò', nuong_banh: 'Nướng bánh', nuong: 'Nướng' },
    draw: (x, b, on) =>
      `<path d="M${x + 12} ${b - 4} v4 M${x + 124} ${b - 4} v4" stroke-width="4"/>` +
      `<rect x="${x}" y="${b - 92}" width="136" height="88" rx="8" fill="#F3E3D3"/>` +
      `<rect x="${x + 10}" y="${b - 76}" width="92" height="58" rx="6" fill="${on ? '#FFB45C' : '#5C4B45'}"/>` +
      `<path d="M${x + 16} ${b - 40} h80" stroke="${on ? '#C9604A' : '#7A6A60'}" stroke-width="2"/>` +
      `<path d="M${x + 18} ${b - 84} h76" stroke-width="4"/>` +
      `<rect x="${x + 108}" y="${b - 84}" width="22" height="72" rx="4" fill="#E8D4C2"/>` +
      `<circle cx="${x + 119}" cy="${b - 70}" r="5" fill="#F2CC8F"/><circle cx="${x + 119}" cy="${b - 52}" r="5" fill="#F2CC8F"/>` +
      `<circle cx="${x + 119}" cy="${b - 32}" r="2.6" fill="${on ? '#E63946' : '#CFC3B8'}" stroke="none"/>`,
  });

  // ---------- Bếp Việt ----------
  tool('thot_tron', {
    name: 'Thớt gỗ tròn', cat: 'viet', w: 92, h: 30,
    actions: { chat: 'Chặt miếng', bam: 'Băm nhỏ', thai_lat: 'Thái lát', thai_hat_luu: 'Thái hạt lựu', dap: 'Đập dập', so_che: 'Sơ chế' },
    draw: (x, b) =>
      `<path d="M${x} ${b - 24} V${b - 5} a46 5 0 0 0 92 0 V${b - 24}Z" fill="#C98B5B"/>` +
      `<ellipse cx="${x + 46}" cy="${b - 24}" rx="46" ry="6" fill="#E8C27A"/>` +
      `<ellipse cx="${x + 46}" cy="${b - 24}" rx="28" ry="3.4" stroke-width="1.4" opacity=".5"/>` +
      `<path d="M${x + 12} ${b - 16} v6 M${x + 30} ${b - 14} v8 M${x + 62} ${b - 14} v8 M${x + 80} ${b - 16} v6" stroke-width="1.4" opacity=".45"/>`,
  });
  tool('dao_phay', {
    name: 'Dao phay', cat: 'viet', w: 74, h: 48, cx: 30, body: 50,
    actions: { chat: 'Chặt miếng', dap: 'Đập dập', thai_lat: 'Thái lát' },
    draw: (x, b) =>
      `<rect x="${x}" y="${b - 18}" width="56" height="18" rx="4" fill="#C98B5B"/>` +
      `<path d="M${x + 8} ${b - 16} L${x + 10} ${b - 46} H${x + 46} L${x + 48} ${b - 16}Z" fill="#E3E9EE"/>` +
      `<circle cx="${x + 40}" cy="${b - 38}" r="3" fill="#FCEBDB" stroke-width="2"/>` +
      `<rect x="${x + 46}" y="${b - 46}" width="28" height="9" rx="4" fill="#6B4226"/>`,
  });
  tool('ban_nao', {
    name: 'Bàn nạo', cat: 'viet', w: 34, h: 74, cx: 17, body: 30,
    actions: { nao_soi: 'Nạo sợi', got_vo: 'Gọt vỏ' },
    draw: (x, b) =>
      `<rect x="${x + 11}" y="${b - 74}" width="12" height="20" rx="6" fill="#81B29A"/>` +
      `<rect x="${x + 2}" y="${b - 56}" width="30" height="56" rx="5" fill="#E3E9EE"/>` +
      [12, 22, 32, 42].map((dy) => `<path d="M${x + 8} ${b - 56 + dy} h18" stroke-width="1.6" stroke-dasharray="3 3"/>`).join(''),
  });
  tool('ro_tre', {
    name: 'Rổ rá tre', cat: 'viet', w: 110, h: 18,
    actions: { nhat: 'Nhặt rau', de_rao: 'Để ráo', rua: 'Rửa sạch', phoi: 'Phơi' },
    draw: (x, b) =>
      `<path d="M${x} ${b - 12} h110 C${x + 104} ${b - 2} ${x + 88} ${b} ${x + 55} ${b} C${x + 22} ${b} ${x + 6} ${b - 2} ${x} ${b - 12}Z" fill="#E3C08A"/>` +
      `<ellipse cx="${x + 55}" cy="${b - 12}" rx="55" ry="6" fill="#F0D7A8"/>` +
      [14, 28, 42, 56, 70, 84, 98].map((dx) => `<path d="M${x + dx} ${b - 16} l5 8" stroke-width="1.2" opacity=".45"/>`).join(''),
  });
  tool('noi_dat', {
    name: 'Nồi đất (niêu, tộ)', cat: 'viet', w: 86, h: 54, stove: true,
    actions: { kho_to: 'Kho tộ', kho_quet: 'Kho quẹt', rim: 'Rim', om: 'Om', thang_mau: 'Thắng nước màu', nau_com: 'Nấu cơm niêu' },
    draw: (x, b) =>
      `<path d="M${x} ${b - 34} h8 M${x + 78} ${b - 34} h8" stroke-width="6"/>` +
      `<path d="M${x + 6} ${b - 40} h74 C${x + 84} ${b - 18} ${x + 72} ${b} ${x + 43} ${b} C${x + 14} ${b} ${x + 2} ${b - 18} ${x + 6} ${b - 40}Z" fill="#B5603A"/>` +
      `<path d="M${x + 10} ${b - 28} h66" stroke="#8E4528" stroke-width="2"/>` +
      `<path d="M${x + 4} ${b - 40} q39 -18 78 0z" fill="#C9744A"/>` +
      `<circle cx="${x + 43}" cy="${b - 50}" r="4" fill="#8E4528"/>`,
  });
  tool('noi_ap_suat', {
    name: 'Nồi áp suất', cat: 'viet', w: 120, h: 70, cx: 44, body: 80, stove: true,
    actions: { ham: 'Hầm', ham_xuong: 'Hầm xương', xa_hoi: 'Xả hơi' },
    draw: (x, b) =>
      `<path d="M${x + 82} ${b - 52} H${x + 118}" stroke="${O}" stroke-width="10"/><path d="M${x + 82} ${b - 52} H${x + 118}" stroke="#4A3B36" stroke-width="5"/>` +
      `<path d="M${x + 4} ${b - 50} h80 v40 q0 10 -10 10 h-60 q-10 0 -10 -10z" fill="#D8DEE3"/>` +
      `<path d="M${x} ${b - 52} q44 -20 88 0z" fill="#C8CDD3"/>` +
      `<rect x="${x + 39}" y="${b - 70}" width="10" height="10" rx="3" fill="#E63946"/>` +
      `<path d="M${x + 8} ${b - 36} h72" stroke-width="1.6" opacity=".5"/>`,
  });
  tool('noi_lau', {
    name: 'Nồi lẩu điện', cat: 'viet', w: 110, h: 48, appliance: true, fire: true,
    actions: { nau_lau: 'Nấu nước lẩu', nhung: 'Nhúng', nem: 'Nêm nếm' },
    draw: (x, b, on) =>
      `<rect x="${x + 8}" y="${b - 14}" width="94" height="14" rx="5" fill="#4A3B36"/>` +
      `<circle cx="${x + 55}" cy="${b - 7}" r="3" fill="${on ? '#E63946' : '#7A6A60'}" stroke="none"/>` +
      `<path d="M${x} ${b - 40} h110 C${x + 108} ${b - 20} ${x + 94} ${b - 14} ${x + 55} ${b - 14} C${x + 16} ${b - 14} ${x + 2} ${b - 20} ${x} ${b - 40}Z" fill="#E07A5F"/>` +
      `<ellipse cx="${x + 55}" cy="${b - 40}" rx="55" ry="6" fill="${on ? '#E8562A' : '#EB9C86'}"/>` +
      `<path d="M${x + 55} ${b - 46} v-2" stroke-width="2"/>`,
  });
  tool('bep_than', {
    name: 'Bếp than & vỉ nướng', cat: 'viet', w: 96, h: 56, fire: true,
    actions: { nuong_than: 'Nướng than', lat: 'Lật mặt', quet_mo: 'Quét mỡ hành' },
    draw: (x, b, on) =>
      `<path d="M${x + 6} ${b - 44} h84 l-8 44 h-68z" fill="#B5603A"/>` +
      `<rect x="${x + 30}" y="${b - 22}" width="36" height="12" rx="3" fill="${on ? '#FF9F43' : '#5C4B45'}"/>` +
      `<path d="M${x + 12} ${b - 44} h72" stroke="${on ? '#E8562A' : '#4A3B36'}" stroke-width="5"/>` +
      `<path d="M${x} ${b - 48} h96" stroke-width="3"/>` +
      [12, 26, 40, 54, 68, 82].map((dx) => `<path d="M${x + dx} ${b - 52} v8" stroke-width="2"/>`).join(''),
  });
  tool('dua_ca', {
    name: 'Đũa cả & vá', cat: 'viet', w: 44, h: 84, cx: 22, body: 36,
    actions: { dao: 'Đảo đều', xoi: 'Xới cơm', muc_canh: 'Múc canh' },
    draw: (x, b) =>
      `<path d="M${x + 12} ${b - 30} L${x + 6} ${b - 84} M${x + 18} ${b - 30} L${x + 14} ${b - 84}" stroke="#C98B5B" stroke-width="4"/>` +
      `<path d="M${x + 28} ${b - 30} L${x + 34} ${b - 72}" stroke="#8B5E3C" stroke-width="4"/>` +
      `<path d="M${x + 26} ${b - 74} a8 8 0 1 0 16 0z" fill="#C8CDD3"/>` +
      `<rect x="${x + 2}" y="${b - 34}" width="40" height="34" rx="6" fill="#81B29A"/>`,
  });
  tool('phin', {
    name: 'Phin cà phê', cat: 'viet', w: 44, h: 64,
    actions: { pha_phin: 'Pha cà phê phin', khuay: 'Khuấy đều' },
    draw: (x, b) =>
      `<path d="M${x + 6} ${b - 38} h32 l-3 34 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4z" fill="#EAF6FD"/>` +
      `<path d="M${x + 8} ${b - 16} h28 l-1 12 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4z" fill="#7A4B2A" stroke="none"/>` +
      `<path d="M${x} ${b - 40} h44" stroke-width="4"/>` +
      `<path d="M${x + 8} ${b - 40} V${b - 58} h28 V${b - 40}" fill="#C8CDD3"/>` +
      `<rect x="${x + 6}" y="${b - 64}" width="32" height="7" rx="3" fill="#D8DEE3"/>`,
  });

  // Thêm cách nấu kiểu Việt cho các dụng cụ có sẵn.
  Object.assign(TOOLS.thot.actions, { chat: 'Chặt miếng' });
  Object.assign(TOOLS.to.actions, { ngam_muoi: 'Ngâm nước muối loãng', khu_mui: 'Khử mùi (chanh, muối, gừng)', pha_nuoc_cham: 'Pha nước chấm', muoi_dua: 'Muối dưa' });
  Object.assign(TOOLS.dia.actions, { cuon: 'Cuốn' });
  Object.assign(TOOLS.chao.actions, { thang_mau: 'Thắng nước màu', trang: 'Tráng (trứng, bánh)' });
  Object.assign(TOOLS.noi.actions, { canh_chua: 'Nấu canh chua', chan: 'Chần / trụng', luoc_toi: 'Luộc chín tới' });
  Object.assign(TOOLS.xung_hap.actions, { u: 'Ủ (xôi)' });
  Object.assign(TOOLS.noi_com.actions, { u: 'Ủ (xôi)' });
  TOOLS.coi.name = 'Cối đá';

  const STATIONS = TOOLS;
  const CATS = ['viet', 'prep', 'cook', 'bake'];
  const CAT_NAMES = { viet: 'Bếp Việt', prep: 'Sơ chế', cook: 'Nấu', bake: 'Làm bánh' };
  // Thứ tự trên quầy: sơ chế bên trái, bếp ga ở giữa, đồ điện và lò bên phải.
  const ORDER = ['thot_tron', 'thot', 'dao_phay', 'ban_nao', 'coi', 'to', 'ro_tre', 'ro', 'dia', 'can', 'ray', 'can_lan', 'tui_ban', 'khuon',
    'chao', 'noi', 'noi_dat', 'noi_ap_suat', 'xung_hap', 'am_dun', 'dua_ca', 'bep_than', 'noi_lau',
    'noi_com', 'noi_chien', 'may_xay', 'phin', 'may_danh_trung', 'lo_nuong'];
  // Bộ mặc định cho bếp Việt.
  const DEFAULT_TOOLS = ['thot_tron', 'to', 'ro_tre', 'chao', 'noi', 'noi_com'];
  // Bộ mặc định cũ: dùng cho link gửi trước khi có danh sách dụng cụ, để hiển thị y như lúc gửi.
  const LEGACY_TOOLS = ['thot', 'to', 'dia', 'chao', 'noi'];
  const HEAT = ['Không dùng lửa', 'Lửa nhỏ', 'Lửa vừa', 'Lửa lớn'];

  // Danh sách dụng cụ hợp lệ, không trùng, theo thứ tự trên quầy; luôn gồm các dụng cụ đang dùng trong bước.
  function normalize(list, steps, fallback = DEFAULT_TOOLS) {
    const set = new Set((Array.isArray(list) ? list : []).filter((k) => typeof k === 'string' && TOOLS[k]));
    if (!set.size) fallback.forEach((k) => set.add(k));
    (steps || []).forEach((s) => { if (s && TOOLS[s.s]) set.add(s.s); });
    return ORDER.filter((k) => set.has(k));
  }

  const MARGIN = 70, GAP = 30, MIN_W = 800;
  const TRAY = 120; // bếp Việt: chừa chỗ bên trái cho mâm cơm

  // Vị trí từng dụng cụ trên quầy và bề rộng căn bếp.
  function layout(tools, theme) {
    const keys = normalize(tools);
    const left = theme === 'modern' ? 0 : TRAY;
    const total = keys.reduce((s, k) => s + TOOLS[k].w, 0) + GAP * (keys.length - 1);
    const W = Math.max(MIN_W, Math.round(total + MARGIN * 2 + left));
    let x = left + (W - left - total) / 2;
    const pos = {};
    keys.forEach((k) => {
      const t = TOOLS[k];
      const b = t.stove ? GRATE : COUNTER;
      pos[k] = { x, b, cx: x + t.cx, top: b - t.h, t };
      x += t.w + GAP;
    });
    return { W, keys, pos };
  }

  let uid = 0;

  function flames(cx, width, level) {
    if (!level) return '';
    const n = [0, 3, 5, 7][level];
    const hgt = [0, 8, 11, 14][level];
    const span = Math.min(72, width - 10);
    let s = '<g class="flames">';
    for (let k = 0; k < n; k++) {
      const x = cx - span / 2 + (span * (k + 0.5)) / n;
      s +=
        `<path style="animation-delay:${(k % 3) * 0.15}s" d="M${x} 253 q-6 -${hgt * 0.45} 0 -${hgt} q6 ${hgt * 0.55} 0 ${hgt}z" fill="#FF9F43" stroke="none"/>` +
        `<path style="animation-delay:${(k % 3) * 0.15}s" d="M${x} 253 q-3 -${hgt * 0.3} 0 -${hgt * 0.55} q3 ${hgt * 0.3} 0 ${hgt * 0.55}z" fill="#FFD166" stroke="none"/>`;
    }
    return s + '</g>';
  }

  function steam(cx, y) {
    let s = '<g class="steam" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".85">';
    [-16, 0, 16].forEach((dx, k) => {
      s += `<path style="animation-delay:${k * 0.4}s" d="M${cx + dx} ${y} q-7 -9 0 -18 q7 -9 0 -18"/>`;
    });
    return s + '</g>';
  }

  // Tường, cửa sổ, kệ, đèn, tủ bếp: trải theo bề rộng căn bếp.
  function backdrop(W, id) {
    const win = W / 2;
    const rack = W >= 1100
      ? `<path d="M${W - 380} 92 H${W - 250}" stroke-width="4"/>` +
        `<path d="M${W - 360} 92 v26 a7 7 0 1 0 0.1 0" fill="#C8CDD3"/>` +
        `<path d="M${W - 316} 92 v34" stroke-width="3"/><rect x="${W - 324}" y="124" width="16" height="10" rx="3" fill="#C8CDD3"/>` +
        `<path d="M${W - 272} 92 v28" stroke-width="3"/><path d="M${W - 280} 120 h16 l-3 12 h-10z" fill="#E07A5F"/>`
      : '';
    return `
  <defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFC98B"/><stop offset="1" stop-color="#FFE6BF"/>
    </linearGradient>
    <pattern id="${id}tile" width="28" height="28" patternUnits="userSpaceOnUse">
      <rect width="28" height="28" fill="#F8D9BF"/>
      <path d="M28 0 V28 H0" fill="none" stroke="#F1C8A8" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="${W}" height="340" fill="#FCEBDB"/>
  <rect y="150" width="${W}" height="112" fill="url(#${id}tile)"/>
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <rect x="${win - 100}" y="26" width="200" height="110" rx="8" fill="#C98B5B"/>
    <rect x="${win - 89}" y="37" width="178" height="88" rx="4" fill="url(#${id}sky)"/>
    <circle cx="${win + 52}" cy="62" r="13" fill="#FFF4D6" stroke="none"/>
    <path d="M${win} 37 V125 M${win - 89} 81 H${win + 89}" stroke="#C98B5B" stroke-width="6"/>
    <path d="M${win - 118} 18 H${win + 118}" stroke="#8B5E3C" stroke-width="4"/>
    <path d="M${win - 112} 20 h44 q-10 60 -28 122 h-16z" fill="#E9967A"/>
    <path d="M${win + 112} 20 h-44 q10 60 28 122 h16z" fill="#E9967A"/>
    <rect x="${win - 108}" y="136" width="216" height="9" rx="3" fill="#C98B5B"/>
    <path d="M${win - 58} 136 l-4 -16 h20 l-4 16z" fill="#E07A5F"/>
    <path d="M${win - 52} 120 q-12 -10 -8 -22 q10 6 8 22 q2 -16 14 -20 q2 12 -14 20" fill="#81B29A"/>
    <rect x="40" y="110" width="200" height="8" rx="3" fill="#C98B5B"/>
    <rect x="56" y="78" width="30" height="32" rx="7" fill="#FDF6F0"/><rect x="54" y="72" width="34" height="8" rx="3" fill="#E07A5F"/>
    <rect x="100" y="86" width="26" height="24" rx="6" fill="#FFF0C2"/><rect x="98" y="80" width="30" height="7" rx="3" fill="#81B29A"/>
    <rect x="140" y="72" width="30" height="38" rx="7" fill="#E8F3EE"/><rect x="138" y="66" width="34" height="8" rx="3" fill="#F2CC8F"/>
    <path d="M196 110 l-4 -18 h26 l-4 18z" fill="#F2CC8F"/>
    <path d="M205 92 q-16 -6 -16 -22 q14 2 16 22 q0 -18 14 -26 q6 16 -14 26" fill="#81B29A"/>
    ${rack}
    <path d="M${W - 120} 0 V40" stroke-width="2.5"/>
  </g>
  <circle cx="${W - 120}" cy="74" r="58" fill="#FFE8A3" opacity=".3"/>
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round">
    <path d="M${W - 150} 70 L${W - 136} 40 H${W - 104} L${W - 90} 70Z" fill="#F2CC8F"/>
    <circle cx="${W - 120}" cy="74" r="6" fill="#FFF4C2"/>
  </g>
`;
  }

  // ---------- Căn bếp Việt ----------
  // Tường gạch bông, cửa sổ chớp xanh, kệ gia vị (nước mắm, tương ớt, mỡ hành),
  // chùm tỏi và ớt treo, rổ rá treo tường, đèn.
  function backdropViet(W, id) {
    const win = W / 2;
    const bottleOn = (x, body, cap, h) =>
      `<rect x="${x + 5}" y="${110 - h - 8}" width="8" height="6" rx="1.5" fill="${cap}"/>` +
      `<path d="M${x + 5} ${110 - h - 2} h8 v4 c0 2 5 3 5 7 V${108} a2 2 0 0 1 -2 2 H${x + 2} a2 2 0 0 1 -2 -2 V${110 - h + 9} c0 -4 5 -5 5 -7z" fill="${body}"/>`;
    const garlic = (cx, cy) => `<path d="M${cx} ${cy - 7} C${cx + 8} ${cy - 2} ${cx + 8} ${cy + 7} ${cx} ${cy + 7} C${cx - 8} ${cy + 7} ${cx - 8} ${cy - 2} ${cx} ${cy - 7}Z" fill="#F7F1E5"/>`;
    const chili = (x, y, a) => `<path d="M${x} ${y} c4 2 6 10 2 18 c-3 -6 -5 -12 -2 -18z" transform="rotate(${a} ${x} ${y})" fill="#E63946"/>`;
    const basket = (cx, cy, r) =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E3C08A"/><circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="#F0D7A8"/>` +
      `<path d="M${cx - r + 4} ${cy} H${cx + r - 4} M${cx} ${cy - r + 4} V${cy + r - 4} M${cx - r * 0.6} ${cy - r * 0.6} L${cx + r * 0.6} ${cy + r * 0.6} M${cx + r * 0.6} ${cy - r * 0.6} L${cx - r * 0.6} ${cy + r * 0.6}" stroke-width="1.2" opacity=".45"/>`;
    const rightDecor = W - 150 > win + 230;
    return `
  <defs>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#BFE3F2"/><stop offset="1" stop-color="#FFE6BF"/>
    </linearGradient>
    <pattern id="${id}tile" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="#F4EBDD"/>
      <path d="M15 4 L19 11 L26 15 L19 19 L15 26 L11 19 L4 15 L11 11Z" fill="#5B8DB8" opacity=".75"/>
      <circle cx="15" cy="15" r="3" fill="#E9967A"/>
      <path d="M0 0 h5 a5 5 0 0 1 -5 5z M30 0 v5 a5 5 0 0 1 -5 -5z M0 30 v-5 a5 5 0 0 1 5 5z M30 30 h-5 a5 5 0 0 1 5 -5z" fill="#C9744A" opacity=".7"/>
      <path d="M30 0 V30 H0" fill="none" stroke="#E6D6BE" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="${W}" height="340" fill="#FBF0DF"/>
  <rect y="150" width="${W}" height="112" fill="url(#${id}tile)"/>
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <rect x="${win - 78}" y="26" width="156" height="110" rx="6" fill="#8B5E3C"/>
    <rect x="${win - 68}" y="36" width="136" height="90" rx="3" fill="url(#${id}sky)"/>
    <circle cx="${win + 36}" cy="60" r="12" fill="#FFF4D6" stroke="none"/>
    <path d="M${win - 54} 126 q10 -22 24 -18 q14 -16 26 2 q16 -10 22 16z" fill="#81B29A" stroke-width="2"/>
    <path d="M${win} 36 V126" stroke="#8B5E3C" stroke-width="5"/>
    <rect x="${win - 128}" y="28" width="50" height="106" rx="4" fill="#5E9C76"/>
    <rect x="${win + 78}" y="28" width="50" height="106" rx="4" fill="#5E9C76"/>
    <path d="${[42, 54, 66, 78, 90, 102, 114, 124].map((y) => `M${win - 122} ${y} h38 M${win + 84} ${y} h38`).join(' ')}" stroke="#3F7A5C" stroke-width="2"/>
    <rect x="${win - 86}" y="134" width="172" height="8" rx="3" fill="#8B5E3C"/>

    <rect x="34" y="110" width="210" height="8" rx="3" fill="#8B5E3C"/>
    <path d="M44 110 v14 M234 110 v14" stroke-width="3"/>
    ${bottleOn(50, '#E7A64B', '#C0392B', 44)}
    ${bottleOn(78, '#E63946', '#7BC47F', 38)}
    <rect x="108" y="82" width="30" height="28" rx="7" fill="#C8E6A0"/><rect x="106" y="76" width="34" height="8" rx="3" fill="#E07A5F"/>
    <rect x="150" y="88" width="24" height="22" rx="6" fill="#FDF6F0"/><rect x="148" y="83" width="28" height="7" rx="3" fill="#81B29A"/>
    <path d="M196 110 l-4 -18 h26 l-4 18z" fill="#C9744A"/>
    <path d="M205 92 q-16 -6 -16 -22 q14 2 16 22 q0 -18 14 -26 q6 16 -14 26" fill="#81B29A"/>

    <path d="M${win + 150} 18 V40 M${win + 176} 18 V36" stroke-width="2"/>
    ${[[0, 46], [-6, 58], [6, 60], [0, 72], [-5, 84], [5, 86]].map(([dx, dy]) => garlic(win + 150 + dx, dy)).join('')}
    ${[[-6, 38, 20], [0, 40, 0], [6, 38, -20], [-3, 52, 12], [4, 54, -10]].map(([dx, y, a]) => chili(win + 176 + dx, y, a)).join('')}
    <path d="M${win + 172} 36 l4 -4 l4 4" stroke="#4E8F4E" stroke-width="2.5"/>

    ${rightDecor ? basket(W - 250, 70, 30) + basket(W - 208, 104, 22) : ''}
    <path d="M${W - 120} 0 V40" stroke-width="2.5"/>
  </g>
  <circle cx="${W - 120}" cy="74" r="58" fill="#FFE8A3" opacity=".3"/>
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round">
    <path d="M${W - 146} 70 C${W - 146} 50 ${W - 94} 50 ${W - 94} 70Z" fill="#E9967A"/>
    <circle cx="${W - 120}" cy="74" r="6" fill="#FFF4C2"/>
  </g>`;
  }

  // Mâm cơm ở góc trái quầy: mâm tròn, chén cơm, đĩa rau, đôi đũa.
  function tray() {
    const bowl = (cx) =>
      `<path d="M${cx - 12} 244 h24 c0 10 -5 14 -12 14 c-7 0 -12 -4 -12 -14z" fill="#FFFFFF"/>` +
      `<path d="M${cx - 12} 248 h24" stroke="#5B8DB8" stroke-width="2"/>` +
      `<path d="M${cx - 10} 244 c2 -8 18 -8 20 0z" fill="#FFFDF5" stroke-width="2"/>`;
    return `<g class="tray" stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="78" cy="258" rx="62" ry="7" fill="#B5603A"/>
    ${bowl(42)}${bowl(112)}
    <path d="M60 252 h36 q-4 6 -18 6 q-14 0 -18 -6z" fill="#FFFFFF"/>
    <path d="M64 252 q4 -10 10 -2 q4 -10 10 -2 q4 -10 10 -1" fill="#7BC47F" stroke-width="2"/>
    <path d="M52 238 L76 224 M56 240 L80 226" stroke="#C98B5B" stroke-width="3"/>
  </g>`;
  }

  // Tủ bếp và mặt quầy: vẽ sau Chef để che phần thân dưới quầy.
  function cabinet(W) {
    let doors = '';
    const n = Math.max(2, Math.round((W - 40) / 200));
    const dw = (W - 40 - (n - 1) * 12) / n;
    for (let i = 0; i < n; i++) {
      const dx = 20 + i * (dw + 12);
      doors += `<rect x="${dx}" y="288" width="${dw}" height="44" rx="5" fill="#D59A69"/>` +
        `<path d="M${dx + (i % 2 ? 12 : dw - 12)} 304 v12" stroke-width="3.5"/>`;
    }
    return `<g class="cabinet" stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <rect x="-4" y="276" width="${W + 8}" height="70" fill="#C98B5B"/>
    ${doors}
    <rect x="-4" y="262" width="${W + 8}" height="14" fill="#E3B07F"/>
  </g>`;
  }

  // Chef đứng sau quầy, cạnh dụng cụ đang dùng (không che bong bóng nguyên liệu).
  // Chọn bên trái hoặc phải dụng cụ đang dùng, ưu tiên bên có đồ thấp hơn để Chef không bị che mặt.
  function chefX(L, active) {
    const p = L.pos[active];
    if (!p) return L.W / 2;
    const cost = (cx) => L.keys.reduce((sum, k) => {
      const q = L.pos[k];
      const overlap = Math.min(cx + 40, q.x + q.t.w) - Math.max(cx - 40, q.x);
      return overlap > 0 ? sum + overlap * (COUNTER - q.top) : sum;
    }, 0);
    const options = [p.x + p.t.w + 62, p.x - 62].filter((cx) => cx >= 60 && cx <= L.W - 60);
    if (!options.length) return Math.min(L.W - 60, Math.max(60, p.cx));
    return options.reduce((best, cx) => (cost(cx) < cost(best) ? cx : best));
  }

  // Trả về { svg, w (bề rộng căn bếp), focus (tọa độ x cần nhìn tới) }.
  // theme: 'viet' (mặc định, bếp Việt) hoặc 'modern' (bếp hiện đại).
  function scene({ tools, active = null, heat = 0, temp = 0, items = [], interactive = false, chef = null, theme = 'viet' } = {}) {
    const viet = theme !== 'modern';
    const L = layout(tools, theme);
    const W = L.W;
    const id = 'k' + ++uid;
    if (!L.pos[active]) active = null;
    const ap = L.pos[active];

    // Bếp ga dưới các dụng cụ nấu bằng lửa.
    let stoves = '';
    L.keys.forEach((k) => {
      const p = L.pos[k];
      if (!p.t.stove) return;
      const bw = p.t.body + 24;
      const sx = p.cx - bw / 2;
      if (viet) {
        // Bếp ga đặt trên quầy: thân bếp có núm vặn phía trước, kiềng ba chân.
        stoves += `<rect x="${sx - 2}" y="246" width="${bw + 4}" height="16" rx="4" fill="#3E3A44"/>` +
          `<path d="M${sx + 2} 250 h${bw - 4}" stroke="#6F6787" stroke-width="2"/>` +
          `<circle cx="${p.cx - bw / 4}" cy="255" r="4" fill="#E8D4C2" class="knob"/><circle cx="${p.cx + bw / 4}" cy="255" r="4" fill="#E8D4C2" class="knob"/>` +
          `<path d="M${sx + 12} ${GRATE} V246 M${sx + bw - 12} ${GRATE} V246 M${p.cx} ${GRATE} V246" stroke-width="3.5"/>`;
      } else {
        stoves += `<rect x="${sx}" y="254" width="${bw}" height="8" rx="2" fill="${O}"/>` +
          `<path d="M${sx + 14} ${GRATE} V254 M${sx + bw - 14} ${GRATE} V254" stroke-width="4"/>` +
          `<circle cx="${p.cx - 10}" cy="296" r="4.5" fill="#F2CC8F" class="knob"/><circle cx="${p.cx + 10}" cy="296" r="4.5" fill="#F2CC8F" class="knob"/>`;
      }
    });

    const tools_ = L.keys.map((k) => {
      const p = L.pos[k];
      const on = k === active;
      const attrs = `class="station${on ? ' active' : ''}" data-station="${k}"` +
        (interactive ? ` role="button" tabindex="0" aria-label="${window.L ? window.L.station(k) : p.t.name}"` : '');
      const hit = `<rect class="hit" x="${p.x - 8}" y="${Math.min(p.top - 14, COUNTER - 60)}" width="${p.t.w + 16}" height="${COUNTER - Math.min(p.top - 14, COUNTER - 60)}" fill="transparent" stroke="none"/>`;
      return `<g ${attrs}>${p.t.draw(p.x, p.b, on)}${hit}</g>`;
    }).join('');

    // Lửa vẽ dưới dụng cụ, hơi nước vẽ phía trên.
    let glow = '', fire = '', vapor = '';
    if (ap) {
      glow = `<ellipse class="glow" cx="${ap.cx}" cy="${COUNTER}" rx="${ap.t.body / 2 + 22}" ry="9" fill="#FFD166" opacity=".7"/>`;
      if (ap.t.stove && heat > 0) {
        fire = flames(ap.cx, ap.t.body, heat);
        vapor = steam(ap.cx, ap.top - 4);
      } else if (['noi_com', 'noi_chien', 'noi_lau'].includes(active) || (active === 'lo_nuong' && temp) || (active === 'bep_than' && heat > 0)) {
        vapor = steam(ap.cx, ap.top - 4);
      }
    }

    let bubble = '';
    if (ap && items.length) {
      const shown = items.slice(0, 4);
      const size = 46, gap = 6;
      const w = shown.length * (size + gap) + gap + 6;
      const hgt = size + 14;
      const x = Math.max(8, Math.min(W - 8 - w, ap.cx - w / 2));
      const y = Math.max(24, ap.top - hgt - 20);
      const tipX = Math.max(x + 14, Math.min(x + w - 14, ap.cx));
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

    const cx = chefX(L, active);
    const chefSvg = chef ? `<g class="chef-wrap" transform="translate(${cx - 60} 92)">${Chef.inner(chef.c, chef.mood)}</g>` : '';
    const label = window.L ? window.L.t('kitchen.aria') : 'Kitchen';

    const svg = `
<svg class="kitchen-svg" viewBox="0 18 ${W} ${SCENE_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  ${viet ? backdropViet(W, id) : backdrop(W, id)}
  ${chefSvg}
  ${cabinet(W)}
  ${viet ? tray() : ''}
  ${glow}
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${stoves}</g>
  ${fire}
  <g stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${tools_}</g>
  ${vapor}
  ${bubble}
</svg>`;
    return { svg, w: W, focus: ap ? ap.cx : cx };
  }

  // Hình một dụng cụ đứng riêng (cho bảng chọn dụng cụ).
  function toolSVG(key) {
    const t = TOOLS[key];
    if (!t) return '';
    const pad = 6;
    const box = Math.max(t.w, t.h) + pad * 2;
    const x = (box - t.w) / 2, b = (box + t.h) / 2;
    return `<svg class="tool-icon" viewBox="0 0 ${box} ${box}" aria-hidden="true"><g fill="none" stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${t.draw(x, b, false)}</g></svg>`;
  }

  // Dụng cụ có chọn mức lửa: đặt trên bếp ga, hoặc tự có nguồn nhiệt (bếp than, nồi lẩu điện).
  const hasHeat = (k) => !!(TOOLS[k] && (TOOLS[k].stove || TOOLS[k].fire));

  window.Kitchen = { TOOLS, STATIONS, CATS, CAT_NAMES, ORDER, DEFAULT_TOOLS, LEGACY_TOOLS, HEAT, SCENE_H, normalize, layout, scene, toolSVG, hasHeat };
})();
