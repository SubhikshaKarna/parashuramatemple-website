import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard"; // Import Dashboard component
import { Login } from "./components/Login"; // Import Login component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Store user role (admin/common)

  const handleLogin = (username, password) => {
    // Simulating authentication (replace with real authentication later)
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
      setUserRole("admin"); // Admin role
    } else if (username === "common" && password === "password") {
      setIsLoggedIn(true);
      setUserRole("common"); // Common user role
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard userRole={userRole} /> // Pass user role to Dashboard
      ) : (
        <Login onLogin={handleLogin} /> // Render Login component
      )}
    </div>
  );
}

export default App;
