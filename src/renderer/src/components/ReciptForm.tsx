import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FormData {
  name: string;
  phone: string;
  village: string;
  district: string;
}

interface ReceiptFormProps {
  formData: FormData;
  language: string;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ formData, language }) => {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Language labels
  const labels = {
    en: {
      receipt: 'Receipt',
      name: 'Name',
      phone: 'Phone Number',
      village: 'Village',
      district: 'District',
      submit: 'Submit',
      successMessage: 'Done! Thank you for submitting.',
      thankyou: 'Thank You !'
    },
    gu: {
      receipt: 'રસીદ',
      name: 'નામ',
      phone: 'ફોન નંબર',
      village: 'ગામ',
      district: 'જિલ્લો',
      submit: 'જમા કરો',
      successMessage: 'થઈ ગયું! મોકલવા બદલ આભાર.',
      thankyou: 'આભાર !'
    },
    hi: {
      receipt: 'रसीद',
      name: 'नाम',
      phone: 'फोन नंबर',
      village: 'गाँव',
      district: 'जिला',
      submit: 'जमा करें',
      successMessage: 'हो गया! जमा करने के लिए धन्यवाद।',
      thankyou: 'धन्यवाद !'
    },
  };

  const selectedLabels = labels[language] || labels.en;

  useEffect(() => {
    if (submissionStatus === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/language-selector'; // Change this to the path of your language screen
      }, 7000);

      return () => clearTimeout(timer);
    }
    return;
  }, [submissionStatus]);

  const handleSubmit = () => {
    setSubmissionStatus('saving');

    // Save to Excel
    window.api.saveToExcel(formData);

    // Listen for success/error messages

    window.api.printReceipt();

    // Show success message once printing is done
    setSubmissionStatus('success');

  };

  return (
    <div style={{ padding: '10px', maxWidth: '80mm', margin: '0 auto', background: 'white', fontSize: '14px' }}>
      {submissionStatus === 'success' ? (
        <div style={{ textAlign: 'center', color: '#018f27' }}>
          <CheckCircleIcon style={{ fontSize: '3em' }} />
          <p style={{ fontSize: '1.2em', marginTop: '10px' }}>{selectedLabels.successMessage}</p>
        </div>
      ) : (
        <>
          <div className="printable-section">
            <img src="src/assets/DashLogo2.png" alt="logo" style={{ width: '100%', height: 'auto' }} />
            <h2 style={{ fontSize: '1.2em', margin: '0', textAlign: 'center' }}>{selectedLabels.receipt}</h2>
            <div style={{ margin: '10px 0' }}>
              <p style={{ margin: '5px 0' }}>
                {selectedLabels.name}: <strong>{formData.name}</strong>
              </p>
              <p style={{ margin: '5px 0' }}>
                {selectedLabels.phone}: <strong>{formData.phone}</strong>
              </p>
              <p style={{ margin: '5px 0' }}>
                {selectedLabels.village}: <strong>{formData.village}</strong>
              </p>
              <p style={{ margin: '5px 0' }}>
                {selectedLabels.district}: <strong>{formData.district}</strong>
              </p>
              <p style={{ display: 'flex', justifyContent: 'center' }}>
                {selectedLabels.thankyou}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ fontSize: '14px', backgroundColor: '#018f27', marginTop: '10px' }}
              disabled={submissionStatus === 'saving'}
            >
              {selectedLabels.submit}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiptForm;
