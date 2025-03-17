import React, { useState, useEffect } from "react";
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
import FetchDevoteeDetails from "./FetchDevoteeDetails";
import RegularPoojaList from "./RegularPoojaList"; 

export const Dashboard = ({ userRole, onLogout }) => {
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const storedOption = localStorage.getItem("selectedOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    localStorage.setItem("selectedOption", option);
    setIsMobileSidebarOpen(false); // Close sidebar after selecting an option on mobile
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
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
      case "devotee-details":
        return <FetchDevoteeDetails />;
      case "regular-pooja-list":
        return <RegularPoojaList />;
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
                Pooja Details(Date) / ಪೂಜಾ ವಿವರಗಳು
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("devotee-registration")}>
                Devotee Registration / ಭಕ್ತರ ನೋಂದಣಿ
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("devotee-details")}>
                Devotee Details(Zone) / ಭಕ್ತರ ವಿವರಗಳು
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("regular-pooja-list")}>
                Regular Pooja List / ನಿಯಮಿತ ಪೂಜೆ ಪಟ್ಟಿ
              </div>
              <div className="dashboard-card" onClick={() => handleSelect("update-address")}>
                Update Details / ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Mobile Sidebar Toggle Button */}
      <div className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
          ☰ Menu
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileSidebarOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Menu / ಮೆನು</h2>
        <button className={`sidebar-button ${selectedOption === "dashboard" ? "active" : ""}`} onClick={() => handleSelect("dashboard")}>
          Dashboard / ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
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
        <button className="sidebar-button logout-button" onClick={handleLogout}>
          Logout / ಲಾಗ್ ಔಟ್
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!isMobile && <Header />} {/* Show Header only on non-mobile devices */}
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
};
