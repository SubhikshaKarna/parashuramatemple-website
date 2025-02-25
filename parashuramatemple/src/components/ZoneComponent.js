import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ZoneComponent.css";

const ZoneComponent = () => {
  const [zoneName, setZoneName] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [registeredZone, setRegisteredZone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingZones, setExistingZones] = useState([]); // Store existing zones

  // 🔹 Fetch existing zones when component mounts
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-zones");
        const zoneNames = response.data.map((zone) => zone.name.toLowerCase().trim()); // Normalize names
        setExistingZones(zoneNames);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = zoneName.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage("Zone name cannot be empty.");
      setIsErrorModalOpen(true);
      return;
    }

    // 🔹 Check if zone already exists in the fetched list
    if (existingZones.includes(trimmedName)) {
      setErrorMessage("⚠️ Zone name already exists! Please enter a different name.");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/add-zone", { zoneName });
      console.log("Response from server:", response.data);

      setRegisteredZone(zoneName);
      setIsSuccessModalOpen(true);
      setZoneName("");
      setExistingZones([...existingZones, trimmedName]); // Update list of existing zones
    } catch (error) {
      console.error("Error submitting zone:", error);
      setErrorMessage("Failed to register zone. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="zone-form-container">
      <h2>Enter Zone Name</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Zone Name:
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* 🔹 Success Modal */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>✅ Zone Registered Successfully!</h3>
            <p>Zone Name: <strong>{registeredZone}</strong></p>
            <button onClick={() => setIsSuccessModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* 🔹 Error Modal */}
      {isErrorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content error-modal">
            <h3>⚠️ Error</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setIsErrorModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneComponent;
