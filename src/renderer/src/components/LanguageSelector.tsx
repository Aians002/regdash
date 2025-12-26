import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Dash from '../assets/DashLogo2.png';

interface LanguageSelectorProps {
  setLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ setLanguage }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    try {
      const result = await window.api.syncToDrive();
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error: any) {
      console.error("Sync failed", error);
      alert(`Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '98.5vh', // Use full viewport height
        background: 'linear-gradient(to bottom, #0000, green)', // Gradient background
        color: 'white', // Text color
      }}
    >
      {/* Sync Button */}
      {isOnline && (
        <Box sx={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
          <Tooltip title="Sync to Google Drive">
            <span>
              <IconButton 
                onClick={handleSync} 
                disabled={isSyncing}
                sx={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
                  color: 'white', 
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                  animation: isSyncing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}

      {/* Logo at the top */}
      <Box sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-70%)' }}>
        <img
          src={Dash}
          alt="logo"
          style={{ width: '150%', height: 'auto' }}
        />
        <br />
        <br />
        <Typography variant="h4" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', textAlign:'center', left: '50%', transform: 'translateX(20%)'}}>
          Dash Registration Starts Here!
        </Typography>
      </Box>

      {/* Center content below the logo */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          paddingTop: '120px', // Padding to push content below the logo
          width: '100%',
        }}
      >
        <Typography
          variant="h4" // Increased font size
          gutterBottom
          sx={{ color: 'blue', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }} // Increased margin for spacing
        >
          Choose Your Language<br />
          તમારી ભાષા પસંદ કરો<br />
          अपनी भाषा चुनें
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3, // Increased gap between buttons
            flexWrap: 'wrap', // Responsive wrapping
            maxWidth: '500px', // Increased max width for the button container
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            onClick={() => setLanguage('en')}
            sx={{
              backgroundColor: '#018f27',
              width: '150px', // Increased button width
              height: '60px', // Increased button height
              fontSize: '1.2rem', // Increased font size
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
              width: '150px',
              height: '60px',
              fontSize: '1.2rem',
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
              width: '150px',
              height: '60px',
              fontSize: '1.2rem',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            हिंदी
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LanguageSelector;
