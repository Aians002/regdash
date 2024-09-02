import React, { useState } from 'react';

interface FormProps {
  formData: { phone: string };
  updateFormData: (field: string, value: string) => void;
}

const PhoneForm: React.FC<FormProps> = ({ formData, updateFormData }) => {
  const [localValue, setLocalValue] = useState(formData.phone);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric inputs or empty string
    if (/^[0-9]*$/.test(value)) {
      setLocalValue(value);
      updateFormData('phone', value);
      setError(value === '' ? 'Please fill this field.' : ''); // Show error if empty
    } else {
      setError('Only numbers are allowed.');
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
        className="input-field"
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PhoneForm;
