# 🎬 MovieApp — Full-Stack Movie Streaming Platform

A full-stack web application for browsing, streaming, and sharing movies — built with a **MERN stack** backend and **Supabase** cloud services for authentication, storage, and real-time data.

> **Live Demo:** [movie-app-gold-five.vercel.app](https://movie-app-gold-five.vercel.app/)

---

## ✨ Key Features

### 🎥 Movie Browsing & Discovery
- Browse trending, popular, and top-rated movies via **TMDB API**
- Full-text search with instant results
- Advanced filtering by genre, year, and rating
- Detailed movie pages with trailers, cast info, and descriptions

### 📤 Direct-to-Cloud Video Upload
- Upload videos directly from the browser to **Supabase Storage** — completely bypassing the Node.js server
- Only lightweight JSON metadata (title, video URL) is sent to the backend
- **Zero server bandwidth consumed** for video file transfers

### 🔐 Authentication & Authorization
- Secure user authentication powered by **Supabase Auth**
- JWT token verification on the backend via **JWKS (JSON Web Key Set)**
- Role-based access control with `authMiddleware` and `adminOnly` guards

### 💾 Personal Collections
- **Favorites** — Save movies to a personal favorites list
- **Watchlists** — Create multiple custom lists and organize movies into playlists
- Toggle add/remove with duplicate-prevention logic

### 💬 Community Interaction
- Comment on any movie with real-time persistence
- Comments stored in **Supabase PostgreSQL** with user attribution

---

## 🛠 Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with functional components & hooks |
| **React Router 7** | Client-side routing & navigation |
| **SCSS / CSS Modules** | Modular, scoped styling |
| **Axios** | HTTP client for API calls |
| **Supabase JS SDK** | Auth, Storage, and PostgreSQL client |
| **Swiper** | Touch-friendly movie carousels |
| **React Toastify** | Toast notifications |
| **MUI Icons + FontAwesome** | Icon libraries |
| **React Lazy Load** | Image lazy loading for performance |

### Backend (`/server`)

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server runtime |
| **Express 5** | Web framework |
| **MongoDB Atlas + Mongoose** | NoSQL database for movie metadata |
| **Helmet** | Security headers (XSS, clickjacking protection) |
| **express-rate-limit** | DDoS protection (100 req / 15 min per IP) |
| **Joi** | Request body & query validation |
| **jose** | JWT verification via Supabase JWKS |
| **Morgan** | HTTP request logging |

### Cloud Services

| Service | Purpose |
|---------|---------|
| **Supabase Auth** | User registration & login |
| **Supabase Storage** | Video file hosting (`.mp4`, `.mov`) |
| **Supabase PostgreSQL** | Relational data (favorites, watchlists, comments) |
| **MongoDB Atlas** | Movie metadata storage |
| **TMDB API** | Movie catalog data source |
| **Vercel** | Frontend deployment |
| **Railway** | Backend deployment |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│                     Vercel / localhost:3000                   │
├──────────────┬──────────────────┬────────────────────────────┤
│              │                  │                            │
│   TMDB API   │   Express API    │      Supabase (BaaS)       │
│   (Movies)   │   (Railway)      │                            │
│              │   localhost:5000  │  ┌──────────────────────┐  │
│  - Search    │                  │  │  Auth (JWT)          │  │
│  - Trending  │  - POST movie    │  │  Storage (Videos)    │  │
│  - Details   │  - GET movies    │  │  PostgreSQL:         │  │
│              │  - PUT / DELETE  │  │   - favorites        │  │
│              │                  │  │   - watchlists       │  │
│              │   ┌──────────┐   │  │   - comments         │  │
│              │   │ MongoDB  │   │  └──────────────────────┘  │
│              │   │ Atlas    │   │                            │
│              │   └──────────┘   │                            │
└──────────────┴──────────────────┴────────────────────────────┘
```

### Upload Flow (Zero-Server-Load Architecture)

```
1. Browser ──── Video File ────→ Supabase Storage (direct upload)
2. Supabase ─── Public URL ───→ Browser
3. Browser ──── { title, videoUrl } (JSON) ──→ Express API
4. Express ──── Save metadata ──→ MongoDB
```

> The video file never touches the Node.js server — **100% bandwidth offloaded** to Supabase CDN.

---

## 📁 Project Structure

```
movieapp/
├── client/                          # Frontend (React)
│   ├── public/
│   └── src/
│       ├── Component/
│       │   ├── MovieList/           # Movie cards, details, genre lists
│       │   ├── Upload/              # Video upload form
│       │   ├── User/                # Auth, Favorites, Watchlists
│       │   ├── Comment.js           # Movie comments
│       │   ├── FilterBar.jsx        # Genre/year/rating filters
│       │   ├── HeroSection.js       # Landing page hero
│       │   ├── SearchBar.js         # Search input
│       │   └── Footer.js
│       ├── NAV/                     # Navigation bar
│       ├── supabaseClient.js        # Supabase SDK + helper functions
│       └── App.js                   # Root component & routing
│
├── server/                          # Backend (Node.js / Express)
│   ├── controllers/
│   │   └── movieController.js       # CRUD logic (GET, POST, PUT, DELETE)
│   ├── middlewares/
│   │   ├── authMiddleware.js        # Supabase JWT verification (JWKS)
│   │   ├── errorHandler.js          # Global error handler + AppError class
│   │   └── validate.js              # Joi validation schemas
│   ├── models/
│   │   └── Movie.js                 # Mongoose schema with text index
│   ├── routes/
│   │   └── movieRoutes.js           # API route definitions
│   ├── index.js                     # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [Supabase](https://supabase.com/) project (free tier works)
- [TMDB API Key](https://www.themoviedb.org/settings/api) (free)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movieapp.git
cd movieapp
```

### 2. Set up environment variables

**`client/.env`**

```env
REACT_APP_API_KEY=your_tmdb_api_key
REACT_APP_BASE_URL=https://api.themoviedb.org/3
REACT_APP_API_SERVER=http://localhost:5000
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`server/.env`**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/movie-app
SUPABASE_URL=https://your-project.supabase.co
CLIENT_URL=http://localhost:3000
```

### 3. Set up Supabase tables

Run the following SQL in Supabase SQL Editor to create the required tables:

```sql
-- Favorites
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  movie_id INTEGER NOT NULL,
  movie_title TEXT,
  poster TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Watchlists
CREATE TABLE watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Watchlist Movies
CREATE TABLE watchlist_movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  title TEXT,
  poster_path TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(watchlist_id, movie_id)
);

-- Comments
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  username TEXT,
  movie_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

### 4. Install & Run

**Backend:**

```bash
cd server
npm install
npm start        # Production
npm run dev      # Development (auto-reload)
```

**Frontend:**

```bash
cd client
npm install
npm start        # Opens http://localhost:3000
```

---

## 🌐 Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | **Vercel** | [movie-app-gold-five.vercel.app](https://movie-app-gold-five.vercel.app/) |
| Backend | **Railway** | Auto-deployed from GitHub |
| Database | **MongoDB Atlas** | Cloud-hosted (free tier) |
| BaaS | **Supabase** | Auth + Storage + PostgreSQL |

---

## 🔒 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/movies` | Get all movies (paginated) |
| `GET` | `/api/movies/:id` | Get movie by ID |
| `GET` | `/api/movies?search=keyword` | Full-text search |

### Protected Routes (requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/movies/upload` | Create a new movie |
| `PUT` | `/api/movies/:id` | Update movie info |
| `DELETE` | `/api/movies/:id` | Delete a movie |

---

## 📄 License

This project is for educational and portfolio purposes.
