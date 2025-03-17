import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard"; 
import { Login } from "./components/Login"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check for stored login state on page load
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedIsLoggedIn && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
      setUserRole("admin");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("isLoggedIn", "true");
    } else if (username === "common" && password === "password") {
      setIsLoggedIn(true);
      setUserRole("common");
      localStorage.setItem("userRole", "common");
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid credentials. Please try again.");
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
