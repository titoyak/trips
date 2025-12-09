import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

function Tour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reviewSectionRef = useRef(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tours/${id}`);
        setTour(response.data);
        if (response.data.start_dates && response.data.start_dates.length > 0) {
          setSelectedDate(response.data.start_dates[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError("Failed to load tour details.");
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  useEffect(() => {
    if (
      tour &&
      location.search.includes("review=true") &&
      reviewSectionRef.current
    ) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tour, location]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(
        `${API_BASE_URL}/tours/${id}/reviews`,
        { review: reviewText, rating: parseFloat(rating) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Re-fetch tour to get the updated reviews with full user details
      const tourResponse = await axios.get(`${API_BASE_URL}/tours/${id}`);
      setTour(tourResponse.data);

      setReviewText("");
      setRating(5);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMessage =
        err.response?.data?.detail ||
        "Failed to submit review. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBookTour = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedDate) {
      alert("Please select a start date.");
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/bookings`,
        { tour_id: tour.id, price: tour.price, start_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Tour booked successfully!");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Error booking tour:", err);
      alert(
        "Failed to book tour. You already have an active booking for this tour."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tour...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tour) return <div className="error">Tour not found</div>;

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.image_cover}`}
            alt={tour.name}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name} tour</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {tour.start_location?.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {tour.start_dates && tour.start_dates.length > 0
                    ? new Date(tour.start_dates[0]).toLocaleString("en-us", {
                        month: "long",
                        year: "numeric",
                      })
                    : "TBA"}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.max_group_size} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratings_average} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides &&
                tour.guides.map((guide) => (
                  <div className="overview-box__detail" key={guide.id}>
                    <img
                      src={`/img/users/${guide.photo}`}
                      alt={guide.name}
                      className="overview-box__img"
                    />
                    <span className="overview-box__label">
                      {guide.role === "lead-guide"
                        ? "Lead guide"
                        : "Tour guide"}
                    </span>
                    <span className="overview-box__text">{guide.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
          {tour.description &&
            tour.description.split("\n").map((p, i) => (
              <p className="description__text" key={i}>
                {p}
              </p>
            ))}
        </div>
      </section>

      <section className="section-pictures">
        {tour.images &&
          tour.images.map((img, i) => (
            <div className="picture-box" key={i}>
              <img
                className={`picture-box__img picture-box__img--${i + 1}`}
                src={`/img/tours/${img}`}
                alt={`${tour.name} ${i + 1}`}
              />
            </div>
          ))}
      </section>

      <section className="section-reviews">
        <div className="reviews">
          {tour.reviews &&
            tour.reviews.map((review) => (
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
                      className={`reviews__star reviews__star--${
                        review.rating >= star ? "active" : "inactive"
                      }`}
                      key={star}
                    >
                      <use xlinkHref="/img/icons.svg#icon-star"></use>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {localStorage.getItem("token") && (
          <div className="login-form" ref={reviewSectionRef}>
            <h2 className="heading-secondary ma-bt-lg">Write a review</h2>
            <form className="form" onSubmit={handleReviewSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="rating">
                  Rating
                </label>
                <select
                  id="rating"
                  className="form__input"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="review">
                  Review
                </label>
                <textarea
                  id="review"
                  className="form__input"
                  placeholder="Tell us about your experience"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <div className="form__group">
                <button className="btn btn--green" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="section-cta">
        <div className="cta">
          {/* <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Trips logo" />
          </div> */}
          {tour.images && tour.images.length >= 2 && (
            <>
              <img
                className="cta__img cta__img--1"
                src={`/img/tours/${tour.images[1]}`}
                alt="Tour picture"
              />
              <img
                className="cta__img cta__img--2"
                src={`/img/tours/${tour.images[2]}`}
                alt="Tour picture"
              />
            </>
          )}
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>

            {tour.start_dates && tour.start_dates.length > 0 && (
              <div className="form__group" style={{ marginBottom: "20px" }}>
                <label
                  className="form__label"
                  htmlFor="date"
                  style={{ color: "white" }}
                >
                  Select Start Date
                </label>
                <select
                  id="date"
                  className="form__input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {tour.start_dates.map((date, i) => (
                    <option key={i} value={date}>
                      {new Date(date).toLocaleString("en-us", {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn--green span-all-rows"
              onClick={handleBookTour}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Book tour now!"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Tour;
