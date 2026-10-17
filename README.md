# Close the distance

Gửi yêu thương qua từng món ăn. Một website nhỏ cho các cặp đôi yêu xa: một người làm **Chef**, soạn một recipe dễ thương rồi gửi link. Người thương mở link là nấu được theo từng bước, kể cả khi hai người lệch múi giờ.

## Tính năng
- Tạo nhân vật Chef (nam/nữ, da, tóc, mũ, tạp dề). Chef nghiêm túc nhắc nhở ở các bước cắt thái, chiên xào.
- 35 icon nguyên liệu và bảng vẽ để tự vẽ nguyên liệu, định lượng theo g, ml, muỗng, quả...
- Soạn từng bước trên giao diện căn bếp: thớt, tô, đĩa, chảo, nồi, mức lửa, thời gian, lời dặn.
- Màn hình nấu cho điện thoại: checklist nguyên liệu, từng bước, hẹn giờ, giữ màn hình sáng.
- Song ngữ Việt / Anh.

## Cách hoạt động
Website tĩnh (HTML, CSS, JavaScript thuần), không có backend. Toàn bộ recipe được nén vào phần sau dấu `#` của link, nên không lưu trên máy chủ nào.

## Chạy trên máy
Mở `index.html` bằng trình duyệt. Một số tính năng (giữ màn hình sáng, chia sẻ) cần chạy qua https.

## Deploy
Website tĩnh, không cần build. Mỗi lần cập nhật, tăng số `?v=` trong `index.html` để trình duyệt tải bản mới.
