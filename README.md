# Close the distance

Gửi yêu thương qua từng món ăn. Một website nhỏ cho các cặp đôi yêu xa: một người làm **Chef**, soạn một recipe dễ thương rồi gửi link. Người thương mở link là nấu được theo từng bước, kể cả khi hai người lệch múi giờ.

## Tính năng
- Tạo nhân vật Chef (nam/nữ, da, tóc, mũ, tạp dề). Chef nghiêm túc nhắc nhở ở các bước cắt thái, chiên xào.
- 35 icon nguyên liệu và bảng vẽ để tự vẽ nguyên liệu, định lượng theo g, ml, muỗng, quả...
- 5 recipe món Việt mẫu (cá kho tộ, canh chua cá, thịt kho trứng, gỏi cuốn, phở bò) để bắt đầu nhanh.
- Bếp Việt (mặc định) hoặc bếp hiện đại: tường gạch bông, cửa sổ chớp, kệ nước mắm tương ớt, chùm tỏi ớt, mâm cơm.
- 95 nguyên liệu (có gia vị, rau thơm, bún phở kiểu Việt), đơn vị đo kiểu Việt (lạng, trái, con, nhánh, nắm, muỗng vun...).
- Bộ 29 dụng cụ nhà bếp (bếp Việt, sơ chế, nấu, làm bánh), tự chọn dụng cụ có trên bếp; căn bếp rộng ra theo số dụng cụ.
- Soạn từng bước trên giao diện căn bếp: mức lửa, nhiệt độ lò (°C), thời gian, lời dặn.
- Liên kết giữa các bước: thành phẩm của một bước (VD "Kem mascarpone") làm nguyên liệu cho bước sau; người nhận có sơ đồ tổng quan các bước và xem lại nhanh được bước trước.
- Lời nhắn từ nhà sáng tạo hiện đầu tiên khi mở link.
- Màn hình nấu cho điện thoại: checklist nguyên liệu, từng bước, hẹn giờ, giữ màn hình sáng.
- Song ngữ Việt / Anh.

## Cách hoạt động
Website tĩnh (HTML, CSS, JavaScript thuần), không có backend. Toàn bộ recipe được nén vào phần sau dấu `#` của link, nên không lưu trên máy chủ nào.

## Chạy trên máy
Mở `index.html` bằng trình duyệt. Một số tính năng (giữ màn hình sáng, chia sẻ) cần chạy qua https.

## Deploy
Website tĩnh, không cần build. Mỗi lần cập nhật, tăng số `?v=` trong `index.html` để trình duyệt tải bản mới.
