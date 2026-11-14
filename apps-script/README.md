# Kết nối phản hồi với Google Sheet

Trang GitHub Pages là trang tĩnh. Google Apps Script sẽ nhận phản hồi và ghi từng dòng vào một tab `RSVP` trong Sheet.

## Thiết lập

1. Mở Google Sheet bạn vừa gửi, chọn **Extensions → Apps Script**.
2. Trong trình soạn thảo Apps Script, dán nội dung file `Code.gs` và lưu. ID của Sheet đã được điền sẵn trong file.
3. Chọn **Deploy → New deployment → Web app**. Đặt **Execute as** là tài khoản của bạn. Đặt quyền truy cập là **Anyone** để khách không cần đăng nhập Google.
4. Deploy và cấp quyền truy cập Sheet khi Google hỏi.
5. Sao chép URL Web App kết thúc bằng `/exec`, rồi gửi URL đó cho mình để nối vào `index.html`.
6. Sau khi cập nhật website lên GitHub Pages, gửi một phản hồi thử và kiểm tra tab `RSVP`.

Nếu tab `RSVP` chưa tồn tại, script sẽ tự tạo tab và thêm hàng tiêu đề. Mỗi phản hồi gồm thời gian gửi, tên trong đường dẫn thiệp, lựa chọn tham dự, lời nhắn và URL thiệp.

Không đưa mật khẩu Google vào trang web. Chỉ cần Spreadsheet ID trong Apps Script và URL triển khai Web App trong `index.html`.
