import React, { useState, useEffect } from "react";
import { getAIRecommendations } from "../api";
import "./Card.css";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = "0803f8e4f55bb4bea443778f9bb90840";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDBSimilar(id, type) {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.slice(0, 5).map(item => ({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      because_liked: null,
    }));
  } catch (err) {
    console.error("TMDB similar fetch error:", err);
    return [];
  }
}

function Card({ item, toggleMyList, isInList, myList, language = "en-US",onClick}) {
  const [liked, setLiked] = useState(null);
  const [showSad, setShowSad] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [aiRecs, setAiRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [fullDetails, setFullDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(item.trailer || null);

  const currentMovie = lastAdded || selectedMovie;
  const rating = item.rating || (Math.random() * 2 + 7).toFixed(1);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(true);
    setTimeout(() => setLiked(null), 1000);
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    setLiked(false);
    setShowSad(true);
    setTimeout(() => setShowSad(false), 1500);
  };

  // ---------- AI Recommendations ----------
  useEffect(() => {
    const movieToUse = lastAdded || selectedMovie;
    if (!movieToUse) return;

    setAiRecs([]);
    setLoading(true);

    const type = movieToUse.type === "Series" ? "tv" : "movie";

    getAIRecommendations(movieToUse.title)
      .then(async (res) => {
        let filtered = Array.isArray(res)
          ? res.filter((r) => !myList.some((m) => m.id === r.id))
          : [];

        if (filtered.length === 0) {
          const tmdbRecs = await fetchTMDBSimilar(movieToUse.id, type);
          filtered = tmdbRecs.filter((r) => !myList.some((m) => m.id === r.id));
        }

        const finalRecs = filtered.length > 0
          ? filtered.slice(0, 5)
          : [
              {
                id: 0,
                title: "No AI recommendations found 😢",
                poster_path: null,
                because_liked: movieToUse.title,
              },
            ];

        setAiRecs(
          finalRecs.map((r) => ({
            id: r.id,
            title: r.title,
            poster_path: r.poster_path,
            because_liked: r.because_liked || movieToUse.title,
          }))
        );
      })
      .catch(() => {
        setAiRecs([
          {
            id: 0,
            title: "Error fetching recommendations 😭",
            poster_path: null,
            because_liked: movieToUse.title,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [selectedMovie, lastAdded, myList]);

  // ---------- Fetch Trailer ----------
  useEffect(() => {
    if (trailerUrl) return; // already has trailer

    const fetchTrailer = async () => {
      try {
        const type = item.type === "Series" ? "tv" : "movie";
        const res = await fetch(`${BASE_URL}/${type}/${item.id}/videos?api_key=${API_KEY}`);
        const data = await res.json();
        const trailer = data.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
      } catch (err) {
        console.log("Trailer fetch error:", err);
      }
    };

    fetchTrailer();
  }, [item]);
  // ---------- Fetch Full Movie/Series Details ----------
// ---------- Fetch Full Movie/Series Details with language ----------
useEffect(() => {
  const fetchFullDetails = async () => {
    try {
      const type = item.type === "Series" ? "tv" : "movie";
      const res = await fetch(
        `${BASE_URL}/${type}/${item.id}?api_key=${API_KEY}&language=${language}`
      );
      const data = await res.json();
      setFullDetails(data);
    } catch (err) {
      console.error("Full details fetch error:", err);
    }
  };

  fetchFullDetails();
}, [item, language]);

  return (
    <>
    
      {/* ---------- CARD ---------- */}
      <motion.div
        className="card"
        onClick={() => setSelectedMovie(item)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rating-badge">⭐ {rating}</div>
        {isInList && <div className="mylist-badge">💖</div>}

        <div className="card-media">
          <img
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : "https://dummyimage.com/300x450/222/fff&text=No+Image"
            }
            alt={item.title}
          />
        </div>

        <div className="play-overlay">▶</div>
        <h3>{item.title}</h3>

        <div className="actions">
          <button onClick={handleLike}>👍</button>
          <button onClick={handleDislike}>👎</button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLastAdded(item);
              toggleMyList(item);
            }}
          >
            {isInList ? "Added" : "➕"}
          </button>
        </div>

        {liked && <div className="like-popup">❤️</div>}
        {showSad && <div className="sad-popup">😢</div>}
      </motion.div>

      {/* ---------- MODAL ---------- */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content cinematic"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>✖</button>

              {trailerUrl ? (
                <iframe
                  src={`${trailerUrl}?autoplay=1&mute=0&controls=1`}
                  width="100%"
                  height="400"
                  title="Trailer"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <img
                  src={
                    selectedMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={selectedMovie.title}
                />
              )}

              <div className="modal-info">
                <h2>{selectedMovie.title}</h2>
                <p className="card-description">{fullDetails?.overview || "No description available."}</p>

                <a
                  href={`https://www.themoviedb.org/${selectedMovie.type === "Series" ? "tv" : "movie"}/${selectedMovie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-now-btn"
                >
                  ▶ Watch Now
                </a>

                {/* AI Recommendations */}
                <div className="ai-recommendations">
                  <h3>Recommended because you liked {currentMovie?.title || "🍿"}</h3>
                  {loading && <p style={{ fontStyle: "italic" }}>Loading recommendations...</p>}
                  {!loading && (
                    <div className="ai-list">
                      {aiRecs.map((rec) => (
                        <div key={rec.id} className="ai-card">
                          <img
                            src={
                              rec.poster_path
                                ? `https://image.tmdb.org/t/p/w200${rec.poster_path}`
                                : "https://via.placeholder.com/200x300?text=No+Image"
                            }
                            alt={rec.title}
                          />
                          <p>{rec.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Card;