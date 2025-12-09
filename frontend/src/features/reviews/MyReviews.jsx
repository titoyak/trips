import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/reviews/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div className="loading">Loading reviews...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main">
      <div className="card-container">
        {reviews.length === 0 ? (
          <div className="no-bookings">
            <h2 className="heading-secondary">
              You haven't written any reviews yet!
            </h2>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="reviews__card" key={review.id}>
              <div className="reviews__avatar">
                <img
                  src={`/img/users/${review.user.photo}`}
                  alt={review.user.name}
                  className="reviews__avatar-img"
                />
                <h6 className="reviews__user">{review.user.name}</h6>
              </div>
              <p className="reviews__text">{review.review}</p>
              <div className="reviews__rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`reviews__star reviews__star--${
                      review.rating >= star ? "active" : "inactive"
                    }`}
                  >
                    <use xlinkHref="/img/icons.svg#icon-star"></use>
                  </svg>
                ))}
              </div>
              {review.tour && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <Link to={`/tour/${review.tour.id}`} className="btn-text">
                    View Tour: {review.tour.name}
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default MyReviews;
