import React, { useState } from "react";
import axios from "axios";
import styles from "./UpdateAddressForm.module.css"; // Import scoped styles

const UpdateAddressForm = () => {
  const [searchName, setSearchName] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newAddresses, setNewAddresses] = useState({});
  const [noDataFound, setNoDataFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fetchDevotees = async () => {
    if (!searchName.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/devotees?name=${searchName}`);
      setNoDataFound(res.data.length === 0);
      setDevotees(res.data);
    } catch (err) {
      console.error("Error fetching devotees:", err);
      alert("Error fetching data");
    }
  };

  const updateAddress = async (id) => {
    if (!newAddresses[id]) return;
    try {
      await axios.put("http://localhost:5000/update-address", {
        id,
        address: newAddresses[id],
      });
      setShowPopup(true);
      clearScreen();
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Error updating address");
    }
  };

  const clearScreen = () => {
    setSearchName("");
    setDevotees([]);
    setEditingId(null);
    setNewAddresses({});
    setNoDataFound(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles["update-container"]}>
      <h2>Update Address</h2>
      <SearchForm searchName={searchName} setSearchName={setSearchName} fetchDevotees={fetchDevotees} />
      {noDataFound && <p className={styles["update-noData"]}>No data found</p>}
      {devotees.length > 0 && (
        <DevoteesTable
          devotees={devotees}
          editingId={editingId}
          setEditingId={setEditingId}
          newAddresses={newAddresses}
          setNewAddresses={setNewAddresses}
          updateAddress={updateAddress}
        />
      )}
      {showPopup && (
        <div className={styles["update-popup"]}>
          <div className={styles["update-popupContent"]}>
            <p>Address updated successfully!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchForm = ({ searchName, setSearchName, fetchDevotees }) => {
  return (
    <form className={styles["update--searchForm"]} onSubmit={(e) => { e.preventDefault(); fetchDevotees(); }}>
      <input
        type="text"
        placeholder="Enter Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button type="submit" className="search-name" disabled={!searchName.trim()}>Search</button>
    </form>
  );
};

const DevoteesTable = ({ devotees, editingId, setEditingId, newAddresses, setNewAddresses, updateAddress }) => {
  return (
    <table className={styles["update-table"]}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Mobile</th>
          <th>Zone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {devotees.map((devotee) => (
          <tr key={devotee.id}>
            <td>{devotee.id}</td>
            <td>{devotee.name}</td>
            <td>{devotee.mobile}</td>
            <td>{devotee.zone}</td>
            <td>
              {editingId === devotee.id ? (
                <input
                  className={styles["update-addressInput"]}
                  type="text"
                  value={newAddresses[devotee.id] || devotee.address || ""}
                  onChange={(e) => setNewAddresses({ ...newAddresses, [devotee.id]: e.target.value })}
                />
              ) : (
                devotee.address || "N/A"
              )}
            </td>
            <td>
              {editingId === devotee.id ? (
                <button className={styles["update-saveButton"]} onClick={() => updateAddress(devotee.id)}>
                  Save
                </button>
              ) : (
                <button
                  className={styles["update-editButton"]}
                  onClick={() => {
                    setEditingId(devotee.id);
                    setNewAddresses({ ...newAddresses, [devotee.id]: devotee.address || "" });
                  }}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UpdateAddressForm;