import React , {useState} from 'react';

interface FormProps {
  formData: { name: string };
  updateFormData: (field: string, value: string) => void;
  language: string;
}

const NameForm: React.FC<FormProps> = ({ formData, updateFormData , language }) => {
  const [localValue, setLocalValue] = useState(formData.name);
  const [error, setError] = useState('');

  const labels = {
    en: {
      heading: 'Enter Your Name',
      placeholder: 'Name',
      error: 'Please fill this field.'
    },
    gu: {
      heading: 'તમારું નામ દાખલ કરો',
      placeholder: 'નામ',
      error: 'કૃપા કરીને આ ક્ષેત્ર ભરો.'
    },
    hi: {
      heading: 'अपना नाम दर्ज करें',
      placeholder: 'नाम',
      error: 'कृपया इस क्षेत्र को भरें।'
    }
  };

  const selectedLabels = labels[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    updateFormData('name', value);
    setError(value === '' ? 'Please fill this field.' : '');
  };

  return (
    <div className="form-container">
      <h2>{selectedLabels.heading}</h2>
      <input
        type="text"
        placeholder={selectedLabels.placeholder}
        value={localValue}
        onChange={handleInputChange}
        className="input-field"
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NameForm;
