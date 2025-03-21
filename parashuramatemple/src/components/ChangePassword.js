import React, { useState } from "react";
import "./ChangePassword.css";

export const ChangePassword = ({ userRole }) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Please enter a username.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Password updated successfully!");
        setUsername("");
        setOldPassword("");
        setNewPassword("");
        setError(null);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input 
          type="text" 
          placeholder="Enter Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Old Password" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="New Password (Min 6 chars)" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};
