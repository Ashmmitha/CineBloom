import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { fetchTrending, searchMovies,getAIRecommendations  } from "../api";
import { useDebounce } from "use-debounce";
import "./Home.css";

function Home() {
const [user, setUser] = useState(() => {
  return localStorage.getItem("currentUser");
});
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem("myList");
    return saved ? JSON.parse(saved) : [];
  });
  const [continueWatching, setContinueWatching] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const [currentRecommendationMovie, setCurrentRecommendationMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const rowRef = useRef(null);
  const [debouncedSearch] = useDebounce(search, 500);
  

  // -------------------- FUNCTIONS --------------------
  const toggleMyList = (movie) => {
    setMyList((prevList) => {
      const exists = prevList.find((item) => item.id === movie.id);
      if (exists) {
        return prevList.filter((item) => item.id !== movie.id);
      } else {
        return [...prevList, movie];
      }
    });
  };

  const addToContinue = (item) => {
    if (!continueWatching.find((m) => m.id === item.id)) {
      setContinueWatching([...continueWatching, item]);
    }
  };

  const scroll = (direction) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  const handleMovieClick = (movie) => {
    setCurrentRecommendationMovie(movie);
  };

  const genreMap = { Action: 28, Comedy: 35, Romance: 10749, Horror: 27, Drama: 18 };
const languageMap = {
  All: "All",
  English: "en",
  Hindi: "hi",
  Korean: "ko",
  Japanese: "ja",
};
useEffect(() => {
  localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
}, [continueWatching]);

  // -------------------- FETCH TRENDING --------------------
  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoading(true);
        const data = await fetchTrending();
        const dataWithLinks = data.map((movie) => ({
          ...movie,
          watchLink: `https://www.themoviedb.org/movie/${movie.id}`,
        }));
        setResults(dataWithLinks);
      } catch {
        setError("Failed to load trending movies 😭");
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  // -------------------- SEARCH --------------------
  useEffect(() => {
    const searchData = async () => {
      try {
        setLoading(true);

        if (!debouncedSearch.trim()) {
          const data = await fetchTrending();
          const dataWithLinks = data.map((movie) => ({
            ...movie,
            watchLink: `https://www.themoviedb.org/movie/${movie.id}`,
          }));
          setResults(dataWithLinks);
          return;
        }

        if (debouncedSearch.length < 2) return;

        const data = await searchMovies(debouncedSearch);
        const dataWithLinks = data.map((movie) => ({
          ...movie,
          watchLink: `https://www.themoviedb.org/movie/${movie.id}`,
        }));
        setResults(dataWithLinks);
      } catch {
        setError("Search failed 💔");
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [debouncedSearch]);

  // -------------------- LOCAL STORAGE --------------------
  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

// -------------------- TMDB RECOMMENDATIONS --------------------
useEffect(() => {
  if (myList.length === 0) {
    setRecommendations([]);
    return;
  }
const fetchRecommendations = async () => {
  try {
    if (!myList.length) return;

    const lastMovie = myList[myList.length - 1];
    const type = lastMovie.type === "Series" ? "tv" : "movie";

    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${lastMovie.id}/recommendations?api_key=0803f8e4f55bb4bea443778f9bb90840`
    );

    if (!res.ok) {
      setRecommendations([]);
      return;
    }

    const data = await res.json();

    // 🔥 IF NO RECOMMENDATIONS → FETCH SIMILAR
    if (!data.results || data.results.length === 0) {
      const similarRes = await fetch(
        `https://api.themoviedb.org/3/${type}/${lastMovie.id}/similar?api_key=0803f8e4f55bb4bea443778f9bb90840`
      );

      const similarData = await similarRes.json();

      if (!similarData.results || similarData.results.length === 0) {
        setRecommendations([]);
        return;
      }

      const formattedSimilar = await Promise.all(
        similarData.results.slice(0, 6).map(async (item) => {
          const videoRes = await fetch(
            `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=0803f8e4f55bb4bea443778f9bb90840`
          );

          const videoData = await videoRes.json();

          const trailer = videoData.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          return {
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            overview: item.overview,
            release_date: item.release_date || item.first_air_date,
            vote_average: item.vote_average,
            type: type === "tv" ? "Series" : "Movie",
            trailer: trailer
              ? `https://www.youtube.com/embed/${trailer.key}`
              : null,
          };
        })
      );

      setRecommendations(formattedSimilar);
      return;
    }

    // 🔥 NORMAL RECOMMENDATIONS CASE
    const formattedMain = await Promise.all(
      data.results.slice(0, 6).map(async (item) => {
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=0803f8e4f55bb4bea443778f9bb90840`
        );

        const videoData = await videoRes.json();

        const trailer = videoData.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        return {
          id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          type: type === "tv" ? "Series" : "Movie",
          trailer: trailer
            ? `https://www.youtube.com/embed/${trailer.key}`
            : null,
        };
      })
    );

    setRecommendations(formattedMain);

  } catch (err) {
    console.error("Recommendation error:", err);
    setRecommendations([]);
  }
};
  fetchRecommendations();
}, [myList]);
  const filteredResults = results
  .filter((item, idx) => idx !== bannerIndex) // keep banner out
  .filter((item) => {
    // 1️⃣ Genre filter
    if (selectedGenre === "All") return true;
    const genreId = genreMap[selectedGenre];
    return item.genre_ids?.includes(genreId);
  })
  .filter((item) => {
    // 2️⃣ Language filter
    if (selectedLanguage === "All") return true;
    return item.original_language === languageMap[selectedLanguage];
  });

  // -------------------- JSX --------------------
  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
       Hi, {user ? user : "Guest"} 👋 💖
      </h2>
      <h1 
  className="logo" 
  style={{ cursor: "pointer" }} 
  onClick={() => navigate("/home")}
>
</h1>

      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
<div className="top-buttons">
  <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
  </button>

  <button onClick={() => navigate("/profile")}>
    🌌 My Profile
  </button>

  <button onClick={() => navigate("/")}>
    🏠 Go to Front Page
  </button>

  {user && (
  <button
  onClick={() => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
  }}
>
  Logout
</button>
  )}
