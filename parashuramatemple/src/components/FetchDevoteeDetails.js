import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./FetchDevoteeDetails.css"; // Add custom styling

const FetchDevoteeDetails = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [isDataPopupOpen, setIsDataPopupOpen] = useState(false);

  useEffect(() => {
    // Fetch all zones from backend
    axios
      .get("http://localhost:5000/get-zones")
      .then((response) => setZones(response.data))
      .catch((error) => console.error("⚠️ Error fetching zones:", error));
  }, []);

  const handleZoneChange = (event) => {
    const zone = event.target.value;
    setSelectedZone(zone);
    fetchDevoteesByZone(zone);
  };

  const fetchDevoteesByZone = (zone) => {
    axios
      .get(`http://localhost:5000/get-devotees?zone=${zone}`)
      .then((response) => {
        if (response.data.length === 0) {
          setNoDataMessage("No devotees found in this zone.");
          setIsModalOpen(true);
        } else {
          setDevotees(response.data);
          setIsDataPopupOpen(true); // Open data popup when data is available
        }
      })
      .catch((error) => {
        console.error("⚠️ Error fetching devotees:", error);
        setNoDataMessage("Failed to retrieve devotees.");
        setIsModalOpen(true);
      });
  };

  const downloadPDF = () => {
    if (devotees.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    let yOffset = 20;

    devotees.forEach((devotee, index) => {
      if (yOffset > 260) {
        doc.addPage();
        yOffset = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(devotee.name, 14, yOffset);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      let addressLines = doc.splitTextToSize(devotee.address, 130);
      doc.text(addressLines, 14, yOffset + 8);

      let addressHeight = addressLines.length * 6;
      doc.text(devotee.pincode, 14, yOffset + 10 + addressHeight);
      doc.text(devotee.mobile, 14, yOffset + 18 + addressHeight);

      let boxHeight = 25 + addressHeight;
      doc.rect(12, yOffset - 5, 140, boxHeight);

      yOffset += boxHeight + 6;
    });

    doc.save("devotee_details.pdf");
  };

  return (
    <div className="fetch-devotees-container">
      <h2>Fetch Devotee Details</h2>

      <div className="form-group">
        <label>Select Zone:</label>
        <select value={selectedZone} onChange={handleZoneChange}>
          <option value="">-- Select Zone --</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.name}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show Button to Open Table Popup */}
      {devotees.length > 0 && (
        <div className="button-container">
          <button className="open-modal-button" onClick={() => setIsDataPopupOpen(true)}>
            View Devotees
          </button>
        </div>
      )}

      {/* Popup Modal for Devotee Data */}
      {isDataPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Devotee Details</h3>
            </div>
            <div className="modal-body">
              <table border="1">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Pincode</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {devotees.map((devotee) => (
                    <tr key={devotee.id}>
                      <td>{devotee.name}</td>
                      <td>{devotee.mobile}</td>
                      <td>{devotee.pincode}</td>
                      <td>{devotee.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="download-button" onClick={downloadPDF}>
                Download PDF
              </button>
              <button className="close-button" onClick={() => setIsDataPopupOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for No Data */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>No Data Found</h3>
            </div>
            <div className="modal-body">
              <p>{noDataMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchDevoteeDetails;
