import React, { useState, useEffect } from "react";
import axios from "axios";
import './PoojaRegistrationForm.css';

const PoojaRegistrationForm = () => {
  const [devoteeName, setDevoteeName] = useState("");
  const [devoteeId, setDevoteeId] = useState(null);
  const [poojaName, setPoojaName] = useState("");
  const [poojaDate, setPoojaDate] = useState("");
  const [tithi, setTithi] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [poojaNames, setPoojaNames] = useState([]);
  const [devoteeDetails, setDevoteeDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [errors, setErrors] = useState({
    devoteeName: false,
    poojaName: false,
    poojaDate: false,
  });

  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format

  useEffect(() => {
    axios.get("http://localhost:5000/get-pooja-names")
      .then((res) => {
        if (res.data) {
          setPoojaNames(res.data);
        }
      })
      .catch((error) => console.error("Error fetching pooja names:", error));
  }, []);

  const handleDevoteeSearch = (query) => {
    setDevoteeName(query);
    if (query.length > 1) {
      axios.get(`http://localhost:5000/search-devotees?q=${query}`)
        .then((res) => {
          setDevotees(res.data);
          setShowAutocomplete(res.data.length > 0);
        })
        .catch((error) => console.error("Error searching devotees:", error));
    } else {
      setDevotees([]);
      setShowAutocomplete(false);
    }
  };

  const handleDevoteeSelect = (devotee) => {
    setDevoteeName(devotee.name);
    setDevoteeId(devotee.id);
    setDevoteeDetails(devotee);
    setDevotees([]);
    setShowAutocomplete(false);
  };

  const handlePreview = () => {
    // Initialize formErrors with all false
    let formErrors = {
      devoteeName: false,
      poojaName: false,
      poojaDate: false,
    };

    // Check for unfilled fields and mark the first one
    if (!devoteeId) {
      formErrors.devoteeName = true;
    } else if (!poojaName) {
      formErrors.poojaName = true;
    } else if (!poojaDate) {
      formErrors.poojaDate = true;
    }

    setErrors(formErrors);

    // If any error exists, prevent preview
    if (formErrors.devoteeName || formErrors.poojaName || formErrors.poojaDate) {
      return;
    }

    setPreviewData({
      devoteeName: devoteeDetails?.name,
      devoteeId,
      poojaName,
      poojaDate,
      tithi
    });
    setShowPopup(true);
  };

  const handleSaveToDatabase = () => {
    axios.post("http://localhost:5000/register-pooja", {
      devoteeId,
      devoteeName: devoteeDetails?.name,
      poojaName,
      poojaDate,
      tithi
    })
    .then(() => {
      setDevoteeName("");
      setDevoteeId(null);
      setPoojaName("");
      setPoojaDate("");
      setTithi("");
      setDevoteeDetails(null);
      setPreviewData(null);
      setShowPopup(false); // Close the preview popup
      setShowSuccessPopup(true); // Show the success popup
    })
    .catch((error) => {
      console.error("Error registering pooja:", error);
      alert("Error registering pooja. Please try again.");
    });
  };
  

  // Event handler for inputs to remove red border when user starts typing
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (value.trim() !== "") {
      setErrors(prevErrors => ({ ...prevErrors, [field]: false }));
    }
  };

  return (
    <div className="pooja--registration--container">
      <h2>Pooja Registration(ಪೂಜೆ ನೋಂದಣಿ)</h2>
      <br></br>
      <div className="devotee-dropdown-container">
  <label>Devotee Name (ಭಕ್ತರ ಹೆಸರು) : *</label>
  <input
    type="text"
    value={devoteeName}
    onChange={(e) => {
      handleDevoteeSearch(e.target.value);
      handleInputChange(e, "devoteeName");
    }}
    placeholder="Search & Select Devotee"
    className={`devotee-input ${errors.devoteeName ? "error-border" : ""}`}
    onFocus={() => setShowAutocomplete(true)}
  />
  
  {showAutocomplete && devotees.length > 0 && (
    <ul className="devotee-dropdown">
      {devotees.map((devotee) => (
        <li key={devotee.id} onClick={() => handleDevoteeSelect(devotee)}>
          {devotee.name} (ID: {devotee.id})
        </li>
      ))}
    </ul>
  )}
</div>




      <div>
        <label>Pooja Name (ಪೂಜೆ ಹೆಸರು): *</label>
            <select
              className={`pooja--dropdown ${errors.poojaName ? "error-border" : ""}`}
              value={poojaName}
              onChange={(e) => {
                setPoojaName(e.target.value);
                handleInputChange(e, "poojaName");
              }}
            >
              <option value="">Select Pooja</option>
              {poojaNames.length > 0 ? (
                poojaNames.map((pooja) => (
                  <option key={pooja.name} value={pooja.name}>
                    {pooja.name} - ₹{pooja.price}
                  </option>
                ))
              ) : (
                <option disabled>No Pooja Names Available</option>
              )}
            </select>

      </div>

      <div>
        <label> Pooja date (ಪೂಜೆ ದಿನಾಂಕ) : *</label>
        <input
          className={`pooja--date--picker ${errors.poojaDate ? "error-border" : ""}`}
          type="date"
          value={poojaDate}
          min={today} // Setting today's date as the minimum selectable date
          onChange={(e) => {
            setPoojaDate(e.target.value);
            handleInputChange(e, "poojaDate");
          }}
        />
      </div>

      <div>
        <label>Tithi (ತಿಥಿ) (Optional)</label>
        <input
          className="pooja--tithi--input"
          type="text"
          value={tithi}
          onChange={(e) => setTithi(e.target.value)}
          placeholder="Enter Tithi"
        />
      </div>

      <button className="pooja--preview--button" onClick={handlePreview}>Preview Pooja Registration</button>

      <div className={`pooja--popup ${showPopup ? 'show' : ''}`}>
        <div className="pooja--popup--content">
          <h3>Pooja Registration Preview</h3>
          <ul>
            <li><strong>Devotee Name (ಭಕ್ತರ ಹೆಸರು):</strong> {previewData?.devoteeName}</li>
            <li><strong>Devotee ID(ಭಕ್ತರ ID):</strong> {previewData?.devoteeId}</li>
            <li><strong>Pooja Name (ಪೂಜೆ ಹೆಸರು):</strong> {previewData?.poojaName}</li>
            <li><strong>Pooja Date (ಪೂಜೆ ದಿನಾಂಕ):</strong> {previewData?.poojaDate}</li>
            <li><strong>Tithi (ತಿಥಿ) :</strong> {previewData?.tithi}</li>
          </ul>
          <button className="pooja--save--button" onClick={handleSaveToDatabase}>Confirm</button>
          <button className="pooja--close--button" onClick={() => setShowPopup(false)}>Close</button>
        </div>
      </div>
      {showSuccessPopup && (
          <div className="pooja--success--popup">
            <div className="pooja--popup--content">
              <h3>Registration Successful (ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ)!</h3>
              <p>The pooja has been successfully registered.(ಪೂಜೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ)</p>
              <button className="pooja--close--button" onClick={() => setShowSuccessPopup(false)}>Close</button>
            </div>
          </div>
        )}

    </div>
  );
};

export default PoojaRegistrationForm;
