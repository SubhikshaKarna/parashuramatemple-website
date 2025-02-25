import React, { useState } from "react";
import axios from "axios";
import "./DeleteZone.css"; // Ensure you create this CSS file

const DeleteZone = () => {
  const [zoneSearchQuery, setZoneSearchQuery] = useState("");  // State for zone search
  const [zoneList, setZoneList] = useState([]);  // State for zone results
  const [showModal, setShowModal] = useState(false);  // Modal state
  const [zoneToDelete, setZoneToDelete] = useState(null);  // Zone to be deleted
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // Success popup state

  // Handle zone search input change
  const handleZoneSearch = async (event) => {
    const query = event.target.value;
    setZoneSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search-zones?q=${query}`);
        setZoneList(response.data);
      } catch (err) {
        console.error("Error fetching zones:", err);
        setZoneList([]);
      }
    } else {
      setZoneList([]);
    }
  };

  // Show the modal for confirmation before deletion
  const showDeleteModal = (zone) => {
    setZoneToDelete(zone);  // Set the zone to be deleted
    setShowModal(true);  // Show modal
  };

  // Handle deleting zone
  const handleDeleteZone = async () => {
    if (zoneToDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/delete/zone/${zoneToDelete.id}`);
        setZoneList(zoneList.filter((zone) => zone.id !== zoneToDelete.id));  // Remove deleted zone from list
        setShowSuccessPopup(true);  // Show success popup after deletion
        setShowModal(false);  // Close modal after deletion
      } catch (err) {
        console.error("Error deleting zone", err);
      }
    }
  };

  // Close the modal without deleting
  const closeModal = () => {
    setShowModal(false);  // Close modal
  };

  // Close the success popup
  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);  // Close success popup
    setZoneSearchQuery("");  // Clear search query
    setZoneList([]);  // Clear zone list
  };

  return (
    <div className="delete-zone-container">
      <h2 className="delete-zone-title">Delete Zone</h2>
      <div className="search-container">
        <input
          type="text"
          value={zoneSearchQuery}
          onChange={handleZoneSearch}
          placeholder="Search Zone by Name"
          className="search-input"
        />
      </div>
      <div className="zone-list">
        {zoneSearchQuery && zoneList.length === 0 ? (
          <p>No zones found</p>
        ) : (
          zoneList.map((zone) => (
            <div key={zone.id} className="zone-item">
              <span className="zone-name">{zone.name}</span>
              <button
                onClick={() => showDeleteModal(zone)}
                className="delete-zone-btn"
              >
                Delete Zone
              </button>
            </div>
          ))
        )}
      </div>

      {/* Success message popup */}
      {showSuccessPopup && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Zone deleted successfully!</p>
            <button className="modal-btn" onClick={closeSuccessPopup}>OK</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this zone?</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleDeleteZone}>Yes</button>
              <button className="modal-btn" onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteZone;
