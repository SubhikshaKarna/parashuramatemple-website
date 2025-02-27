import React, { useState, useEffect } from "react";
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.parentName.trim()) newErrors.parentName = "Parent name is required.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = "Enter a valid 10-digit mobile number.";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Enter a valid email address.";
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "Enter a valid 6-digit pincode.";
    if (!formData.zone) newErrors.zone = "Please select a zone.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            { label: "Email (ಇಮೇಲ್)", name: "email", type: "email", required: true },
            { label: "Pincode (ಪಿನ್ ಕೋಡ್)", name: "pincode", type: "text", required: true },
            { label: "Rashi (ರಾಶಿ)", name: "rashi", type: "text" },
            { label: "Nakshatra (ನಕ್ಷತ್ರ)", name: "nakshatra", type: "text" },
            { label: "Gotra (ಗೋತ್ರ)", name: "gotra", type: "text" },
          ].map((field, index) => (
            <div key={index} className="form-group">
              <label>{field.label} {field.required && "*"}</label>
              <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} />
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}

          {/* Zone Dropdown */}
          <div className="form-group">
            <label>Zone (ವಲಯ) *</label>
            <select name="zone" value={formData.zone} onChange={handleChange}>
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
              <label>Address Line {num}</label>
              <input type="text" name={`address${num}`} value={formData[`address${num}`]} onChange={handleChange} />
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Preview Modal */}
      {isModalOpen && (
        <div className="modal">
          <h3>Review Your Information</h3>
          {Object.entries(previewData).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
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
