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
  });

  const [errors, setErrors] = useState({});
  const [zones, setZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success modal state
  const [firstErrorField, setFirstErrorField] = useState(""); // Track the top-most error field

  // Fetch zones from the backend
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
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "";
    if (!formData.parentName.trim()) newErrors.parentName = "";
    if (!formData.dob) newErrors.dob = "";
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = "";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "";
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "";
    if (!formData.zone) newErrors.zone = "";

    setErrors(newErrors);

    // Set first error field for red border
    const firstError = Object.keys(newErrors)[0];
    setFirstErrorField(firstError);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const fullAddress = `${formData.address1} ${formData.address2} ${formData.address3} ${formData.address4}`;
      const formDataToSend = { ...formData, address: fullAddress };

      setPreviewData(formDataToSend);
      setIsModalOpen(true); // Open the preview modal
    }
  };

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
        // Show success modal instead of alert
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
        });
        setIsModalOpen(false); // Close the preview modal after successful submission
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to register devotee:", error);
      alert("⚠️ Failed to register devotee");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal if the user cancels
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false); // Close success modal
  };

  return (
    <div className="devotees-form-container">
      <h2>Devotees Registration(ಭಕ್ತರ ನೋಂದಣಿ)</h2>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Form fields */}
          <div className="form-group">
            <label>Name(ಹೆಸರು): *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={firstErrorField === "name" ? "error-border" : ""}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Father/Mother Name (ತಂದೆ/ತಾಯಿ ಹೆಸರು): *</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              className={firstErrorField === "parentName" ? "error-border" : ""}
            />
            {errors.parentName && <span className="error">{errors.parentName}</span>}
          </div>
          <div className="form-group">
            <label>Date of Birth (ಜನ್ಮ ದಿನಾಂಕ): *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={firstErrorField === "dob" ? "error-border" : ""}
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>
          <div className="form-group">
            <label>Mobile No(ಮೊಬೈಲ್ ಸಂಖ್ಯೆ):</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={firstErrorField === "mobile" ? "error-border" : ""}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>
          <div className="form-group">
            <label>Email(ಇಮೇಲ್): *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={firstErrorField === "email" ? "error-border" : ""}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Pincode(ಪಿನ್ ಕೋಡ್): *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={firstErrorField === "pincode" ? "error-border" : ""}
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>
          <div className="form-group">
            <label>Zone (ವಲಯ): *</label>
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className={firstErrorField === "zone" ? "error-border" : ""}
            >
              <option value="">Select Zone(ವಲಯ ಆಯ್ಕೆಮಾಡಿ)</option>
              {zones.map((zone, index) => (
                <option key={index} value={zone.name}>{zone.name}</option>
              ))}
            </select>
            {errors.zone && <span className="error">{errors.zone}</span>}
          </div>
          <div className="form-group">
            <label>Address Line 1(ವಿಳಾಸ ಸಾಲು 1): *</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address Line 2(ವಿಳಾಸ ಸಾಲು 2):</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address Line 3(ವಿಳಾಸ ಸಾಲು 3):</label>
            <input
              type="text"
              name="address3"
              value={formData.address3}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address Line 4(ವಿಳಾಸ ಸಾಲು 4):</label>
            <input
              type="text"
              name="address4"
              value={formData.address4}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" id="submit-btn">Submit</button>
      </form>

        {/* Preview Modal */}
        {isModalOpen && (
          <div className="devotee-modal-container">
            <div className="devotee-modal-content">
              <button className="close-modal-btn" onClick={handleCancel}>&times;</button>
              <h3>Review Your Information</h3>
              <div className="modal-body">
                <p><strong>Name (ಹೆಸರು):</strong> {previewData.name}</p>
                <p><strong>Father/Mother Name(ತಂದೆ/ತಾಯಿ ಹೆಸರು):</strong> {previewData.parentName}</p>
                <p><strong>Date of Birth(ಜನ್ಮ ದಿನಾಂಕ):</strong> {previewData.dob}</p>
                <p><strong>Mobile No(ಮೊಬೈಲ್ ಸಂಖ್ಯೆ):</strong> {previewData.mobile}</p>
                <p><strong>Email(ಇಮೇಲ್):</strong> {previewData.email}</p>
                <p><strong>Pincode(ಪಿನ್ ಕೋಡ್):</strong> {previewData.pincode}</p>
                <p><strong>Zone(ವಲಯ):</strong> {previewData.zone}</p>
                <p><strong>Address(ವಿಳಾಸ):</strong> {previewData.address}</p>
              </div>
              <div className="modal-footer">
                <button className="confirm-btn" onClick={handleConfirmSubmission}>Confirm</button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {isSuccessModalOpen && (
          <div className="devotee-modal-container">
            <div className="devotee-modal-content success-modal">
              <button className="close-modal-btn" onClick={handleSuccessModalClose}>&times;</button>
              <h3>🎉 Registration Successful!(ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!)</h3>
              <p>{previewData.name} has been successfully registered.</p>
              <button className="success-close-btn" onClick={handleSuccessModalClose}>OK</button>
            </div>
          </div>
        )}

    </div>
  );
};

export default DevoteesRegistrationForm;
