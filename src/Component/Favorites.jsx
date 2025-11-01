import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getFavorites } from "../utils/favorites";

export default function Favorites() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const favs = await getFavorites(data.user.id);
        setMovies(favs);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h2>Phim yêu thích</h2>
      <div className="favorites-grid">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="fav-item">
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
