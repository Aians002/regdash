import React, { useState } from 'react';

// Extend the FormProps interface to include language
interface FormProps {
  formData: { phone: string };
  updateFormData: (field: string, value: string) => void;
  language: string; // Add language prop
}

const PhoneForm: React.FC<FormProps> = ({ formData, updateFormData, language }) => {
  const [localValue, setLocalValue] = useState(formData.phone);
  const [error, setError] = useState('');

  // Language labels and error messages
  const labels = {
    en: {
      heading: 'Enter Your Phone Number',
      placeholder: 'Phone Number',
      errorEmpty: 'Please fill this field.',
      errorInvalid: 'Only numbers are allowed.'
    },
    gu: {
      heading: 'તમારો ફોન નંબર દાખલ કરો',
      placeholder: 'ફોન નંબર',
      errorEmpty: 'કૃપા કરીને આ ક્ષેત્ર ભરો.',
      errorInvalid: 'માત્ર સંખ્યાઓ જ અનુમત્ય છે.'
    },
    hi: {
      heading: 'अपना फोन नंबर दर्ज करें',
      placeholder: 'फोन नंबर',
      errorEmpty: 'कृपया इस क्षेत्र को भरें।',
      errorInvalid: 'केवल संख्याएं मान्य हैं।'
    }
  };

  // Select labels based on the current language
  const selectedLabels = labels[language];

  // Handle input change from numpad and text input
  const handleInputChange = (value: string) => {
    if (/^[0-9]*$/.test(value)) {
      setLocalValue(value);
      updateFormData('phone', value);
      setError(value === '' ? selectedLabels.errorEmpty : ''); // Show error if empty
    } else {
      setError(selectedLabels.errorInvalid);
    }
  };

  // Handle numpad button clicks
  const handleNumpadClick = (num: string) => {
    handleInputChange(localValue + num);
  };

  // Handle backspace button on the numpad
  const handleBackspace = () => {
    handleInputChange(localValue.slice(0, -1));
  };

  return (
    <div className="form-container">
      <h2>{selectedLabels.heading}</h2>
      <input
        type="text"
        placeholder={selectedLabels.placeholder}
        value={localValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="input-field"
        readOnly // Make input read-only to use only numpad
      />
      {error && <div className="error-message">{error}</div>}

      {/* Numpad Component */}
      <div className="numpad-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => handleNumpadClick(num.toString())} className="numpad-button">
            {num}
          </button>
        ))}
        <button onClick={handleBackspace} className="numpad-button">⌫</button>
        <button onClick={() => handleNumpadClick('0')} className="numpad-button">0</button>
      </div>
    </div>
  );
};

export default PhoneForm;
