import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tours`);
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to load tours. Make sure the backend is running.");
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <div className="loading">Loading tours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => (
          <div className="card" key={tour.id}>
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  src={`/img/tours/${tour.image_cover}`}
                  alt={tour.name}
                  className="card__picture-img"
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>

            <div className="card__details">
              <h4 className="card__sub-heading">
                {tour.difficulty} {tour.duration}-day tour
              </h4>
              <p className="card__text">{tour.summary}</p>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                </svg>
                <span>{tour.start_location?.description}</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span>
                  {tour.start_dates && tour.start_dates.length > 0
                    ? new Date(tour.start_dates[0]).toLocaleString("en-us", {
                        month: "long",
                        year: "numeric",
                      })
                    : "TBA"}
                </span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag"></use>
                </svg>
                <span>{tour.locations?.length} stops</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span>{tour.max_group_size} people</span>
              </div>
            </div>

            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>
                <span className="card__footer-text">per person</span>
              </p>
              <p className="card__ratings">
                <span className="card__footer-value">
                  {tour.ratings_average}
                </span>
                <span className="card__footer-text">
                  rating ({tour.ratings_quantity})
                </span>
              </p>
              <a
                href={`/tour/${tour.id}`}
                className="btn btn--green btn--small"
              >
                Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Tours;
