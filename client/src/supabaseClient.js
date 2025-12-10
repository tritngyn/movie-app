import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cdiayaofvcjovgcbhupo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaWF5YW9mdmNqb3ZnY2JodXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTE2MjIsImV4cCI6MjA3NTk2NzYyMn0.ebnl4d_ZcVk_mpRas68030yhVrEVeBaFbTwrQk7J6mA";

export const supabase = createClient(supabaseUrl, supabaseKey);

/* FAVORITES */
/**
 * Thêm phim vào Favorites
 * @param {Object} movie - Thông tin phim từ TMDB
 * @returns {Promise<Object>} - Kết quả thêm phim
 */
export const addToFavorites = async (movie) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    // Kiểm tra xem phim đã có trong favorites chưa
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        message: "Phim đã có trong danh sách yêu thích",
      };
    }

    // Thêm phim vào favorites
    // Thêm phim vào favorites (ngăn trùng)
    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title || movie.name,
          poster: movie.poster_path,
        },
      ])
      .select()
      .single();

    if (error) {
      // Nếu lỗi do constraint UNIQUE thì bỏ qua
      if (error.message?.includes("duplicate key value")) {
        return {
          success: false,
          message: "Phim đã có trong danh sách yêu thích",
        };
      }
      throw error;
    }

    return { success: true, message: "Đã thêm vào yêu thích", data };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa phim khỏi Favorites
 * @param {Number} movieId - ID phim từ TMDB
 * @returns {Promise<Object>} - Kết quả xóa phim
 */
export const removeFromFavorites = async (movieId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

    if (error) throw error;

    return { success: true, message: "Đã xóa khỏi yêu thích" };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, message: error.message };
  }
};
/**
 * Kiểm tra phim có trong Favorites không
 * @param {Number} movieId - ID phim từ TMDB
 * @returns {Promise<Boolean>} - True nếu có trong favorites
 */
export const isInFavorites = async (movieId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !movieId) return false;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    return false;
  }
};
/* Watchlist */
/**
 * Tạo danh sách phim mới (createWatchlist)
 */
export const createWatchlist = async (name) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Vui lòng đăng nhập");

    const { data, error } = await supabase
      .from("watchlists")
      .insert([{ user_id: user.id, name }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, message: "Đã tạo danh sách mới", data };
  } catch (error) {
    console.error("Error creating watchlist:", error);
    return { success: false, message: error.message };
  }
};
/**
 * Thêm phim vào Watchlist
 * @param {Object} movie - Thông tin phim từ TMDB
 * @returns {Promise<Object>} - Kết quả thêm phim
 */
/**
 * Thêm phim vào Watchlist cụ thể
 */
export const addToWatchlist = async (movie, watchlistId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Vui lòng đăng nhập");

    if (!watchlistId) throw new Error("Thiếu watchlistId");

    // Kiểm tra phim đã có trong danh sách đó chưa
    const { data: existing } = await supabase
      .from("watchlist_movies")
      .select("id")
      .eq("watchlist_id", watchlistId)
      .eq("movie_id", movie.id)
      .maybeSingle();

    if (existing) {
      return { success: false, message: "Phim đã có trong danh sách" };
    }

    // Thêm phim vào danh sách cụ thể
    const { error } = await supabase.from("watchlist_movies").insert([
      {
        watchlist_id: watchlistId,
        movie_id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
      },
    ]);

    if (error) throw error;

    return { success: true, message: "Đã thêm vào danh sách" };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa phim khỏi Watchlist
 */
export const removeFromWatchlist = async (watchlistId, movieId) => {
  try {
    if (!watchlistId || !movieId)
      throw new Error("Thiếu watchlistId hoặc movieId");

    const { error } = await supabase
      .from("watchlist_movies")
      .delete()
      .eq("watchlist_id", watchlistId)
      .eq("movie_id", movieId);

    if (error) throw error;

    return { success: true, message: "Đã xóa khỏi danh sách" };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return { success: false, message: error.message };
  }
};
/**
 * Kiểm tra phim có trong Watchlist cụ thể không
 */
export const isInWatchlist = async (movieId, watchlistId) => {
  try {
    if (!watchlistId || !movieId) return false;

    const { data } = await supabase
      .from("watchlist_movies")
      .select("id")
      .eq("watchlist_id", watchlistId)
      .eq("movie_id", movieId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
};
/**
 * Toggle phim vào/ra khỏi Favorites
 * @param {Object} movie - Thông tin phim từ TMDB
 * @returns {Promise<Object>} - Kết quả toggle
 */
export const toggleFavorite = async (movie) => {
  const inFavorites = await isInFavorites(movie.id);

  if (inFavorites) {
    return await removeFromFavorites(movie.id);
  } else {
    return await addToFavorites(movie);
  }
};

/**
 * Toggle phim vào/ra khỏi Watchlist
 * @param {Object} movie - Thông tin phim từ TMDB
 * @returns {Promise<Object>} - Kết quả toggle
 */
export const toggleWatchlist = async (movie, watchlistId) => {
  const inWatchlist = await isInWatchlist(movie.id, watchlistId);

  if (inWatchlist) {
    return await removeFromWatchlist(movie.id, watchlistId);
  } else {
    return await addToWatchlist(movie, watchlistId);
  }
};

/**
 * Lấy tất cả phim yêu thích của user
 * @returns {Promise<Array>} - Danh sách phim yêu thích
 */
export const getFavorites = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

/**
 * Lấy tất cả phim trong watchlist của user
 * @returns {Promise<Array>} - Danh sách phim trong watchlist
 */
export const getWatchlists = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};
/**
 * Lấy phim trong danh sách cụ thể
 */
export const getMoviesInWatchlist = async (watchlistId) => {
  const { data, error } = await supabase
    .from("watchlist_movies")
    .select("*")
    .eq("watchlist_id", watchlistId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
  return data;
};
/* 
   COMMENTS
 */

/**
 * Gửi bình luận cho phim
 * @param {number} movieId - TMDB movie ID
 * @param {string} content - Nội dung comment
 */
export const addComment = async (movieId, content) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Vui lòng đăng nhập trước khi bình luận.");

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          user_id: user.id,
          username: user.email.split("@")[0],
          movie_id: movieId,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Lấy tất cả bình luận của 1 phim
 * @param {number} movieId
 */
export const getCommentsByMovie = async (movieId) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }
};
