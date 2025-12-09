import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
      </nav>
      {/* <div className="header__logo">
        <img src="/img/logo-white.png" alt="Trips logo" />
      </div> */}
      <nav className="nav nav--user">
        {localStorage.getItem("token") ? (
          <>
            {user && user.role === "admin" && (
              <Link to="/create-tour" className="nav__el">
                Create Tour
              </Link>
            )}
            <Link to="/my-bookings" className="nav__el">
              My bookings
            </Link>
            <Link to="/me" className="nav__el">
              <img
                src="/img/users/default.jpg"
                alt="User photo"
                className="nav__user-img"
              />
              <span>My Profile</span>
            </Link>
            <button
              className="nav__el nav__el--logout"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__el">
              Log in
            </Link>
            <Link to="/signup" className="nav__el nav__el--cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
