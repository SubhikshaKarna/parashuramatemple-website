import React, { useState } from "react";
import axios from "axios";
import "./DeletePoojaRegistration.css";

const DeletePoojaRegistration = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("devotee_name"); // Default search type
  const [poojaList, setPoojaList] = useState([]);
  const [noData, setNoData] = useState(false); // Track if no data is found

  // Handle input change
  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      fetchPoojaRegistrations(query, searchType);
    } else {
      setPoojaList([]);
      setNoData(false);
    }
  };

  // Fetch data from API
  const fetchPoojaRegistrations = async (query, type) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search-pooja-registrations?q=${query}&type=${type}`
      );
      if (response.data.length === 0) {
        setNoData(true);
      } else {
        setPoojaList(response.data);
        setNoData(false);
      }
    } catch (err) {
      console.error("Error fetching pooja registrations:", err);
      setPoojaList([]);
      setNoData(true);
    }
  };

  // Handle deletion
  const handleDeletePoojaRegistration = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/pooja-registration/${id}`);
      setPoojaList(poojaList.filter((pooja) => pooja.id !== id));
      if (poojaList.length === 1) setNoData(true); // If last item is deleted, show "No Data Found"
    } catch (err) {
      console.error("Error deleting pooja registration", err);
    }
  };

  return (
    <div className="delete-pooja-registration-container">
      <h2 className="delete-pooja-registration-title">Delete Pooja Registration</h2>

      <div className="search-container">
        <select
          className="search-type-dropdown"
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setSearchQuery(""); // Reset input on type change
            setNoData(false);
          }}
        >
          <option value="devotee_name">Search by Name</option>
          <option value="devotee_id">Search by Devotee ID</option>
          <option value="pooja_date">Search by Pooja Date</option>
        </select>

        <input
          type={searchType === "pooja_date" ? "date" : "text"}
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
          placeholder={`Search by ${searchType.replace("_", " ")}`}
        />
      </div>

      {noData ? (
        <p className="no-data-message">No Data Found</p>
      ) : (
        poojaList.length > 0 && (
          <table className="pooja-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Devotee ID</th>
                <th>Devotee Name</th>
                <th>Pooja Name</th>
                <th>Pooja Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {poojaList.map((pooja) => (
                <tr key={pooja.id}>
                  <td>{pooja.id}</td>
                  <td>{pooja.devotee_id}</td>
                  <td>{pooja.devotee_name}</td>
                  <td>{pooja.pooja_name}</td>
                  <td>{new Date(pooja.pooja_date).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-pooja-btn" onClick={() => handleDeletePoojaRegistration(pooja.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default DeletePoojaRegistration;
