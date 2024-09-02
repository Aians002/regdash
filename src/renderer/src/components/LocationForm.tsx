import React from 'react';

interface FormProps {
  formData: { village: string; district: string };
  updateFormData: (field: string, value: string) => void;
}

const LocationForm: React.FC<FormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="form-container">
      <h2>Enter Your Location Details</h2>
      <input
        type="text"
        placeholder="Village"
        value={formData.village}
        onChange={(e) => updateFormData('village', e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="District"
        value={formData.district}
        onChange={(e) => updateFormData('district', e.target.value)}
        className="input-field"
      />
    </div>
  );
};

export default LocationForm;
