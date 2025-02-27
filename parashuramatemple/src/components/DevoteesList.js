import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./DevoteesList.css";

const DevoteesList = () => {
  const [name, setName] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [zones, setZones] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-zones");
        setZones(response.data);
      } catch (error) {
        console.error("⚠️ Error fetching zones:", error);
      }
    };
    fetchZones();
  }, []);

  const fetchDevotees = async () => {
    if (name.trim() === "") return;
    try {
      const response = await axios.get(
        `http://localhost:5000/devotees?name=${name}&timestamp=${new Date().getTime()}`
      );
      setDevotees(response.data);
      setSearchPerformed(true);
    } catch (error) {
      console.error("⚠️ Error fetching devotees:", error);
      setDevotees([]);
      setSearchPerformed(true);
    }
  };

  const handleEdit = (devotee) => {
    const addressParts = devotee.address ? devotee.address.split(", ") : [];

    setEditingDevotee({
      ...devotee,
      dob: devotee.dob ? new Date(devotee.dob).toISOString().split("T")[0] : "",
      address1: addressParts[0] || "",
      address2: addressParts[1] || "",
      address3: addressParts[2] || "",
      address4: addressParts[3] || "",
    });

    setValidationErrors({});
  };

  const validateFields = () => {
    let errors = {};
    let firstInvalidField = null;
  
    const requiredFields = ["name", "dob"];
    for (let field of requiredFields) {
      if (!editingDevotee[field]?.trim()) {
        errors[field] = true;
        firstInvalidField = firstInvalidField || field;
      }
    }
  
    if (editingDevotee.mobile && !/^\d{10}$/.test(editingDevotee.mobile)) {
      errors.mobile = true;
      firstInvalidField = firstInvalidField || "mobile";
    }
  
    if (editingDevotee.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(editingDevotee.email)) {
      errors.email = true;
      firstInvalidField = firstInvalidField || "email";
    }
  
    if (editingDevotee.pincode && !/^\d{6}$/.test(editingDevotee.pincode)) {
      errors.pincode = true;
      firstInvalidField = firstInvalidField || "pincode";
    }
  
    // Keep only the first invalid field
    setValidationErrors(firstInvalidField ? { [firstInvalidField]: true } : {});
  
    return !firstInvalidField; // Return true if no errors
  };
  
  const handleSave = async () => {
    if (!validateFields()) return;

    const fullAddress = [
      editingDevotee.address1,
      editingDevotee.address2,
      editingDevotee.address3,
      editingDevotee.address4,
    ].filter(Boolean).join(", ");

    try {
      await axios.put(`http://localhost:5000/devotees/${editingDevotee.id}`, {
        ...editingDevotee,
        address: fullAddress,
      });

      setDevotees((prevDevotees) =>
        prevDevotees.map((devotee) =>
          devotee.id === editingDevotee.id ? { ...editingDevotee, address: fullAddress } : devotee
        )
      );

      setSuccessMessage("✅ Devotee updated successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);

      setEditingDevotee(null);
    } catch (error) {
      console.error("⚠️ Error updating devotee:", error.response?.data || error);
    }
  };

  const handleCancel = () => {
    setEditingDevotee(null);
  };

  return (
    <div className="formm">
      <div className="container">
        <h2 className="title">Search Devotees</h2>
        <div className="search-container">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="custom-input"
            placeholder="Enter name"
          />
          <button onClick={fetchDevotees} className="search-button">
            Search
          </button>
        </div>

        {successMessage && (
          <div className="success-overlay">
            <div className="success-message">{successMessage}</div>
          </div>
        )}

        {searchPerformed && devotees.length === 0 && <p className="error-message">No data found</p>}

        {searchPerformed && devotees.length > 0 && (
          <div className="table-container">
            <table className="devotees-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devotees.map((devotee) => (
                  <tr key={devotee.id}>
                    <td>{devotee.id}</td>
                    <td>{devotee.name}</td>
                    <td>
                      <button onClick={() => handleEdit(devotee)} className="edit-button">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingDevotee &&
          ReactDOM.createPortal(
            <div className="modal-overlay">
              <div className="modal-content">
                <button onClick={handleCancel} className="close-button">
                  &times;
                </button>
                <h3 className="modal-title">Edit Devotee</h3>
                <div className="modal-grid">
                  {["name", "parent_name", "dob", "mobile", "email", "pincode", "rashi", "nakshatra", "gotra", "address1", "address2", "address3", "address4"].map(
                    (field) => (
                      <div key={field} className="input-group">
                        <label className="input-label">{field.replace("_", " ")}</label>
                        <input
                          type={field === "dob" ? "date" : "text"}
                          value={editingDevotee[field] ?? ""}
                          onChange={(e) => {
                            setEditingDevotee({ ...editingDevotee, [field]: e.target.value });

                            // Remove red border if this field was the invalid one
                            if (validationErrors[field]) {
                              setValidationErrors({});
                            }
                          }}
                          className={`custom-input ${validationErrors[field] ? "input-error" : ""}`}
                        />

                      </div>
                    )
                  )}
                </div>
                <div className="modal-buttons">
                  <button onClick={handleSave} className="save-button">
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default DevoteesList;
