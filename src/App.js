import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth, logoutAdmin } from "./firebase";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Activities from "./components/Activities";
import Projects from "./components/Projects";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

// Styles
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} handleLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute user={user}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
