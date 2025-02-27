import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./styles/RegularPoojaList.css"; // Ensure this file exists for styling

const RegularPoojaList = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [poojaList, setPoojaList] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchPoojaList(selectedDate);
    }
  }, [selectedDate]);

  const fetchPoojaList = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/regular-pooja-list?date=${date}`);
      setPoojaList(response.data);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching pooja list:", error);
      setPoojaList([]);
      setDataFetched(true);
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
    doc.text(`Date: ${selectedDate}`, 14, 25);

    const columns = ["Name", "Pooja Name", "Pooja Date", "Rashi", "Nakshatra", "Gotra"];
    const rows = poojaList.map((pooja) => [
      pooja.name,
      pooja.pooja_name,
      new Date(pooja.pooja_date).toLocaleDateString("en-CA"), // ✅ Fix for correct local date format
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

    doc.save(`Regular_Pooja_List_${selectedDate}.pdf`);
  };

  return (
    <div className="regular-pooja-container">
      <h2>Regular Pooja List / ನಿಯಮಿತ ಪೂಜೆ ಪಟ್ಟಿ</h2>
      
      <div className="filter-section">
        <label>Select Date / ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ:</label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          style={{ width: "50%", padding: "5px", fontSize: "16px" }} // ✅ Set width to 50%
        />
      </div>

      {selectedDate && dataFetched && (
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
                      <td>{new Date(pooja.pooja_date).toLocaleDateString("en-CA")}</td> {/* ✅ Fixed */}
                      <td>{pooja.rashi && pooja.rashi !== "N/A" ? pooja.rashi : ""}</td>
                      <td>{pooja.nakshatra && pooja.nakshatra !== "N/A" ? pooja.nakshatra : ""}</td>
                      <td>{pooja.gotra && pooja.gotra !== "N/A" ? pooja.gotra : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="no-data-message">No records found for the selected date.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RegularPoojaList;
