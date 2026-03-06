// src/api.js

const API_KEY = "0803f8e4f55bb4bea443778f9bb90840";  
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch YouTube trailer
const fetchTrailer = async (id, type) => {
  try {
    if (type !== "movie" && type !== "tv") return null;

    const res = await fetch(
      `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (!data.results) return null;

    const trailer = data.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    return trailer
      ? `https://www.youtube.com/embed/${trailer.key}`
      : null;
  } catch (error) {
    console.error("Trailer fetch error:", error);
    return null;
  }
};

export const fetchTrending = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch trending");

    const data = await res.json();

    if (!data.results) return [];

    return Promise.all(
      data.results.map(async (item) => {
        const type =
          item.media_type === "movie"
            ? "movie"
            : item.media_type === "tv"
            ? "tv"
            : null;

        const trailer = type ? await fetchTrailer(item.id, type) : null;

  return {
  id: item.id,
  title: item.title || item.name,
  genre_ids: item.genre_ids,
  original_language: item.original_language,
  type: type === "movie" ? "Film" : "Series",
  rating: item.vote_average,
  description: item.overview,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,   // 👈 ADD THIS
  trailer
};
      })
    );
    
  } catch (error) {
    console.error("Trending fetch error:", error);
    return [];
  }
};

export const searchMovies = async (query) => {
  try {
    if (!query) return [];

    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    if (!data.results) return [];

    return Promise.all(
      data.results.map(async (item) => {
        const type =
          item.media_type === "movie"
            ? "movie"
            : item.media_type === "tv"
            ? "tv"
            : null;

        const trailer = type ? await fetchTrailer(item.id, type) : null;

  return {
  id: item.id,
  title: item.title || item.name,
  genre_ids: item.genre_ids,
  original_language: item.original_language,
  type: type === "movie" ? "Film" : "Series",
  rating: item.vote_average,
  description: item.overview,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,   // 👈 ADD THIS
  trailer
};
      })
    );
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};
export const getAIRecommendations = async (title) => {
  try {
    // Special case for Hoppers
    if (title === "Hoppers") {
      return [
        {
          id: 999,
          title: "Hoppers 2: Return",
          poster_path: "/fallback.png",
          because_liked: "Hoppers",
        },
      ];
    }

    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Recommendation fetch failed");

    const data = await res.json();
    return data; // array of recommended movies
  } catch (err) {
    console.error(err);
    return [];
  }
};