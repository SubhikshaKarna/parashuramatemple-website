import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = sessionStorage.getItem("userRole");
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (storedIsLoggedIn && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUserRole(data.role);
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("isLoggedIn", "true");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your network connection.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("isLoggedIn");
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard userRole={userRole} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
