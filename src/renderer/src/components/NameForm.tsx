import React , {useState} from 'react';

interface FormProps {
  formData: { name: string };
  updateFormData: (field: string, value: string) => void;
}

const NameForm: React.FC<FormProps> = ({ formData, updateFormData }) => {
  const [localValue, setLocalValue] = useState(formData.name);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    updateFormData('name', value);
    setError(value === '' ? 'Please fill this field.' : '');
  };

  return (
    <div className="form-container">
      <h2>Enter Your Name</h2>
      <input
        type="text"
        placeholder="Name"
        value={localValue}
        onChange={handleInputChange}
        className="input-field"
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NameForm;
