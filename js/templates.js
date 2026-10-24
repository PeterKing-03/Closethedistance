// Recipe món Việt mẫu: Chef mở ra, chỉnh theo khẩu vị rồi gửi, không phải soạn từ đầu.
// Mỗi món dựng theo ngôn ngữ đang dùng; định dạng giống dữ liệu trong link (đi qua C.sanitize).
// i: nguyên liệu (k: mã icon, n: tên riêng nếu khác tên icon, a/u: định lượng)
// st: các bước (s: dụng cụ, a: hành động, g: nguyên liệu, p: thành phẩm bước trước, o: tên thành phẩm,
//     h: lửa 1-3, t: phút, n: lời dặn)
(function () {
  const pick = (lang) => (vi, en) => (lang === 'en' ? en : vi);

  const LIST = [
    {
      id: 'ca_kho_to', icon: 'ca', name: { vi: 'Cá kho tộ', en: 'Clay-pot caramelized fish' },
      build(lang) {
        const x = pick(lang);
        return {
          t: x('Cá kho tộ', 'Clay-pot caramelized fish'),
          k: ['thot_tron', 'to', 'dia', 'noi_dat'],
          i: [
            { k: 'ca', n: x('Cá basa (hoặc cá lóc)', 'Catfish (or snakehead)'), a: 500, u: 'g' },
            { k: 'ba_chi', a: 1, u: 'lang' },
            { k: 'nuoc_mam', a: 3, u: 'tbsp' },
            { k: 'nuoc_mau', a: 1, u: 'tbsp' },
            { k: 'duong', a: 1, u: 'tbsp' },
            { k: 'tieu', a: 1, u: 'tsp' },
            { k: 'hanh_tim', a: 3, u: 'cu' },
            { k: 'toi', a: 3, u: 'tep' },
            { k: 'ot', a: 2, u: 'trai' },
            { k: 'hanh_la', a: 2, u: 'cong' },
          ],
          st: [
            { s: 'to', a: 'khu_mui', g: [0], o: x('Cá sạch', 'Clean fish'), n: x('Chà cá với muối và gừng rồi rửa lại cho hết tanh nha', 'Rub the fish with salt and ginger, then rinse well') },
            { s: 'thot_tron', a: 'bam', g: [6, 7, 8], o: x('Hành tỏi ớt băm', 'Minced shallot, garlic & chili') },
            { s: 'to', a: 'uop', g: [2, 3, 4, 5], p: [0, 1], t: 30, o: x('Cá ướp', 'Marinated fish') },
            { s: 'noi_dat', a: 'kho_to', g: [1], p: [2], h: 1, t: 40, o: x('Cá kho', 'Braised fish'), n: x('Kho lửa liu riu, thỉnh thoảng rưới nước kho lên mặt cá cho thấm', 'Keep it at a gentle simmer and spoon the sauce over the fish now and then') },
            { s: 'dia', a: 'rac', g: [9], p: [3], n: x('Rắc hành lá và chút tiêu, ăn nóng với cơm trắng là ngon nhất', 'Top with scallions and a pinch of pepper, best with hot rice') },
          ],
        };
      },
    },
    {
      id: 'canh_chua', icon: 'me', name: { vi: 'Canh chua cá', en: 'Sweet & sour fish soup' },
      build(lang) {
        const x = pick(lang);
        return {
          t: x('Canh chua cá', 'Sweet & sour fish soup'),
          k: ['thot_tron', 'to', 'chao', 'noi'],
          i: [
            { k: 'ca', a: 400, u: 'g' },
            { k: 'me', a: 50, u: 'g' },
            { k: 'ca_chua', a: 2, u: 'qua' },
            { k: 'dau_bap', a: 5, u: 'trai' },
            { k: 'gia_do', a: 1, u: 'nam' },
            { k: 'ngo_gai', a: 1, u: 'nam' },
            { k: 'toi', a: 2, u: 'tep' },
            { k: 'ot', a: 1, u: 'trai' },
            { k: 'nuoc_mam', a: 2, u: 'tbsp' },
            { k: 'duong', a: 2, u: 'tbsp' },
          ],
          st: [
            { s: 'to', a: 'ngam', g: [1], t: 10, o: x('Nước me', 'Tamarind water'), n: x('Ngâm me với nước ấm rồi dằm, lọc bỏ hạt', 'Soak the tamarind in warm water, mash and strain out the seeds') },
            { s: 'to', a: 'khu_mui', g: [0], o: x('Cá sạch', 'Clean fish') },
            { s: 'thot_tron', a: 'thai_lat', g: [2, 3], o: x('Cà chua, đậu bắp thái', 'Sliced tomato & okra') },
            { s: 'chao', a: 'phi', g: [6], h: 2, o: x('Tỏi phi', 'Fried garlic') },
            { s: 'noi', a: 'canh_chua', g: [8, 9], p: [0, 1], h: 2, t: 10, o: x('Nồi canh', 'Soup base'), n: x('Nấu nước me sôi rồi mới thả cá vào để cá không tanh', 'Bring the tamarind water to a boil before adding the fish') },
            { s: 'noi', a: 'nem', g: [4, 5, 7], p: [4, 2, 3], h: 1, t: 2, n: x('Cho rau vào là tắt bếp liền để giá còn giòn nha', 'Turn off the heat right after adding the greens so the sprouts stay crunchy') },
          ],
        };
      },
    },
    {
      id: 'thit_kho_trung', icon: 'trung', name: { vi: 'Thịt kho trứng', en: 'Braised pork & eggs' },
      build(lang) {
        const x = pick(lang);
        return {
          t: x('Thịt kho trứng', 'Braised pork & eggs'),
          k: ['thot_tron', 'to', 'chao', 'noi'],
          i: [
            { k: 'ba_chi', a: 5, u: 'lang' },
            { k: 'trung', n: x('Trứng vịt', 'Duck eggs'), a: 5, u: 'qua' },
            { k: 'nuoc', n: x('Nước dừa tươi', 'Fresh coconut water'), a: 500, u: 'ml' },
            { k: 'nuoc_mam', a: 4, u: 'tbsp' },
            { k: 'duong', a: 2, u: 'tbsp' },
            { k: 'hanh_tim', a: 3, u: 'cu' },
            { k: 'toi', a: 3, u: 'tep' },
            { k: 'tieu', a: 1, u: 'tsp' },
          ],
          st: [
            { s: 'noi', a: 'luoc', g: [1], h: 2, t: 10, o: x('Trứng luộc', 'Boiled eggs'), n: x('Luộc chín rồi ngâm nước lạnh cho dễ bóc vỏ', 'Cool them in cold water so they peel easily') },
            { s: 'thot_tron', a: 'chat', g: [0], o: x('Thịt cắt miếng', 'Pork pieces'), n: x('Cắt miếng vuông to cỡ ba ngón tay, kho xong không bị nát', 'Cut into large cubes so they hold their shape') },
            { s: 'to', a: 'uop', g: [3, 5, 6, 7], p: [1], t: 30, o: x('Thịt ướp', 'Marinated pork') },
            { s: 'chao', a: 'thang_mau', g: [4], h: 1, o: x('Nước màu', 'Caramel'), n: x('Thắng đường tới màu cánh gián là được, đừng để cháy đắng', 'Cook the sugar to a deep amber, do not let it burn') },
            { s: 'noi', a: 'kho', g: [2], p: [2, 3, 0], h: 1, t: 60, n: x('Đổ nước dừa ngập thịt, kho liu riu tới khi thịt mềm và nước sánh lại', 'Cover the pork with coconut water and simmer gently until tender') },
          ],
        };
      },
    },
    {
      id: 'goi_cuon', icon: 'banh_trang', name: { vi: 'Gỏi cuốn', en: 'Fresh spring rolls' },
      build(lang) {
        const x = pick(lang);
        return {
          t: x('Gỏi cuốn', 'Fresh spring rolls'),
          k: ['thot_tron', 'to', 'ro_tre', 'dia', 'noi'],
          i: [
            { k: 'tom', a: 300, u: 'g' },
            { k: 'ba_chi', a: 2, u: 'lang' },
            { k: 'bun', a: 200, u: 'g' },
            { k: 'banh_trang', a: 1, u: 'goi' },
            { k: 'rau_cai', n: x('Xà lách', 'Lettuce'), a: 1, u: 'bo' },
            { k: 'hung_que', a: 1, u: 'nam' },
            { k: 'he', a: 1, u: 'bo' },
            { k: 'nuoc_tuong', n: x('Tương đen', 'Hoisin sauce'), a: 3, u: 'tbsp' },
            { k: 'dau_phong', a: 2, u: 'tbsp' },
          ],
          st: [
            { s: 'noi', a: 'luoc', g: [1], h: 2, t: 20, o: x('Thịt luộc', 'Boiled pork') },
            { s: 'noi', a: 'chan', g: [0], h: 2, t: 3, o: x('Tôm luộc', 'Poached shrimp') },
            { s: 'thot_tron', a: 'thai_lat', p: [0, 1], o: x('Nhân thịt tôm', 'Pork & shrimp filling'), n: x('Thịt thái mỏng, tôm bóc vỏ rồi bổ đôi', 'Slice the pork thin, peel and halve the shrimp') },
            { s: 'ro_tre', a: 'nhat', g: [4, 5, 6], o: x('Rau sống', 'Fresh herbs') },
            { s: 'to', a: 'pha_nuoc_cham', g: [7, 8], o: x('Nước chấm', 'Dipping sauce') },
            { s: 'dia', a: 'cuon', g: [3, 2], p: [2, 3], o: x('Gỏi cuốn', 'Spring rolls'), n: x('Nhúng bánh tráng qua nước rồi cuốn chặt tay, để cọng hẹ thò ra một đầu cho xinh', 'Dip the rice paper in water and roll tightly, leaving a chive sticking out for a cute touch') },
            { s: 'dia', a: 'an', p: [5, 4], n: x('Chấm với nước chấm, ăn liền cho bánh tráng còn dẻo nha', 'Dip and eat right away while the rice paper is soft') },
          ],
        };
      },
    },
    {
      id: 'pho_bo', icon: 'banh_pho', name: { vi: 'Phở bò', en: 'Beef pho' },
      build(lang) {
        const x = pick(lang);
        return {
          t: x('Phở bò', 'Beef pho'),
          k: ['thot_tron', 'to', 'chao', 'noi', 'bep_than'],
          i: [
            { k: 'suon', n: x('Xương ống bò', 'Beef bones'), a: 1, u: 'kg' },
            { k: 'thit_bo', a: 3, u: 'lang' },
            { k: 'banh_pho', a: 500, u: 'g' },
            { k: 'gung', a: 1, u: 'nhanh' },
            { k: 'hanh_tim', n: x('Hành tây', 'Onion'), a: 1, u: 'cu' },
            { k: 'hoa_hoi', a: 3, u: 'qua' },
            { k: 'que', a: 1, u: 'mieng' },
            { k: 'thao_qua', a: 1, u: 'trai' },
            { k: 'nuoc_mam', a: 3, u: 'tbsp' },
            { k: 'duong_phen', a: 20, u: 'g' },
            { k: 'gia_do', a: 1, u: 'nam' },
            { k: 'hanh_la', a: 3, u: 'cong' },
            { k: 'hung_que', a: 1, u: 'nam' },
            { k: 'chanh', a: 1, u: 'trai' },
          ],
          st: [
            { s: 'noi', a: 'chan', g: [0], h: 3, t: 5, o: x('Xương sạch', 'Clean bones'), n: x('Chần xương cho ra bọt bẩn rồi rửa lại, nước dùng sẽ trong', 'Blanch the bones to remove scum, then rinse so the broth stays clear') },
            { s: 'bep_than', a: 'nuong_than', g: [3, 4], h: 2, t: 10, o: x('Gừng hành nướng', 'Charred ginger & onion') },
            { s: 'chao', a: 'dao', g: [5, 6, 7], h: 1, t: 3, o: x('Gia vị phở', 'Pho spices'), n: x('Rang thơm các loại gia vị trên lửa nhỏ', 'Toast the spices over low heat until fragrant') },
            { s: 'noi', a: 'ham', g: [8, 9], p: [0, 1, 2], h: 1, t: 180, o: x('Nước dùng', 'Broth'), n: x('Hầm liu riu, hớt bọt thường xuyên để nước trong và ngọt', 'Simmer gently and skim often for a clear, sweet broth') },
            { s: 'thot_tron', a: 'thai_lat', g: [1], o: x('Thịt bò tái', 'Rare beef'), n: x('Thái thật mỏng, ngược thớ thịt', 'Slice very thin, against the grain') },
            { s: 'noi', a: 'chan', g: [2, 10], h: 3, t: 1, o: x('Bánh phở trụng', 'Blanched noodles') },
            { s: 'to', a: 'bay_to', g: [11, 12, 13], p: [5, 4, 3], n: x('Xếp bánh phở, thịt tái, chan nước dùng thật sôi lên là thịt chín tới', 'Layer noodles and beef, then pour boiling broth over to cook the beef') },
          ],
        };
      },
    },
  ];

  window.Templates = { LIST };
})();
