
function Sidebar() {
  return (
    <div style={{
      background: "#1c1c2b",
      color: "#cfcfff",
      width: "220px",
      padding: "1rem",
      borderRadius: "15px",
      height: "fit-content",
      marginRight: "2rem"
    }}>
      <h2 style={{ marginBottom: "1rem" }}>🎯 Preferences</h2>
      <p>Genres: Sci-Fi, Noir</p>
      <p>Language: English</p>
      <p>Age: 12+</p>
    </div>
  );
}

export default Sidebar;
