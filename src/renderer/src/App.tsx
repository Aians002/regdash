import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NameForm from './components/NameForm';
import PhoneForm from './components/PhoneForm';
import LocationForm from './components/LocationForm';
import ReceiptForm from './components/ReciptForm';
import LanguageSelector from './components/LanguageSelector';
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
  const [language, setLanguage] = useState<string | null>(null);

  const labels = {
    en: {
      Next: 'Next',
      Back: 'Back',
      Home: 'Home',
    },
    gu: {
      Next: 'આગળ',
      Back: 'પાછળ',
      Home: 'ઘર',
    },
    hi: {
      Next: 'आगे',
      Back: 'पीछे',
      Home: 'घर',
    },
  };

  const handleNext = () => {
    if (!isFormValid(value)) {
      return; // Ensure form validation before proceeding
    }
    setValue((prev) => prev + 1);
  };

  const handleBack = () => {
    setValue((prev) => prev - 1);
  };

  const handleHome = () => {
    // Reset form data and language, then show the language selector again
    setFormData({
      name: '',
      phone: '',
      village: '',
      district: '',
    });
    setLanguage(null); // Reset the language to show the selector
    setValue(0); // Go back to the first tab
  };

  const isFormValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '';
      case 1:
        return /^[0-9]+$/.test(formData.phone) && formData.phone.trim() !== '' && formData.phone.length === 10;
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


  // Render the Language Selector if no language is selected
  if (!language) {
    return <LanguageSelector setLanguage={setLanguage} />;
  }

  return (
    <Box className="app-container">
      <Box className="tabs-container">
        <Tabs value={value} aria-label="registration tabs" sx={{ '& .MuiTab-root': { color: '#ffffff' } , 
        '& .Mui-selected': { color: '#00db30', fontWeight: 'bold' }, 
        '& .MuiTabs-indicator': { backgroundColor: '#018f27' }, // Indicator color
      }}>
          <Tab label="Name" {...a11yProps(0)}  />
          <Tab label="Phone" {...a11yProps(1)}  />
          <Tab label="Location" {...a11yProps(2)}  />
          <Tab label="Receipt" {...a11yProps(3)}  />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <NameForm formData={formData} updateFormData={updateFormData} language={language} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PhoneForm formData={formData} updateFormData={updateFormData} language={language} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LocationForm formData={formData} updateFormData={updateFormData} language={language} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ReceiptForm formData={formData} language={language} />
      </CustomTabPanel>
      <Box className="navigation-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          disabled={value === 0 || value === 3}
          sx={{ backgroundColor: '#018f27', marginRight: '10px' }}
        >
          {labels[language].Back}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleHome}
          sx={{ backgroundColor: '#666', marginRight: '10px' }} // Adjust styling as needed
        >
          {labels[language].Home}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={value === 3}
          sx={{ backgroundColor: '#0328fc' }}
        >
          {labels[language].Next}
        </Button>
      </Box>
    </Box>
  );
}
