import React from "react";
import "./Header.css"; // Import the CSS file for styling

function Header() {
  console.log("Header component rendered");
  return (
    <header>
      <div className="header">
        <p>
          <span>
            ॥ ಶ್ರೀ ಕಾಲಕಾಮ ಪರಶುರಾಮ ಪ್ರಸನ್ನಃ ॥ ॥ ಪರಶುರಾಮ ನಮಸ್ತುಭ್ಯಂ ವೀರಾಯಾಗ್ನ್ಯುತಕರ್ಮಣೆ ॥ ॥ ಗುರವೇ ಜಗತಾಂ ಬ್ರಹ್ಮನ್ ಭಾರ್ಗವಾಯ ನಮೋ ನಮಃ ॥
          </span>
          <span>
            ॥ ಶ್ರೀ ಕಾಲಕಾಮ ಪರಶುರಾಮ ಪ್ರಸನ್ನಃ ॥ ॥ ಪರಶುರಾಮ ನಮಸ್ತುಭ್ಯಂ ವೀರಾಯಾಗ್ನ್ಯುತಕರ್ಮಣೆ ॥ ॥ ಗುರವೇ ಜಗತಾಂ ಬ್ರಹ್ಮನ್ ಭಾರ್ಗವಾಯ ನಮೋ ನಮಃ ॥
          </span>
        </p>
      </div>

      <div className="nav-header">
        <div className="left-text">
        <pre>	    ಪರಶುರಾಮ ದೇವಸ್ಥಾನ</pre>

        </div>
      </div>
    </header>
  );
}


export default Header;
