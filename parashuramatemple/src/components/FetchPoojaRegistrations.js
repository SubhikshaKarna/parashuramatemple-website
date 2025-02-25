import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./FetchPoojaRegistrations.css";

export const FetchPoojaRegistrations = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(""); // New state for no data message

  const fetchRegistrations = () => {
    setIsButtonClicked(true); // Set to true when the button is clicked

    if (!startDate || !endDate) {
      setDateError("Please select both start and end dates.");
      return; // Don't proceed further if dates are missing
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0); // Set time to 00:00:00
    end.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999 for full day inclusion

    if (start > end) {
      setDateError("Start date cannot be later than end date.");
      return;
    }

    setDateError(""); // Clear any previous errors

    axios
      .get("http://localhost:5000/api/pooja_registrations", {
        params: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
      })
      .then((response) => {
        console.log("Fetched registrations:", response.data);
        if (response.data.length === 0) {
          setNoDataMessage("No data found in this date range.");
          setIsModalOpen(true); // Open the modal to show the message
        } else {
          setRegistrations(response.data);
          setIsModalOpen(true); // Open the modal to display the data
        }
      })
      .catch((error) => {
        console.error("Error fetching registrations:", error);

        if (error.response && error.response.status === 404) {
          // If the backend returns a 404, treat it as 'no data'
          setNoDataMessage("No data found in this date range.");
          setIsModalOpen(true); // Open the modal to show the message
        } else {
          // Handle other errors such as network issues
          setNoDataMessage("Failed to retrieve registrations.");
          setIsModalOpen(true); // Open the modal on error
        }
      });
  };

  const handleInputChange = (field, value) => {
    if (field === "startDate") {
      setStartDate(value);
    } else if (field === "endDate") {
      setEndDate(value);
    }

    if (isButtonClicked) {
      setIsButtonClicked(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };

  const downloadPDF = () => {
    if (registrations.length === 0) {
      alert("No data available to download.");
      return;
    }
  
    const doc = new jsPDF();
    let yOffset = 20;
  
    registrations.forEach((reg, index) => {
      if (yOffset > 260) {
        doc.addPage();
        yOffset = 20;
      }
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(reg.devotee_name, 14, yOffset);
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
  
      let addressLines = doc.splitTextToSize(reg.address, 130); 
      doc.text(addressLines, 14, yOffset + 8);
  
      let addressHeight = addressLines.length * 6;
      doc.text(reg.pincode, 14, yOffset + 10 + addressHeight);
      doc.text(reg.mobile, 14, yOffset + 18 + addressHeight);
  
      let boxHeight = 25 + addressHeight; 
      doc.rect(12, yOffset - 5, 140, boxHeight); 
  
      yOffset += boxHeight + 6;
    });
  
    doc.save("postal_labels.pdf");
  };
  
  
  

  return (
    <div className="fetch-registrations-container">
      <div className="form-section">
        <h2>Retrieve Pooja Registrations</h2>
        <div className="form-group">
          <label htmlFor="start-date-unique">Start Date:</label>
          <input
            type="date"
            id="start-date-unique"
            value={startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            required
            style={{
              borderColor: isButtonClicked && !startDate ? "red" : "",
              boxShadow: isButtonClicked && !startDate ? "0 0 5px red" : "",
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="end-date-unique">End Date:</label>
          <input
            type="date"
            id="end-date-unique"
            value={endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            required
            style={{
              borderColor: isButtonClicked && !endDate ? "red" : "",
              boxShadow: isButtonClicked && !endDate ? "0 0 5px red" : "",
            }}
          />
        </div>
        {dateError && <p style={{ color: "red" }}>{dateError}</p>}
        <button className="fetch-button-unique" onClick={fetchRegistrations}>
          Fetch Registrations
        </button>
      </div>

      {/* Modal for showing "No data found" message */}
      {noDataMessage && (
        <div className="modal-overlay-unique">
          <div className="modal-content-unique">
            <div className="modal-header-unique">No Data Found</div>
            <div className="modal-body-unique">
              <p>{noDataMessage}</p>
            </div>
            <div className="modal-footer-unique">
              <button
                className="close-button-unique"
                onClick={() => {
                  setIsModalOpen(false);
                  setNoDataMessage(""); // Clear the message after closing
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && registrations.length > 0 && (
        <div className="modal-overlay-unique">
          <div className="modal-content-unique">
            <div className="modal-header-unique">Pooja Registrations</div>
            <div className="modal-body-unique">
              <table className="registration-table-unique">
                <thead>
                  <tr>
                    <th>Devotee Name</th>
                    <th>Pooja Name</th>
                    <th>Pooja Date</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Pincode</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={index}>
                      <td>{registration.devotee_name}</td>
                      <td>{registration.pooja_name}</td>
                      <td>{formatDate(registration.pooja_date)}</td>
                      <td>{registration.mobile}</td>
                      <td>{registration.address}</td>
                      <td>{registration.pincode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer-unique">
              <button
                className="close-button-unique"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button className="download-pdf-button-unique" onClick={downloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
