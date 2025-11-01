import React from "react";
import "./MovieCard.scss";

export default function MovieCard({
  image,
  title,
  quality,
  episode,
  rating,
  rank,
}) {
  return (
    <div className="movie-card">
      <div className="movie-image-wrapper">
        {rank && <div className="movie-rank">{rank}</div>}

        <img src={image} alt={title} className="movie-image" />

        <div className="movie-badges">
          {quality && <span className="badge badge-quality">{quality}</span>}
          {rating && <span className="badge badge-rating">{rating}</span>}
        </div>

        {episode && (
          <div className="movie-episode">
            <span>{episode}</span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-titles">{title}</h3>
      </div>
    </div>
  );
}
