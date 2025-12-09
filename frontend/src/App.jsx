import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { API_BASE_URL } from "./utils/config";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Tour from "./features/tours/Tour";
import Tours from "./features/tours/Tours";
import CreateTour from "./features/tours/CreateTour";
import Account from "./features/users/Account";
import MyBookings from "./features/bookings/MyBookings";
import MyReviews from "./features/reviews/MyReviews";
import Billing from "./features/users/Billing";
import BecomeGuide from "./features/users/BecomeGuide";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header user={user} />

        <Routes>
          <Route path="/" element={<Tours />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tour/:id" element={<Tour />} />
          <Route path="/create-tour" element={<CreateTour />} />
          <Route path="/me" element={<Account />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/become-guide" element={<BecomeGuide />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
