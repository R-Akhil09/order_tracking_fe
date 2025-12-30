import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Lloginn({ setIsLoggedIn }) {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // SINGLE ADMIN CREDENTIALS
  const ADMIN_USERNAME = "Admin";
  const ADMIN_PASSWORD = "Admin@123";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      loginData.username === ADMIN_USERNAME &&
      loginData.password === ADMIN_PASSWORD
    ) {
      setIsLoggedIn(true);
      navigate("/dashboard"); // ADMIN DASHBOARD
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url(/login.jpg)",
        backgroundSize: "cover",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "30px",
          width: "350px",
          borderRadius: "10px",
          background: "rgba(0,0,0,0.7)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "yellow" }}>
          Admin Login
        </h2>

        <label style={{ color: "white" }}>Username</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label style={{ color: "white" }}>Password</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "15px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            background: "red",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Lloginn;
