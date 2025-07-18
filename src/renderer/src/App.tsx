import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NameForm from './components/NameForm';
import PhoneForm from './components/PhoneForm';
import LocationForm from './components/LocationForm';
import ReciptForm from './components/ReciptForm';
// import { ipcRenderer } from 'electron';
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

  const handleNext = () => {
    if (!isFormValid(value)) {
      console.log(formData)
      // alert('Please fill in all required fields correctly.');
      return;
    }
    console.log('Current Index:', value);
    setValue((prev) => {
    console.log('Next Index:', prev + 1);
    return prev + 1;
  });
  };

  const handleBack = () => {
    setValue((prev) => prev - 1);
  };

  const isFormValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '';
      case 1:
        return /^[0-9]+$/.test(formData.phone) && formData.phone.trim() !== '';
      case 2:
        return formData.village.trim() !== '' && formData.district.trim() !== '';
      case 3:
        return true;
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
          <Tab label="Receipt" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <NameForm formData={formData} updateFormData={updateFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PhoneForm formData={formData} updateFormData={updateFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LocationForm formData={formData} updateFormData={updateFormData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ReciptForm formData={formData} />
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
          disabled={value === 3}
          sx={{ backgroundColor: '#01178f' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
