## Plan: Dọn dẹp Root & Chuyển đổi Upload Video sang Supabase

Kế hoạch này sẽ loại bỏ các file thừa ở thư mục gốc (root), xác nhận và cấu hình lại kết nối cho MongoDB và Supabase mới. Thay vì upload file qua Server Node.js (gây quá tải), React Client sẽ upload video trực tiếp lên Supabase Storage và chỉ gửi đường dẫn URL cho Backend lưu vào MongoDB.

**Các bước thực hiện (Steps)**

**Phase 1: Dọn dẹp & Cấu hình môi trường (Môi trường)**

1. Xóa các thư mục và file không cần thiết ở thư mục gốc: `node_modules/`, `package.json`, `package-lock.json` vì project đã tách bạch `/client` và `/server`. (_Việc quản lý package giờ chỉ nằm bên trong 2 thư mục con._)
2. **MongoDB**: Kiểm tra file `server/.env` xem biến `MONGO_URI` có còn chính xác và database MongoDB Atlas có đang hoạt động hay không. Thử chạy script kết nối với DB để xác nhận.
3. **Supabase**: Tạo project Supabase mới, cấp nhật lại `REACT_APP_SUPABASE_URL` và `REACT_APP_SUPABASE_ANON_KEY` trong file `client/.env`.
4. Mở dashboard Supabase, tạo một bucket mới tên là `videos`, và thiết lập Policies (RLS) cho phép insert/select đối với bucket này. (_depends on 3_)

**Phase 2: Refactor Frontend Upload**

1. Sửa file `UploadMovie.jsx`: Xóa logic sử dụng `FormData` để gửi video về phía Back-end. (_parallel with Phase 1.4_)
2. Thay thế bằng logic: Sử dụng hàm `supabase.storage.from('videos').upload(...)` để đẩy trực tiếp file lên Supabase. Lấy Public URL của video sau khi upload thành công.
3. Cập nhật request gọi API cho backend: Gửi 1 JSON body đơn giản bào gồm `{ title, plot, videoUrl: <SUPABASE_PUBLIC_URL_MOI_LAY_DUOC> }`.

**Phase 3: Cập nhật Backend**

1. Sửa `movieRoutes.js`: Tháo bỏ middleware `multer` khỏi route POST `/upload`, vì lúc này Node.js sẽ nhận dữ liệu dạng chuỗi JSON `videoUrl` chứ không nhận dữ liệu dưới dạng `multipart/form-data` nữa. (_depends on Phase 2 & 1_)
2. Sửa file `movieController.js`: Cập nhật lại controller `uploadMovie`, lấy thẳng `req.body.videoUrl` để lưu xuống MongoDB thay vì xử lý `req.file`.

**Relevant files**

- `/package.json`, `/package-lock.json` — Xóa.
- `client/.env`, `server/.env` — Cập nhật Supabase API mới và verify MongoDB config.
- `client/src/Component/Upload/UploadMovie.jsx` — Thay đổi luồng upload `axios.post` thành upload trực tiếp qua Supabase SDK.
- `server/controllers/movieController.js` — Hàm `uploadMovie`, bỏ các logic kiểm tra `req.file` và thay bằng lưu trực tiếp JSON payload chứa `videoUrl`.
- `server/routes/movieRoutes.js` — Bỏ middleware `upload.single(...)` ở route `/upload`.

**Verification**

1. **Chạy server riêng**: `cd server` && `npm start` – đảm bảo kết nối Mongoose Database thành công mà không báo lỗi `MONGO_URI`.
2. **Chạy client riêng**: `cd client` && `npm start`, mở URL ở Localhost.
3. Test chọn 1 file video (nhỏ) trên giao diện Client và ấn Upload.
4. Xác nhận **Vào Supabase Dashboard**, bucket `videos` xuất hiện video mới.
5. Kiểm tra collection `movies` trên MongoDB, xem document mới thêm vào có thuộc tính `videoUrl` là một đường dẫn hợp lệ trỏ tới Supabase URL hay không.

**Decisions**

- Chuyển hoàn toàn phương thức upload video từ **Client -> Node (Multer) -> Disk** sang **Client -> Supabase Storage (Cloud)**. Điều này giúp hệ thống backend có thể deploy lên bất kì đâu mà không sợ giới hạn ổ cứng và giới hạn dung lượng post request.
- Các file ở server gốc như `package.json`, `node_modules` bị xem là rác và tiến hành remove cho sạch workspace.

**Further Considerations**

1. Với Supabase Bucket hiện tại, bạn có muốn người dùng cần đăng nhập mới được upload video (thêm Rule Authenticated), hay bất kì ai cũng có quyền upload (Public)?
