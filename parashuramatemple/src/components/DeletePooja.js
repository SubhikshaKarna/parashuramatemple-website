import React, { useState } from "react";
import axios from "axios";
import "./styles/DeletePooja.css";  // Import the CSS for styling

const DeletePooja = () => {
  const [poojaSearchQuery, setPoojaSearchQuery] = useState("");  // State for pooja search
  const [poojaList, setPoojaList] = useState([]);  // State for pooja name results
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [poojaToDelete, setPoojaToDelete] = useState(null);  // Store the pooja to be deleted
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // State to control success popup visibility

  // Handle pooja name search input change
  const handlePoojaSearch = async (event) => {
    const query = event.target.value;
    setPoojaSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search-pooja-names?q=${query}`);
        setPoojaList(response.data);  // Update pooja list based on the search
      } catch (err) {
        console.error("Error fetching pooja names:", err);
        setPoojaList([]);  // Clear pooja list if there is an error
      }
    } else {
      setPoojaList([]);  // Clear list if the search query is empty
    }
  };

  // Show the modal for confirmation before deletion
  const showDeleteModal = (pooja) => {
    setPoojaToDelete(pooja);  // Set the pooja to be deleted
    setShowModal(true);  // Show modal
  };

  // Handle deleting pooja name
  const handleDeletePoojaName = async () => {
    if (poojaToDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/delete/pooja-name/${poojaToDelete.id}`);
        setPoojaList(poojaList.filter((pooja) => pooja.id !== poojaToDelete.id));  // Remove deleted pooja from the list
        setShowSuccessPopup(true);  // Show success popup after deletion
        setShowModal(false);  // Close modal after deletion
      } catch (err) {
        console.error("Error deleting pooja name", err);
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
    setPoojaSearchQuery("");  // Clear search query
    setPoojaList([]);  // Clear pooja list
  };

  return (
    <div className="delete-pooja-container">
      <h2 className="delete-pooja-title">Delete Pooja Name</h2>
      <div className="search-container">
        <input
          type="text"
          value={poojaSearchQuery}
          onChange={handlePoojaSearch}
          className="search-input"
          placeholder="Search Pooja Name"
        />
      </div>
      <ul className="pooja-list">
        {poojaSearchQuery && poojaList.length === 0 ? (
          <li className="no-pooja-message">No pooja names found</li> 
        ) : (
          poojaList.map((pooja) => (
            <li key={pooja.id} className="pooja-item">
              <span className="pooja-name">{pooja.name}</span>
              <button
                className="delete-pooja-btn"
                onClick={() => showDeleteModal(pooja)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Success message popup */}
      {showSuccessPopup && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Pooja name deleted successfully!</p>
            <button className="modal-btn" onClick={closeSuccessPopup}>OK</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this pooja name?</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleDeletePoojaName}>Yes</button>
              <button className="modal-btn" onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePooja;
