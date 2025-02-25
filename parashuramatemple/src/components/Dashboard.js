import React, { useState } from "react";
import "./styles/Dashboard.css";
import Header from "./Header";
import PoojaComponent from "./PoojaComponent";
import PoojaRegistrationForm from "./PoojaRegistrationForm";
import { FetchPoojaRegistrations } from "./FetchPoojaRegistrations";
import UpdateAddressForm from "./DevoteesList";
import ZoneComponent from "./ZoneComponent";
import DevoteesRegistrationForm from "./DevoteesRegistrationForm";
import DeleteDevotee from "./DeleteDevotee"; 
import DeleteZone from "./DeleteZone"; 
import DeletePooja from "./DeletePooja"; 
import DeletePoojaRegistration from "./DeletePoojaRegistration"; 

export const Dashboard = ({ userRole }) => {
  const [selectedOption, setSelectedOption] = useState("dashboard");

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "pooja-registration":
        return <PoojaRegistrationForm />;
      case "FetchPoojaRegistration":
        return <FetchPoojaRegistrations />;
      case "update-address":
        return <UpdateAddressForm />;
      case "zone":
        return <ZoneComponent />;
      case "pooja":
        return <PoojaComponent />;
      case "devotee-registration":
        return <DevoteesRegistrationForm />;
      case "delete-devotee":
        return <DeleteDevotee />;
      case "delete-zone":
        return <DeleteZone />;
      case "delete-pooja":
        return <DeletePooja />;
      case "delete-pooja-registration":
        return <DeletePoojaRegistration />;
      case "dashboard":
      default:
        return (
          <div className="dashboard-container">
            <h2 className="dashboard-title">Welcome to the Dashboard / ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ ಸ್ವಾಗತ</h2>
            <div className="card-container">
              <div className="dashboard-card" onClick={() => handleSelect("pooja-registration")}>
                Pooja Registration / ಪೂಜೆ ನೋಂದಣಿ
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("FetchPoojaRegistration")}>
                Pooja Details / ಪೂಜಾ ವಿವರಗಳು
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("devotee-registration")}>
                Devotee Registration / ಭಕ್ತರ ನೋಂದಣಿ
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 className="sidebar-title">Menu / ಮೆನು</h2>
        <button className={`sidebar-button ${selectedOption === "dashboard" ? "active" : ""}`} onClick={() => handleSelect("dashboard")}>
          Dashboard / ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
        </button>
        <button className={`sidebar-button ${selectedOption === "update-address" ? "active" : ""}`} onClick={() => handleSelect("update-address")}>
        Update Details / ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ
        </button>
        <button className={`sidebar-button ${selectedOption === "zone" ? "active" : ""}`} onClick={() => handleSelect("zone")}>
          Zone / ವಲಯ
        </button>
        <button className={`sidebar-button ${selectedOption === "pooja" ? "active" : ""}`} onClick={() => handleSelect("pooja")}>
          Pooja / ಪೂಜೆ
        </button>
        {userRole === "admin" && (
          <>
            <button className={`sidebar-button ${selectedOption === "delete-devotee" ? "active" : ""}`} onClick={() => handleSelect("delete-devotee")}>
              Devotee Delete / ಭಕ್ತರನ್ನು ಅಳಿಸಿ
            </button>
            <button className={`sidebar-button ${selectedOption === "delete-zone" ? "active" : ""}`} onClick={() => handleSelect("delete-zone")}>
              Delete Zone / ವಲಯವನ್ನು ಅಳಿಸಿ
            </button>
            <button className={`sidebar-button ${selectedOption === "delete-pooja" ? "active" : ""}`} onClick={() => handleSelect("delete-pooja")}>
              Delete Pooja / ಪೂಜೆಯನ್ನು ಅಳಿಸಿ
            </button>
            <button className={`sidebar-button ${selectedOption === "delete-pooja-registration" ? "active" : ""}`} onClick={() => handleSelect("delete-pooja-registration")}>
              Delete Pooja Registration / ಪೂಜೆ ನೋಂದಣಿಯನ್ನು ಅಳಿಸಿ
            </button>
          </>
        )}
      </div>

      <div className="main-content">
        <Header />
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
};
