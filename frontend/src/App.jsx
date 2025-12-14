import React, { useEffect, useState } from "react";
import Api from "./api";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Admin from "./Admin";
import loginImg from "./Loginpage.png";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ss_user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("ss_token");
    if (token) Api.setToken(token);
  }, []);

  function handleAuth({ token, user }) {
    localStorage.setItem("ss_token", token);
    localStorage.setItem("ss_user", JSON.stringify(user));
    Api.setToken(token);
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    Api.setToken(null);
    setUser(null);
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Sweet Shop</h1>
        <div className="controls">
          {user && (
            <>
              <span style={{ marginRight: 12 }}>
                Hello, {user.email}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      {!user ? (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="brand">
              <img
                src={loginImg}
                alt="Sweet Shop"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="form">
              <h2>Welcome</h2>
              <Auth onAuth={handleAuth} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Dashboard />
          {user.role === "admin" && <Admin />}
        </>
      )}
    </div>
  );
}
