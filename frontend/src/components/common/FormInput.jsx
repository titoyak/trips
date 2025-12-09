import React from "react";

const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  step,
}) => {
  return (
    <div className="form__group">
      <label className="form__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="form__input"
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
      />
    </div>
  );
};

export default FormInput;
