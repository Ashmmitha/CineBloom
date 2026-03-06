
function Recommendations({ movies }) {
  return (
    <div>
      <h2 style={{ color: "#6a5acd", marginBottom: "1rem" }}>✨ Recommended for You</h2>
      <div style={{
        display: "flex",
        overflowX: "auto",
        gap: "1rem",
        paddingBottom: "0.5rem"
      }}>
        {movies.map((movie, index) => (
          <div key={index} style={{
            minWidth: "120px",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            padding: "0.5rem",
            textAlign: "center",
            color: "#fff",
            cursor: "pointer",
            transition: "transform 0.3s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src={movie.img} alt={movie.title} style={{ width: "100%", borderRadius: "10px" }} />
            <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;