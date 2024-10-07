import React, { useState} from 'react';

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

  const labels = {
    en: {
      heading: 'Enter Your Location Details',
      placeholderVillage: 'Village',
      placeholderDistrict: 'District',
      errorEmpty: 'Please fill this field.',
    },
    gu: {
      heading: 'તમારી જગ્યાના વિગત લખો',
      placeholderVillage: 'ગામ',
      placeholderDistrict: 'જિલ્લો',
      errorEmpty: 'કૃપા કરીને આ ફોર્મ ભરો.',
    },
    hi: {
      heading: 'अपनी स्थान की जानकारी भरें',
      placeholderVillage: 'गाँव',
      placeholderDistrict: 'जिला',
      errorEmpty: 'कृपया यह फॉर्म भरें।',
    },
  };

  // Select labels based on the current language
  const selectedLabels = labels[language];

  const handleDistrictInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalDistrict(newValue);
    updateFormData('district', newValue);
    setErrorDistrict(newValue ? '' : selectedLabels.errorEmpty);
  };

  const handleVillageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalVillage(newValue);
    updateFormData('village', newValue);
    setErrorVillage(newValue ? '' : selectedLabels.errorEmpty);
  };

  return (
    <div className="form-container">
      <h2>{selectedLabels.heading}</h2>

      {/* District Text Input */}
      <input
        type="text"
        placeholder={selectedLabels.placeholderDistrict}
        value={localDistrict}
        onChange={handleDistrictInputChange}
        className="input-field"
      />
      {errorDistrict && <div className="error-message">{errorDistrict}</div>}

      {/* Village Text Input */}
      <input
        type="text"
        placeholder={selectedLabels.placeholderVillage}
        value={localVillage}
        onChange={handleVillageInputChange}
        className="input-field"
      />
      {errorVillage && <div className="error-message">{errorVillage}</div>}
    </div>
  );
};

export default LocationForm;
