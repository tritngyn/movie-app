# 🎬 Full-Stack Movie Application

Một ứng dụng web xem phim và chia sẻ video nội bộ, được xây dựng trên kiến trúc **MERN Stack** kết hợp với hệ sinh thái **Supabase** (BaaS) nhằm tối ưu hóa hiệu suất truyền tải video và bảo mật.

## ✨ Tính Năng Nổi Bật (Key Features)

- **🌍 Tải lên Video siêu tốc (Direct-to-Cloud):** Khách hàng tải trực tiếp video lên hệ thống phân phối nội dung của **Supabase Storage** (Bỏ qua Node.js Server). Xóa bỏ hoàn toàn giới hạn băng thông và dung lượng tệp.
- **🔐 Xác thực an toàn (Authentication):** Đăng nhập và quản lý phiên người dùng bằng **Supabase Auth**.
- **📋 Quản lý danh mục cá nhân:** Người dùng có danh sách phim yêu thích (Favorites) và có thể phân loại theo danh sách phát riêng (Watchlist).
- **💬 Tương tác cộng đồng:** Tính năng bình luận (Comments) phim thời gian thực (Lưu trên Supabase PostgreSQL).
- **📡 Quản lý nội dung phim nhanh chóng:** Thông tin metadata của phim, đạo diễn, mô tả, và đường dẫn URL video được quản lý qua API tự xây dựng với **Node.js** và **MongoDB**.

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend (`/client`)

- **Library:** React.js, React Router
- **Styling:** SCSS, CSS Modules
- **Data Fetching:** Axios
- **BaaS SDK:** `@supabase/supabase-js`

### Backend (`/server`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database (NoSQL):** MongoDB & Mongoose (Lưu thông tin Phim)

### Cloud Services

- **Supabase Storage:** Lưu trữ Video (`.mp4`, `.mov`, v.v.)
- **Supabase Auth:** Quản lý người dùng.
- **Supabase PostgreSQL:** Lưu trữ Dữ liệu quan hệ (Favorites, Watchlists, Comments).

---

## 🏗 Cấu Trúc Thư Mục (Folder Structure)

```text
movieapp/
├── client/           # Ứng dụng Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── Component/   # Các Component UI (MovieCard, UploadMovie,...)
│   │   ├── supabaseClient.js # Cấu hình SDK giao tiếp với Supabase
│   │   └── App.js
├── server/           # Ứng dụng Backend (Node.js/Express)
│   ├── controllers/  # Xử lý Logic (Thêm Phim, Trả danh sách Phim)
│   ├── models/       # Schema MongoDB cho Phim
│   ├── routes/       # Khai báo các API Endpoints
│   └── index.js      # Điểm bắt đầu của Server Node.js
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt (Getting Started)

### 1. Yêu Cầu Cấu Hình (Prerequisites)

- [Node.js](https://nodejs.org/) (Version 16+ khuyến nghị)
- Có tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Có dự án trên [Supabase](https://supabase.com/)

### 2. Cài Đặt Môi Trường (Environment Setup)

Bạn cần tạo 2 file `.env`, một cho Client và một cho Server.

**Trong thư mục `client/` tạo file `.env`:**

```env
REACT_APP_API_SERVER=http://localhost:5000
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

**Trong thư mục `server/` tạo file `.env`:**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. Cài Đặt Mạng Cơ Sở Dữ Liệu Supabase

Chạy đoạn Script SQL sau ở màn hình `SQL Editor` trong dự án Supabase để tạo các Bảng dữ liệu người dùng (Favorites, Watchlist, Comments) và Bucket lưu Video:

_Tham khảo toàn bộ SQL script đã được generate từ SupabaseClient.js trong quá trình định nghĩa dự án._
_(Tham khảo lại cuộc trò chuyện cài đặt RLS Policy và Tables của Dự Án)._

### 4. Chạy Ứng Dụng (Run the App)

Bạn cần mở 2 Terminal để chạy cả Client và Server cùng lúc:

**🏠 Chạy Server (Backend):**

```bash
cd server
npm install
npm start
```

_(Nếu thành công Terminal sẽ báo: `MongoDB Connected`)_

**💻 Chạy Client (Frontend):**

```bash
cd client
npm install
npm start
```

_(Mở trình duyệt ở địa chỉ `http://localhost:3000`)_

---

## 💡 Luồng Hoạt Động Cốt Lõi (Architecture Highlight)

**Tính năng Upload Phim Tiên Tiến:**
Thay vì dùng Middleware `multer` gửi video thẳng cho Node.js như truyền thống, ứng dụng thực hiện chuỗi hành động tối ưu sau:

1. Trình duyệt (React) đẩy file Video thẳng lên **Supabase Storage**.
2. Supabase trả về một **Public URL**.
3. Khách hàng gửi 1 JSON cực nhẹ (bao gồm Tiêu đề phim + `videoUrl`) về `POST /api/movies/upload` phía Node.js.
4. Node.js lưu thông tin này vào **MongoDB**.
   => Giảm tải 100% băng thông tải video và tiền lưu trữ ổ cứng cho máy chủ Node.js!

---

_Dự án được xây dựng và tối ưu kiến trúc Micro-services._ 🚀
