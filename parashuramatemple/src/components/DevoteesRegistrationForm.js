import React, { useState, useEffect, useRef } from "react";
import "./DevoteesRegistrationForm.css";

const DevoteesRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    parentName: "",
    dob: "",
    mobile: "",
    email: "",
    pincode: "",
    zone: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    rashi: "",
    nakshatra: "",
    gotra: "",
  });

  const [errors, setErrors] = useState({});
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const firstInvalidRef = useRef(null);

  // Fetch zones from backend
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-zones");
        const data = await response.json();
        setZones(data);
      } catch (error) {
        console.error("Failed to fetch zones:", error);
      }
    };
    fetchZones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Remove red border once a value is entered
    if (value.trim() !== "") {
      e.target.style.border = "1px solid #ccc"; // Reset border color
    }
  };
  
  

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "";
    if (!formData.parentName.trim()) newErrors.parentName = "";
    if (!formData.dob) newErrors.dob = "";
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = "";
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "";
    if (!formData.zone) newErrors.zone = "";
    if (!formData.address1.trim()) newErrors.address1 = "";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus the first invalid input field
      const firstInvalidField = Object.keys(newErrors)[0];
      firstInvalidRef.current = document.getElementsByName(firstInvalidField)[0];
      if (firstInvalidRef.current) {
        firstInvalidRef.current.style.border = "2px solid red";
        firstInvalidRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const fullAddress = `${formData.address1} ${formData.address2} ${formData.address3} ${formData.address4}`;
      const formDataToSend = { ...formData, address: fullAddress };

      setPreviewData(formDataToSend);
      setIsModalOpen(true); // Open the preview modal
    }
  };

  // Confirm Submission
  const handleConfirmSubmission = async () => {
    try {
      const response = await fetch("http://localhost:5000/register-devotee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(previewData),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccessModalOpen(true);
        setFormData({
          name: "",
          parentName: "",
          dob: "",
          mobile: "",
          email: "",
          pincode: "",
          zone: "",
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          rashi: "",
          nakshatra: "",
          gotra: "",
        });
        setIsModalOpen(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to register devotee:", error);
      alert("⚠️ Failed to register devotee");
    }
  };

  return (
      <div className="devotees-form-container">
        <h2>Devotees Registration(ಭಕ್ತರ ನೋಂದಣಿ)</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Form Fields */}
            {[
              { label: "Name (ಹೆಸರು)", name: "name", type: "text", required: true },
              { label: "Father/Mother Name (ತಂದೆ/ತಾಯಿ ಹೆಸರು)", name: "parentName", type: "text", required: true },
              { label: "Date of Birth (ಜನ್ಮ ದಿನಾಂಕ)", name: "dob", type: "date", required: true },
              { label: "Mobile No (ಮೊಬೈಲ್ ಸಂಖ್ಯೆ)", name: "mobile", type: "text", required: true },
              { label: "Email (ಇಮೇಲ್)", name: "email", type: "email" },
              { label: "Pincode (ಪಿನ್ ಕೋಡ್)", name: "pincode", type: "text", required: true },
              { label: "Rashi (ರಾಶಿ)", name: "rashi", type: "text" },
              { label: "Nakshatra (ನಕ್ಷತ್ರ)", name: "nakshatra", type: "text" },
              { label: "Gotra (ಗೋತ್ರ)", name: "gotra", type: "text" },
            ].map((field, index) => (
              <div key={index} className="form-group">
                <label>{field.label} {field.required && "*"}</label>
                <input 
                  type={field.type} 
                  name={field.name} 
                  value={formData[field.name]} 
                  onChange={handleChange} 
                  className={errors[field.name] ? "error-border" : ""}
                />
                {errors[field.name] && <span className="error">{errors[field.name]}</span>}
              </div>
            ))}

            {/* Zone Dropdown */}
            <div className="form-group">
              <label>Zone (ವಲಯ) *</label>
              <select 
                name="zone" 
                value={formData.zone} 
                onChange={handleChange} 
                className={errors.zone ? "error-border" : ""}
              >
                <option value="">Select Zone</option>
                {zones.map((zone, index) => (
                  <option key={index} value={zone.name}>{zone.name}</option>
                ))}
              </select>
              {errors.zone && <span className="error">{errors.zone}</span>}
            </div>

            {/* Address Fields */}
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="form-group">
                <label>Address Line {num} {num === 1 && "*"}</label>
                <input 
                  type="text" 
                  name={`address${num}`} 
                  value={formData[`address${num}`]} 
                  onChange={handleChange} 
                  className={num === 1 && errors.address1 ? "error-border" : ""}
                />
                {num === 1 && errors.address1 && <span className="error">{errors.address1}</span>}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <button type="submit">Submit</button>
          </div>
        </form>



      {/* Preview Modal */}
      {isModalOpen && (
        <div className="modal">
          <h3>Review Your Information</h3>
          {Object.entries(previewData).map(([key, value]) => {
            if (key.startsWith("address") && key !== "address") return null; // Skip individual address lines
            return (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            );
          })}
          <button onClick={handleConfirmSubmission}>Confirm</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}


      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="modal">
          <h3>Registration Successful!</h3>
          <p>Thank you for registering.</p>
          <button onClick={() => setIsSuccessModalOpen(false)}>OK</button>
        </div>
      )}
    </div>
  );
};

export default DevoteesRegistrationForm;
