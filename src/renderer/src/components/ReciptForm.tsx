import React, { useState, useEffect } from 'react';
// import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRef } from 'react';
// import DashLogo from './../assets/DashLogo2.png'; // Import the image directly

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
  const receiptRef = useRef<HTMLDivElement>(null);

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [hasSubmitted, setHasSubmitted] = useState(false); // Flag to ensure handleSubmit runs only once
  // const [hasSaved , setHasSaved] = useState(false); // Flag to ensure saveToExcel runs only once

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
      thankyou: 'Thank You !',
    },
    gu: {
      receipt: 'રસીદ',
      name: 'નામ',
      phone: 'ફોન નંબર',
      village: 'ગામ',
      district: 'જિલ્લો',
      submit: 'જમા કરો',
      successMessage: 'થઈ ગયું! મોકલવા બદલ આભાર.',
      thankyou: 'આભાર !',
    },
    hi: {
      receipt: 'रसीद',
      name: 'नाम',
      phone: 'फोन नंबर',
      village: 'गाँव',
      district: 'जिला',
      submit: 'जमा करें',
      successMessage: 'हो गया! जमा करने के लिए धन्यवाद।',
      thankyou: 'धन्यवाद !',
    },
  };

  const selectedLabels = labels[language] || labels.en;

  useEffect(() => {
    if (submissionStatus === 'success') {
      const timer = setTimeout(() => { 
        window.location.reload();
      }, 7000);

      return () => clearTimeout(timer);
    }
    return;
  }, [submissionStatus]);

  useEffect(() => {
      // setTimeout(() => {
      //   setSubmissionStatus('saving');
      // }, 2000)
      
      if (!hasSubmitted) {
        setHasSubmitted(true); // Set the flag to true to prevent re-running
        handleSubmit();
      }
    }, [hasSubmitted]);

  const handleSubmit = () => {
    setSubmissionStatus('saving');

    // Save to Excel

    window.api.saveToExcel(formData);

    setTimeout(() => {
      if (receiptRef.current) {
        const receiptHTML = receiptRef.current.outerHTML;
        window.api.printReceipt2(receiptHTML);
      }

      // window.api.printReceipt();
      // setSubmissionStatus('printing');
    }, 2000); // Adjust the delay as needed
    // // Print Receipt

    setTimeout(() => {
      // Show success message once printing is done
      setSubmissionStatus('success');
    }, 8000); // Adjust the delay as needed
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100mm', margin: '0 auto', background: 'white' }}>
      {submissionStatus === 'success' ? (
        <div style={{ textAlign: 'center', color: '#018f27' }}>
          <CheckCircleIcon style={{ fontSize: '3em' }} />
          <p style={{ fontSize: '1.2em', marginTop: '10px' }}>{selectedLabels.successMessage}</p>
        </div>
      ) : (
        <>
             <div ref={receiptRef} className="htmlsave">
            {/* <img src={DashLogo} alt="logo" style={{ width: '100%', height: 'auto' }} /> */}
            <div style={{ textAlign: 'center', fontSize: '1.5em', marginBottom: '20px' }}>
              <h1>
              DASH EXPO
              </h1>
            </div>
            <div style={{ fontSize: '2em', marginBottom: '10px' , textAlign : 'left' , marginLeft:'0px'}}>
              <p>
              {selectedLabels.name}: <strong>{formData.name}</strong>
              </p>
              <p>
              {selectedLabels.phone}: <strong>{formData.phone}</strong>
              </p>
              <p>
              {selectedLabels.village}: <strong>{formData.village}</strong>
              </p>
              <p>
              {selectedLabels.district}: <strong>{formData.district}</strong>
              </p>
              <p style={{ display: 'flex', justifyContent: 'center' }}>
              {selectedLabels.thankyou}
              </p>
            </div>
            </div> 

            {/* <div className="printable-section">
            {/* <img src={DashLogo} alt="logo" style={{ width: '100%', height: 'auto' }} /> */}
            {/* <div style={{ textAlign: 'center', fontSize: '1.5em', marginBottom: '20px' }}>
              <h1>
              DASH EXPO
              </h1>
            </div>
            <div style={{ fontSize: '2em', marginBottom: '10px' , textAlign : 'left' , marginLeft:'0px'}}>
              <p>
              {selectedLabels.name}: <strong>{formData.name}</strong>
              </p>
              <p>
              {selectedLabels.phone}: <strong>{formData.phone}</strong>
              </p>
              <p>
              {selectedLabels.village}: <strong>{formData.village}</strong>
              </p>
              <p>
              {selectedLabels.district}: <strong>{formData.district}</strong>
              </p>
              <p style={{ display: 'flex', justifyContent: 'center' }}>
              {selectedLabels.thankyou}
              </p>
            </div>
            </div> */}
          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ fontSize: '18px', backgroundColor: '#018f27', marginTop: '20px' }}
              disabled={submissionStatus === 'saving'}
            >
              {selectedLabels.submit}
            </Button> */}
            
          {/* </div> */}
        </>
      )}
    </div>
  );
};

export default ReceiptForm;
