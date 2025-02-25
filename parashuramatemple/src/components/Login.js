import React, { useState } from "react";
import Header from "./Header"; // Import Header component
import Footer from "./Footer"; // Import Footer component
import "./Login.css";

export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password); // Call the parent handler
  };

  return (
    <div className="login-page">
      <Header /> {/* Header */}

      <div className="login-content">
        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                <b>Username:</b>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                <b>Password:</b>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      <Footer /> {/* Footer */}
    </div>
  );
};
