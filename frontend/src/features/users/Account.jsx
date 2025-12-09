import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

function Account() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "default.jpg",
  });
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  const handleUpdateUserData = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMe`,
        { name: user.name, email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setMessage({ type: "success", text: "Data updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Error updating data",
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMyPassword`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", response.data.access_token);
      setPasswordData({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Error updating password",
      });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <a href="#">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-settings"></use>
                </svg>
                Settings
              </a>
            </li>
            <li>
              <Link to="/my-bookings">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-briefcase"></use>
                </svg>
                My bookings
              </Link>
            </li>
            <li>
              <Link to="/my-reviews">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                My reviews
              </Link>
            </li>
            <li>
              <Link to="/billing">
                <svg>
                  <use xlinkHref="/img/icons.svg#icon-credit-card"></use>
                </svg>
                Billing
              </Link>
            </li>
          </ul>

          {user.role === "admin" && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <li>
                  <a href="#">
                    <svg>
                      <use xlinkHref="/img/icons.svg#icon-map"></use>
                    </svg>
                    Manage tours
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <use xlinkHref="/img/icons.svg#icon-users"></use>
                    </svg>
                    Manage users
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <use xlinkHref="/img/icons.svg#icon-star"></use>
                    </svg>
                    Manage reviews
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <use xlinkHref="/img/icons.svg#icon-briefcase"></use>
                    </svg>
                    Manage bookings
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            {message.text && (
              <div className={`alert alert--${message.type}`}>
                {message.text}
              </div>
            )}

            <form
              className="form form-user-data"
              onSubmit={handleUpdateUserData}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={`/img/users/${user.photo}`}
                  alt="User photo"
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green">
                  Save settings
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form
              className="form form-user-password"
              onSubmit={handleUpdatePassword}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordData.passwordCurrent}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      passwordCurrent: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={passwordData.passwordConfirm}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      passwordConfirm: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green btn--save-password">
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;
