import React from 'react';
import { Button } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footerDiv">
      <div>
        <img className="tmdbLogo" src="../src/assets/tmdb.svg" alt="" />
      </div>
      <div>
        <p>&copy; 2024 My Watchlist. All rights reserved.</p>

        <p>Disclaimer: This website is for informational purposes only.</p>
        {/* <p>
          <a href="#top">Back to Top</a>
        </p> */}
      </div>
      <Button className="buton signInButon">Contact us</Button>
    </footer>
  );
};

export default Footer;
