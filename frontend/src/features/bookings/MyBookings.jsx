import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/bookings/my-tours`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="loading">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main">
      <div className="card-container">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2 className="heading-secondary">
              You haven't booked any tours yet!
            </h2>
          </div>
        ) : (
          bookings.map((booking) => (
            <div className="card" key={booking.id}>
              <div className="card__header">
                <div className="card__picture">
                  <div className="card__picture-overlay">&nbsp;</div>
                  <img
                    src={`/img/tours/${booking.tour.image_cover}`}
                    alt={booking.tour.name}
                    className="card__picture-img"
                  />
                </div>
                <h3 className="heading-tertirary">
                  <span>{booking.tour.name}</span>
                </h3>
              </div>

              <div className="card__details">
                <h4 className="card__sub-heading">
                  {booking.tour.difficulty} {booking.tour.duration}-day tour
                </h4>
                <p className="card__text">{booking.tour.summary}</p>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                  </svg>
                  <span>Las Vegas, USA</span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                  </svg>
                  <span>
                    {booking.tour.start_dates &&
                    booking.tour.start_dates.length > 0
                      ? new Date(booking.tour.start_dates[0]).toLocaleString(
                          "en-us",
                          { month: "long", year: "numeric" }
                        )
                      : "TBA"}
                  </span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-flag"></use>
                  </svg>
                  <span>
                    {booking.tour.locations ? booking.tour.locations.length : 0}{" "}
                    stops
                  </span>
                </div>
                <div className="card__data">
                  <svg className="card__icon">
                    <use xlinkHref="/img/icons.svg#icon-user"></use>
                  </svg>
                  <span>{booking.tour.max_group_size} people</span>
                </div>
              </div>

              <div className="card__footer">
                <p>
                  <span className="card__footer-value">
                    ${booking.tour.price}
                  </span>
                  <span className="card__footer-text"> per person</span>
                </p>
                <p className="card__ratings">
                  <span className="card__footer-value">
                    {booking.tour.ratings_average}
                  </span>
                  <span className="card__footer-text">
                    {" "}
                    rating ({booking.tour.ratings_quantity})
                  </span>
                </p>
                <Link
                  to={`/tour/${booking.tour.id}`}
                  className="btn btn--green btn--small"
                >
                  Details
                </Link>

                {booking.status === "completed" && (
                  <Link
                    to={`/tour/${booking.tour.id}?review=true`}
                    className="btn btn--white btn--small"
                    style={{ marginLeft: "10px" }}
                  >
                    Review
                  </Link>
                )}

                {booking.status === "booked" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="btn btn--red btn--small"
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                )}

                {booking.status === "cancelled" && (
                  <span
                    className="btn btn--red btn--small"
                    style={{
                      cursor: "not-allowed",
                      opacity: 0.6,
                      marginLeft: "10px",
                    }}
                  >
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default MyBookings;
