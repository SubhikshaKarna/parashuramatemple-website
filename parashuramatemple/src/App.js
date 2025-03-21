import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard"; 
import { Login } from "./components/Login"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedIsLoggedIn && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  // Login function with backend authentication
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
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("isLoggedIn", "true");
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
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
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
