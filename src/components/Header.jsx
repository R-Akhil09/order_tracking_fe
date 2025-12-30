import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* ---------- STYLES ---------- */
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const buttonStyle = {
  background: "#ef4444",
  border: "none",
  color: "white",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 25px",
        backgroundColor: "#1f2937",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Title */}
      <h2 style={{ margin: 0 }}>📦 Order Tracking System</h2>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Dashboard link */}
        {isLoggedIn && !isDashboardPage && (
          <Link to="/dashboard" style={linkStyle}>
            Dashboard
          </Link>
        )}

        {/* Login / Logout */}
        {!isLoggedIn ? (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        ) : (
          <button onClick={logout} style={buttonStyle}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
