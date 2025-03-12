import React, { useState } from "react";
import axios from "axios";
import "./DeleteDevotee.css";  // Add CSS for styling

const DeleteDevotee = () => {
  const [devoteeSearchQuery, setDevoteeSearchQuery] = useState("");  // State for devotee search
  const [devoteeList, setDevoteeList] = useState([]);  // State for devotee name results
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [devoteeToDelete, setDevoteeToDelete] = useState(null);  // Store the devotee to be deleted
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);  // State to control success popup visibility

  // Handle devotee search input change
  const handleDevoteeSearch = async (event) => {
    const query = event.target.value;
    setDevoteeSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search-devotees?q=${query}`);
        setDevoteeList(response.data);  // Update devotee list based on the search
      } catch (err) {
        console.error("Error fetching devotees:", err);
        setDevoteeList([]);  // Clear devotee list if there is an error
      }
    } else {
      setDevoteeList([]);  // Clear list if the search query is empty
    }
  };

  // Show the modal for confirmation before deletion
  const showDeleteModal = (devotee) => {
    setDevoteeToDelete(devotee);  // Set the devotee to be deleted
    setShowModal(true);  // Show modal
  };

  // Handle deleting devotee
  const handleDeleteDevotee = async () => {
    if (devoteeToDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/delete/devotee/${devoteeToDelete.id}`);
        setDevoteeList(devoteeList.filter((devotee) => devotee.id !== devoteeToDelete.id));  // Remove deleted devotee from the list
        setShowSuccessPopup(true);  // Show success popup after deletion
        setShowModal(false);  // Close modal after deletion
      } catch (err) {
        console.error("Error deleting devotee", err);
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
    setDevoteeSearchQuery("");  // Clear search query
    setDevoteeList([]);  // Clear devotee list
  };

  return (
    <div className="delete-devotee-container">
      <h2 className="delete-devotee-title">Delete Devotee</h2>
      <div className="search-container">
        <input
          type="text"
          value={devoteeSearchQuery}
          onChange={handleDevoteeSearch}
          className="search-input"
          placeholder="Search Devotee Name"
        />
      </div>
      <ul className="devotee-list">
        {devoteeSearchQuery && devoteeList.length === 0 ? (
          <li className="no-devotee-message">No devotees found</li>
        ) : (
          devoteeList.map((devotee) => (
            <li key={devotee.id} className="devotee-item">
              <span className="devotee-name">{devotee.name} (ID: {devotee.id})</span>
              <button
                className="delete-devotee-btn"
                onClick={() => showDeleteModal(devotee)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Success message popup */}
      {showSuccessPopup && (
        <div className="deleted-popup">
          <div className="deleted-content">
            <p>Zone deleted successfully!</p>
            <button className="deleted-btn" onClick={closeSuccessPopup}>OK</button>
          </div>
        </div>
      )}


      {/* Confirmation Modal for Deletion */}
      {showModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this devotee?</p>
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleDeleteDevotee}>Yes</button>
              <button className="modal-btnn" onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteDevotee;
