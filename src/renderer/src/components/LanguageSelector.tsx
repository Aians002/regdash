import React from 'react';
import { Button, Box, Typography } from '@mui/material';

interface LanguageSelectorProps {
  setLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ setLanguage }) => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        // marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '98.5vh', // Full height to center vertically
        justifyContent: 'center', // Center content vertically
        background: 'linear-gradient(to bottom, #01178f, hwb(245 0% 84%))', /* Set the background color to a gradient between the exhibition color and the new color */
        padding: '0 20px',
        gap: 4,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
        Choose Your Language<br></br>
        તમારી ભાષા પસંદ કરો<br></br>
        अपनी भाषा चुनें
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          flexWrap: 'wrap', // Wrap buttons for responsiveness
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Button
          variant="contained"
          onClick={() => setLanguage('en')}
          sx={{ 
            backgroundColor: '#018f27', 
            width: '120px', // Wider buttons for better interaction
            height: '50px', 
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#016a1e',
            },
          }}
        >
          English
        </Button>
        <Button
          variant="contained"
          onClick={() => setLanguage('gu')}
          sx={{ 
            backgroundColor: '#01178f', 
            width: '120px', 
            height: '50px', 
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#010d6a',
            },
          }}
        >
          ગુજરાતી
        </Button>
        <Button
          variant="contained"
          onClick={() => setLanguage('hi')}
          sx={{ 
            backgroundColor: '#d32f2f', 
            width: '120px', 
            height: '50px', 
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          हिंदी
        </Button>
      </Box>
    </Box>
  );
};

export default LanguageSelector;
