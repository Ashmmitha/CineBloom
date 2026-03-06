function Trending({ movies }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ color: "#a18cd1", marginBottom: "1rem" }}>🔥 Trending Now</h2>
      <div style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto",
        paddingBottom: "0.5rem"
      }}>
        {movies.map((movie, index) => (
          <div key={index} style={{
            minWidth: "150px",
            borderRadius: "15px",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            transition: "transform 0.3s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src={movie.img} alt={movie.title} style={{ width: "150px", height: "225px", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
