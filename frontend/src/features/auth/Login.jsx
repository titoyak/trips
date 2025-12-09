import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import FormInput from "../../components/common/FormInput";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.status === "success" || response.data.access_token) {
        alert("Logged in successfully!");
        // Store token, redirect, etc.
        localStorage.setItem("token", response.data.access_token);
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        {error && <div className="error-msg">{error}</div>}
        <form className="form form--login" onSubmit={handleSubmit}>
          <FormInput
            label="Email address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="form__group">
            <button className="btn btn--green">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
