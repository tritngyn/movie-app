import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cdiayaofvcjovgcbhupo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaWF5YW9mdmNqb3ZnY2JodXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTE2MjIsImV4cCI6MjA3NTk2NzYyMn0.ebnl4d_ZcVk_mpRas68030yhVrEVeBaFbTwrQk7J6mA";

export const supabase = createClient(supabaseUrl, supabaseKey);

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
      .single();

    if (existing) {
      return {
        success: false,
        message: "Phim đã có trong danh sách yêu thích",
      };
    }

    // Thêm phim vào favorites
    const { data, error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          name: movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        },
      ])
      .select();

    if (error) throw error;

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
 * Thêm phim vào Watchlist
 * @param {Object} movie - Thông tin phim từ TMDB
 * @returns {Promise<Object>} - Kết quả thêm phim
 */
export const addToWatchlist = async (movie) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    // Kiểm tra xem phim đã có trong watchlist chưa
    const { data: existing } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .single();

    if (existing) {
      return { success: false, message: "Phim đã có trong danh sách" };
    }

    // Thêm phim vào watchlist
    const { data, error } = await supabase
      .from("watchlist")
      .insert([
        {
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          name: movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        },
      ])
      .select();

    if (error) throw error;

    return { success: true, message: "Đã thêm vào danh sách", data };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa phim khỏi Watchlist
 * @param {Number} movieId - ID phim từ TMDB
 * @returns {Promise<Object>} - Kết quả xóa phim
 */
export const removeFromWatchlist = async (movieId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

    if (error) throw error;

    return { success: true, message: "Đã xóa khỏi danh sách" };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
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

    if (!user) return false;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single();

    return !!data;
  } catch (error) {
    return false;
  }
};

/**
 * Kiểm tra phim có trong Watchlist không
 * @param {Number} movieId - ID phim từ TMDB
 * @returns {Promise<Boolean>} - True nếu có trong watchlist
 */
export const isInWatchlist = async (movieId) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single();

    return !!data;
  } catch (error) {
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
export const toggleWatchlist = async (movie) => {
  const inWatchlist = await isInWatchlist(movie.id);

  if (inWatchlist) {
    return await removeFromWatchlist(movie.id);
  } else {
    return await addToWatchlist(movie);
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
export const getWatchlist = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("watchlist")
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
