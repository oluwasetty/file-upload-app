// Import React library
import React from 'react';

// Import CSS module for styling
import Styles from './style.module.css';

// Footer component
const Footer = props => {
  // Render the footer component
  return (
    <footer className={Styles?.footer}>
      <div>
        {/* Display copyright information */}
        <p>Copyright &copy; 2024</p>
      </div>
    </footer>
  );
}

// Export Footer component
export default Footer;
