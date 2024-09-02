import React from 'react';
import { Button } from '@mui/material';

interface FormData {
  name: string;
  phone: string;
  village: string;
  district: string;
}

interface ReceiptFormProps {
  formData: FormData;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ formData }) => {
  const handlePrint = () => {
      window.print();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '80mm', margin: '0 auto' }}>
      <div className="printable-section">
        <h2 style={{ fontSize: '2em', margin: '0' }}>Receipt</h2>
        <div style={{ fontSize: '1.5em' , marginBottom: '10px' }}>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Phone Number:</strong> {formData.phone}</p>
          <p><strong>Village:</strong> {formData.village}</p>
          <p><strong>District:</strong> {formData.district}</p>
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ backgroundColor: '#018f27', marginTop: '20px' }}
      >
        Print
      </Button>
    </div>
  );
};

export default ReceiptForm;
