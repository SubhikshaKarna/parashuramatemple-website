import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PoojaComponent.css";

const PoojaComponent = () => {
  const [poojaName, setPoojaName] = useState("");
  const [price, setPrice] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [registeredPooja, setRegisteredPooja] = useState("");
  const [registeredPrice, setRegisteredPrice] = useState("");
  const [existingPoojas, setExistingPoojas] = useState([]);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-pooja-names");
        const poojaNames = response.data.map((pooja) => pooja.name.toLowerCase().trim());
        setExistingPoojas(poojaNames);
      } catch (error) {
        console.error("Error fetching poojas:", error);
      }
    };

    fetchPoojas();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = poojaName.trim().toLowerCase();
    const trimmedPrice = price.trim();

    if (!trimmedName || !trimmedPrice || isNaN(trimmedPrice) || Number(trimmedPrice) <= 0) {
      setIsErrorModalOpen(true);
      return;
    }

    if (existingPoojas.includes(trimmedName)) {
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/add-pooja", { poojaName, price });
      console.log("Response from server:", response.data);
      setRegisteredPooja(poojaName);
      setRegisteredPrice(price);
      setIsSuccessModalOpen(true);
      setPoojaName("");
      setPrice("");
      setExistingPoojas([...existingPoojas, trimmedName]);
    } catch (error) {
      console.error("Error submitting pooja:", error);
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="pooja-form-container">
      <h2>Enter Pooja Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Pooja Name:
          <input type="text" value={poojaName} onChange={(e) => setPoojaName(e.target.value)} required />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>

      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Pooja Registered Successfully!</h3>
            <p>Pooja Name: <strong>{registeredPooja}</strong></p>
            <p>Price: <strong>₹{registeredPrice}</strong></p>
            <button onClick={() => setIsSuccessModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content error-modal">
            <h3>⚠️ Error</h3>
            <p>Pooja name already exists or is invalid. Please try again.</p>
            <button onClick={() => setIsErrorModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoojaComponent;
