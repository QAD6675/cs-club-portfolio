import React, { useState, useEffect } from "react";
import { auth, loginAdmin } from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin panel if already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/admin-panel");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", email); // Debug log
      await loginAdmin(email, password);
      setError("");
      setEmail("");
      setPassword("");
      navigate("/admin-panel");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="login-subtitle">Last updated: 2025-03-02 18:02:04</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="debug-info">Current User: QAD6675</div>
      </div>
    </div>
  );
}

export default AdminLogin;
