// Import React library
import React from 'react';

// Header component
const Header = props => {
  // Inline styles for the navbar and navbar brand
  const styles = {
    navbar: {
      backgroundColor: '#1a1a1a',
      color: '#f97141',
      padding: '10px 50px'
    },
    navbarBrand: {
      color: '#fff',
      fontWeight: 'bold'
    }
  };

  // Render the header component
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={styles.navbar}>
      {/* Render the navbar brand */}
      {/* <span className="navbar-brand" style={styles.navbarBrand}>DragonFly App</span> */}
      <img className="white_logo" src="https://dragonflyai.co/hubfs/logo-white.svg" alt="logo-white" loading="lazy"  style={{maxWidth: '100%', height: 'auto', width: '200px'}}></img>
    </nav>
  );
}

// Export Header component
export default Header;
