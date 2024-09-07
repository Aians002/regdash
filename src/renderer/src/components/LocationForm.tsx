import React, { useState } from 'react';

interface FormProps {
  formData: { village: string; district: string };
  updateFormData: (field: string, value: string) => void;
  language: string;
}

const LocationForm: React.FC<FormProps> = ({ formData, updateFormData, language }) => {
  const [localVillage, setLocalVillage] = useState(formData.village);
  const [localDistrict, setLocalDistrict] = useState(formData.district);
  const [errorVillage, setErrorVillage] = useState('');
  const [errorDistrict, setErrorDistrict] = useState('');

  // Language labels and error messages
  const labels = {
    en: {
      heading: 'Enter Your Location Details',
      placeholderVillage: 'Village',
      placeholderDistrict: 'District',
      errorEmpty: 'Please fill this field.',
    },
    gu: {
      heading: 'તમારા સ્થળ વિગતો દાખલ કરો',
      placeholderVillage: 'ગામ',
      placeholderDistrict: 'જિલ્લો',
      errorEmpty: 'કૃપા કરીને આ ક્ષેત્ર ભરો.',
    },
    hi: {
      heading: 'अपना स्थान विवरण दर्ज करें',
      placeholderVillage: 'गाँव',
      placeholderDistrict: 'जिला',
      errorEmpty: 'कृपया इस क्षेत्र को भरें।',
    },
  };

  // Select labels based on the current language
  const selectedLabels = labels[language];

  const handleVillageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalVillage(value);
    updateFormData('village', value);
    setErrorVillage(value === '' ? selectedLabels.errorEmpty : '');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalDistrict(value);
    updateFormData('district', value);
    setErrorDistrict(value === '' ? selectedLabels.errorEmpty : '');
  };

  return (
    <div className="form-container">
      <h2>{selectedLabels.heading}</h2>
      <input
        type="text"
        placeholder={selectedLabels.placeholderVillage}
        value={localVillage}
        onChange={handleVillageChange}
        className="input-field"
      />
      {errorVillage && <div className="error-message">{errorVillage}</div>}
      <input
        type="text"
        placeholder={selectedLabels.placeholderDistrict}
        value={localDistrict}
        onChange={handleDistrictChange}
        className="input-field"
      />
      {errorDistrict && <div className="error-message">{errorDistrict}</div>}
    </div>
  );
};

export default LocationForm;
