import React, { useEffect, useState } from "react";
import { getAIRecommendations } from "../api";

export default function AIRecommendations({ movieTitle }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieTitle) return;
    setLoading(true);

    getAIRecommendations(movieTitle)
      .then((res) => {
        if (res && res.recommendations) setRecommendations(res.recommendations);
      })
      .finally(() => setLoading(false));
  }, [movieTitle]);

  if (loading) return <p>Loading AI recommendations...</p>;
  if (!recommendations.length) return <p>No recommendations available.</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Because you liked "{movieTitle}" 💡</h3>
      <div style={{ display: "flex", gap: "15px", overflowX: "auto" }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            style={{
              minWidth: "120px",
              textAlign: "center",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "5px",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
              alt={rec.title}
              style={{ borderRadius: "10px", width: "100%" }}
            />
            <p style={{ fontSize: "12px" }}>{rec.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}