import React, {useState} from 'react';

interface FormProps {
  formData: { village: string; district: string };
  updateFormData: (field: string, value: string) => void;
}
const LocationForm: React.FC<FormProps> = ({ formData, updateFormData }) => {
  const [localValue1, setLocalValue1] = useState(formData.village);
  const [localValue2, setLocalValue2] = useState(formData.district);
  const [error, setError] = useState('');

  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue1(value);
    updateFormData('village', value);
    setError(value === '' ? 'Please fill this field.' : '');


  };

  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue2(value);
    updateFormData('district', value);
    setError(value === '' ? 'Please fill this field.' : '');
  }


  return (
    <div className="form-container">
      <h2>Enter Your Location Details</h2>
      <input
        type="text"
        placeholder="village"
        value={localValue1}
        onChange={handleInputChange1}
        className="input-field"
      />
      <input
        type="text"
        placeholder="district"
        value={localValue2}
        onChange={handleInputChange2}
        className="input-field"
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LocationForm;
