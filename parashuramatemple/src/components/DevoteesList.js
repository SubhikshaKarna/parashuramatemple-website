import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DevoteesList.css";

const DevoteesList = () => {
  const [name, setName] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [focusedColumn, setFocusedColumn] = useState(null);
  const [zones, setZones] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [originalDevotee, setOriginalDevotee] = useState(null);

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
    const response = await axios.get(`http://localhost:5000/devotees?name=${name}`);
    setDevotees(response.data);
    setSearchPerformed(true); // Ensure message displays when no results are found
  } catch (error) {
    console.error("⚠️ Error fetching devotees:", error);
    setDevotees([]); // Clear any previous data
    setSearchPerformed(true); // Ensures "No data found" message appears
  }
};


  const handleEdit = (devotee) => {
    setEditingDevotee(devotee);
    setOriginalDevotee({ ...devotee });
  };

  const validateFields = () => {
    const { email, mobile, pincode } = editingDevotee;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^[6-9]\d{9}$/;
    const pincodePattern = /^\d{6}$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("⚠️ Invalid email format! Please enter a valid email.");
      return false;
    }
    if (!mobilePattern.test(mobile)) {
      setErrorMessage("⚠️ Invalid mobile number! It should be 10 digits and start with 6-9.");
      return false;
    }
    if (!pincodePattern.test(pincode)) {
      setErrorMessage("⚠️ Invalid pincode! It should be exactly 6 digits.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      await axios.put(`http://localhost:5000/devotees/${editingDevotee.id}`, editingDevotee);

      const changedColumns = Object.keys(editingDevotee)
        .filter((key) => editingDevotee[key] !== originalDevotee[key]);

      setSuccessMessage(`✅ Changes saved successfully! Updated columns: ${changedColumns.join(", ")}`);

      setEditingDevotee(null);
      setFocusedColumn(null);
      fetchDevotees();
    } catch (error) {
      console.error("⚠️ Error updating devotee:", error);
    }
  };

  const handleCancel = () => {
    setEditingDevotee(null);
    setFocusedColumn(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Search Devotees</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="custom-input"
        placeholder="Enter name"
      />


      <button onClick={fetchDevotees} className="ml-2 bg-blue-500 text-white p-2">
        Search
      </button>
      <br></br>
      {searchPerformed && devotees.length === 0 && <p className="mt-4 text-red-500">No data found</p>}
      {searchPerformed && devotees.length > 0 && (
        <table className="w-full mt-4 border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Parent</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Pincode</th>
              <th className="border p-2">Zone</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devotees.map((devotee) => (
              <tr key={devotee.id} className={editingDevotee?.id === devotee.id ? "editing-row" : ""}>
                <td className="border p-2">{devotee.id}</td>
                {editingDevotee && editingDevotee.id === devotee.id ? (
                  <>
                    {["name", "parent_name", "dob", "mobile", "email", "pincode", "zone", "address"].map((field) => (
                      <td
                        key={field}
                        className={`border p-2 ${focusedColumn === field ? "wider-column" : ""}`}
                        onClick={() => setFocusedColumn(field)}
                      >
                        {field === "dob" ? (
                          <input
                            type="date"
                            value={editingDevotee[field]}
                            onChange={(e) => setEditingDevotee({ ...editingDevotee, [field]: e.target.value })}
                          />
                        ) : field === "zone" ? (
                          <select
                            value={editingDevotee.zone}
                            onChange={(e) => setEditingDevotee({ ...editingDevotee, zone: e.target.value })}
                          >
                            {zones.map((zone) => (
                              <option key={zone.id} value={zone.name}>
                                {zone.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editingDevotee[field]}
                            onChange={(e) => setEditingDevotee({ ...editingDevotee, [field]: e.target.value })}
                          />
                        )}
                      </td>
                    ))}
                  <td>
                    <div className="save-cancel-container">
                      <button onClick={handleSave} className="bg-green-500 text-white p-2">Save</button>
                      <button onClick={handleCancel} className="bg-red-500 text-white p-2">Cancel</button>
                    </div>
                  </td>

                  </>
                ) : (
                  <>
                    <td className="border p-2">{devotee.name}</td>
                    <td className="border p-2">{devotee.parent_name}</td>
                    <td className="border p-2">{new Date(devotee.dob).toLocaleDateString()}</td>
                    <td className="border p-2">{devotee.mobile}</td>
                    <td className="border p-2">{devotee.email}</td>
                    <td className="border p-2">{devotee.pincode}</td>
                    <td className="border p-2">{devotee.zone}</td>
                    <td className="border p-2">{devotee.address}</td>
                    <td className="border p-2">
                      <button onClick={() => handleEdit(devotee)} className="bg-yellow-500 text-white p-2">Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {errorMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">{errorMessage}</p>
            <button onClick={() => setErrorMessage("")} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">{successMessage}</p>
            <button onClick={() => setSuccessMessage("")} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevoteesList;






