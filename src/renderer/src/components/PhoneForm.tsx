import React, { useState } from 'react';

interface FormProps {
  formData: { phone: string };
  updateFormData: (field: string, value: string) => void;
  error: boolean;
}

const PhoneForm: React.FC<FormProps> = ({ formData, updateFormData, error }) => {
  const [localValue, setLocalValue] = useState(formData.phone);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) || value === '') {
      setLocalValue(value);
      updateFormData('phone', value);
    }
  };

  return (
    <div className="form-container">
      <h2>Enter Your Phone Number</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={localValue}
        onChange={handleInputChange}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error-message">Please enter a valid phone number (digits only).</span>}
    </div>
  );
};

export default PhoneForm;
