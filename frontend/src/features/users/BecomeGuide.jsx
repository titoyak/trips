import React from "react";
import FormInput from "../../components/common/FormInput";
import FormTextArea from "../../components/common/FormTextArea";

const BecomeGuide = () => {
  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Become a Guide</h2>
        <p className="ma-bt-md">
          Are you passionate about travel and nature? Join our team of expert
          guides!
        </p>
        <form className="form">
          <FormInput
            label="Full Name"
            id="name"
            type="text"
            placeholder="Your full name"
            required
          />
          <FormInput
            label="Email address"
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <FormInput
            label="Years of Experience"
            id="experience"
            type="number"
            placeholder="0"
            min="0"
            required
          />
          <FormTextArea
            label="Why do you want to join us?"
            id="motivation"
            rows={4}
            placeholder="Tell us about yourself..."
            required
          />
          <div className="form__group">
            <button className="btn btn--green">Submit Application</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default BecomeGuide;
