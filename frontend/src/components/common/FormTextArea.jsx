import React from "react";

const FormTextArea = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}) => {
  return (
    <div className="form__group">
      <label className="form__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="form__input"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
};

export default FormTextArea;
