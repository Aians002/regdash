import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NameForm from './components/NameForm';
import PhoneForm from './components/PhoneForm';
import LocationForm from './components/LocationForm';
import './assets/main.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function App() {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    district: '',
  });
  const [error, setError] = useState({ name: false, phone: false, location: false });

  const handleNext = () => {
    if (isFormValid(value)) {
      setValue((prev) => prev + 1);
    } else {
      alert('Please complete all required fields with valid inputs.');
    }
  };

  const handleBack = () => {
    setValue((prev) => prev - 1);
  };

  const isFormValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '';
      case 1:
        const phoneValid = /^[0-9]+$/.test(formData.phone) && formData.phone.trim() !== '';
        setError({ ...error, phone: !phoneValid });
        return phoneValid;
      case 2:
        return formData.village.trim() !== '' && formData.district.trim() !== '';
      default:
        return false;
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Box className="app-container">
      <Box className="tabs-container">
        <Tabs value={value} aria-label="registration tabs">
          <Tab label="Name" {...a11yProps(0)} />
          <Tab label="Phone" {...a11yProps(1)} />
          <Tab label="Location" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <NameForm formData={formData} updateFormData={updateFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PhoneForm formData={formData} updateFormData={updateFormData} error={error.phone} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LocationForm formData={formData} updateFormData={updateFormData} />
      </CustomTabPanel>
      <Box className="navigation-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          disabled={value === 0}
          sx={{ backgroundColor: '#018f27' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={value === 2}
          sx={{ backgroundColor: '#01178f' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
