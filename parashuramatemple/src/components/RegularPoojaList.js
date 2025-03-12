import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./styles/RegularPoojaList.css"; // Ensure this file exists for styling

const RegularPoojaList = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [poojaList, setPoojaList] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [searched, setSearched] = useState(false); // Controls table visibility

  const fetchPoojaList = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/regular-pooja-list?start_date=${startDate}&end_date=${endDate}`
      );
      setPoojaList(response.data);
      setDataFetched(true);
      setSearched(true); // Show table only after search
    } catch (error) {
      console.error("Error fetching pooja list:", error);
      setPoojaList([]);
      setDataFetched(true);
      setSearched(true);
    }
  };

  const downloadPDF = () => {
    if (poojaList.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Regular Pooja List", 14, 15);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 25);

    const columns = ["Name", "Pooja Name", "Pooja Date", "Rashi", "Nakshatra", "Gotra"];
    const rows = poojaList.map((pooja) => [
      pooja.name,
      pooja.pooja_name,
      new Date(pooja.pooja_date).toLocaleDateString("en-CA"),
      pooja.rashi && pooja.rashi !== "N/A" ? pooja.rashi : "",
      pooja.nakshatra && pooja.nakshatra !== "N/A" ? pooja.nakshatra : "",
      pooja.gotra && pooja.gotra !== "N/A" ? pooja.gotra : "",
    ]);

    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Regular_Pooja_List_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="regular-pooja-container">
      <h2>Regular Pooja List / ನಿಯಮಿತ ಪೂಜೆ ಪಟ್ಟಿ</h2>

      <div className="filter-section">
        <label>Start Date / ಪ್ರಾರಂಭ ದಿನಾಂಕ:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: "40%", padding: "5px", fontSize: "16px" }}
        />

        <label>End Date / ಅಂತಿಮ ದಿನಾಂಕ:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: "40%", padding: "5px", fontSize: "16px" }}
        />

        <button
          onClick={fetchPoojaList}
          disabled={!startDate || !endDate}
          className="search-btn"
          style={{
            padding: "8px 15px",
            fontSize: "16px",
            marginLeft: "10px",
            cursor: startDate && endDate ? "pointer" : "not-allowed",
            backgroundColor: startDate && endDate ? "rgb(92,2,2)" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
      </div>

      {searched && (
        <>
          {poojaList.length > 0 ? (
            <>
              <div className="download-section">
                <button onClick={downloadPDF} className="download-btn">
                  Download PDF
                </button>
              </div>

              <table className="pooja-table">
                <thead>
                  <tr>
                    <th>Name / ಹೆಸರು</th>
                    <th>Pooja Name / ಪೂಜೆ ಹೆಸರು</th>
                    <th>Pooja Date / ಪೂಜೆ ದಿನಾಂಕ</th>
                    <th>Rashi / ರಾಶಿ</th>
                    <th>Nakshatra / ನಕ್ಷತ್ರ</th>
                    <th>Gotra / ಗೋತ್ರ</th>
                  </tr>
                </thead>
                <tbody>
                  {poojaList.map((pooja) => (
                    <tr key={pooja.id}>
                      <td>{pooja.name}</td>
                      <td>{pooja.pooja_name}</td>
                      <td>{new Date(pooja.pooja_date).toLocaleDateString("en-CA")}</td>
                      <td>{pooja.rashi && pooja.rashi !== "N/A" ? pooja.rashi : ""}</td>
                      <td>{pooja.nakshatra && pooja.nakshatra !== "N/A" ? pooja.nakshatra : ""}</td>
                      <td>{pooja.gotra && pooja.gotra !== "N/A" ? pooja.gotra : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="no-data-message">No records found for the selected date range.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RegularPoojaList;
