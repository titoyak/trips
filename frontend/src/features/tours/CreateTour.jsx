import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/config";
import FormInput from "../../components/common/FormInput";
import FormTextArea from "../../components/common/FormTextArea";

const CreateTour = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    max_group_size: "",
    difficulty: "easy",
    price: "",
    summary: "",
    description: "",
    image_cover: "tour-1-cover.jpg", // Default for now as we don't have upload yet
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a tour.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/tours/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          max_group_size: parseInt(formData.max_group_size),
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create tour");
      }

      const data = await response.json();
      alert("Tour created successfully!");
      navigate(`/tour/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Create New Tour</h2>
        {error && <div className="error-msg">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <FormInput
            label="Tour Name"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Duration (days)"
            id="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
          />

          <FormInput
            label="Max Group Size"
            id="max_group_size"
            type="number"
            value={formData.max_group_size}
            onChange={handleChange}
            required
            min="1"
          />

          <div className="form__group">
            <label className="form__label" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              className="form__input"
              id="difficulty"
              required
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>

          <FormInput
            label="Price"
            id="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <FormTextArea
            label="Summary"
            id="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={3}
          />

          <FormTextArea
            label="Description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />

          <FormInput
            label="Cover Image (URL or Filename)"
            id="image_cover"
            type="text"
            value={formData.image_cover}
            onChange={handleChange}
            required
          />

          <div className="form__group">
            <button className="btn btn--green">Create Tour</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateTour;
