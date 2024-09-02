import React from 'react';

interface FormProps {
  formData: { name: string };
  updateFormData: (field: string, value: string) => void;
}

const NameForm: React.FC<FormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="form-container">
      <h2>Enter Your Name</h2>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => updateFormData('name', e.target.value)}
        className="input-field"
      />
    </div>
  );
};

export default NameForm;