</div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* -------------------- FILTERS -------------------- */}
     <div className="netflix-filters">
  <div className="filter-group">
    <h3>Genres</h3>
    {["All", "Action", "Comedy", "Romance", "Horror", "Drama"].map(
      (genre) => (
        <button
          key={genre}
          className={selectedGenre === genre ? "active" : ""}
          onClick={() => setSelectedGenre(genre)}
        >
          {genre}
        </button>
      )
    )}
  </div>
  <div className="filter-group">
    <h3>Language</h3>
    {Object.keys(languageMap).map((lang) => (
      <button
        key={lang}
        className={selectedLanguage === lang ? "active" : ""}
        onClick={() => {
  setSelectedLanguage(lang);
  localStorage.setItem("preferredLanguage", lang);
}}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
</div>

      {/* -------------------- HERO SECTION -------------------- */}
      {results.length > 0 && (
        <div className="hero">
          <img
            key={`img-${results[bannerIndex].id}`}
            src={`https://image.tmdb.org/t/p/original${
              results[bannerIndex].backdrop_path || results[bannerIndex].poster_path
            }`}
            alt={results[bannerIndex].title}
          />
          <div className="hero-overlay">
            <h2>{results[bannerIndex].title}</h2>
          </div>
        </div>
      )}
   
      {/* -------------------- BROWSE ROW -------------------- */}
      <h2 className="section-title">🔥 Browse For You</h2>
      <div className="scroll-wrapper">
        <div className="scroll-row" ref={rowRef}>
       {filteredResults.map((movie) => (
  <Card
    key={movie.id}
    item={movie}
    toggleMyList={toggleMyList}
    isInList={myList.some((m) => m.id === movie.id)}
    myList={myList}
    onClick={() => handleMovieClick(movie)}
    language={languageMap[selectedLanguage]} // remove "-US"
  />
))}   
      </div>
      </div>
{/* -------------------- SMART NETFLIX-STYLE RECOMMENDATIONS -------------------- */}
{recommendations.length > 0 && (
  <div className="recommendation-section">
    <h2 className="section-title">
  Recommended because you liked{" "}
  {myList.length > 0
    ? myList[myList.length - 1].title
    : "🍿"}{" "}
  🍿
</h2>
    <div className="scroll-wrapper">
      <div className="scroll-row">
        {recommendations.map((rec) => (
  <div key={rec.id} className="scroll-card">
    
    <Card
      item={rec}
      toggleMyList={toggleMyList}
      isInList={myList.some((m) => m.id === rec.id)}
      myList={myList}
      onClick={() => setCurrentRecommendationMovie(rec)}
    />
  </div>
))}
      </div>
    </div>
  </div>
)}
{currentRecommendationMovie && (
  <div className="modal">
    <div className="modal-content cinematic">
      <button
        className="close-btn"
        onClick={() => setCurrentRecommendationMovie(null)}
      >
        ✖
      </button>

      {currentRecommendationMovie.trailer ? (
        <iframe
          src={`${currentRecommendationMovie.trailer}?autoplay=1&mute=0&controls=1`}
          width="100%"
          height="400"
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <img
          src={
            currentRecommendationMovie.poster_path
              ? `https://image.tmdb.org/t/p/w500${currentRecommendationMovie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={currentRecommendationMovie.title}
        />
      )}

      <div className="modal-info">
        <h2>{currentRecommendationMovie.title}</h2>
        <p>
          {currentRecommendationMovie.overview ||
            "No description available."}
        </p>
      </div>
    </div>
  </div>
)}
      {/* -------------------- MY LIST -------------------- */}
      {myList.length > 0 && (
        <>
          <h2>💖 My List</h2>
          <div className="scroll-wrapper">
            <div className="scroll-row">
              {myList.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  toggleMyList={toggleMyList}
                  isInList={myList.some((m) => m.id === item.id)}
                  myList={myList}
                  onClick={() => handleMovieClick(item)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;