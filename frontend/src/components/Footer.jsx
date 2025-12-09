import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="footer__logo">
        <img src="/img/logo-green.png" alt="Trips logo" />
      </div> */}
      {/* <ul className="footer__nav">
        <li>
          <a href="#">About us</a>
        </li>
        <li>
          <Link to="/become-guide">Become a guide</Link>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul> */}
      <p className="footer__copyright">&copy; Tito Yak. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
