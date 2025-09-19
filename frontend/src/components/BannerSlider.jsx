import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  Slide,
} from '@mui/material';
import { getActiveBanners } from '../admin/apiAdmin';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const loadBanners = () => {
    getActiveBanners().then((data) => {
      if (data.error) {
        console.error('Error loading banners:', data.error);
      } else {
        setBanners(data);
      }
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: { xs: 300, md: 500 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <Typography>Loading banners...</Typography>
      </Box>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBannerData = banners[currentBanner];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 300, md: 500 },
        overflow: 'hidden',
        borderRadius: 2,
        mb: 4,
        boxShadow: 3,
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentBannerData.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Fade in={true} timeout={1000}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2rem', md: '3.5rem' },
            }}
          >
            {currentBannerData.title}
          </Typography>
        </Fade>

        {/* Subtitle */}
        {currentBannerData.subtitle && (
          <Fade in={true} timeout={1500}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 3,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              {currentBannerData.subtitle}
            </Typography>
          </Fade>
        )}

        {/* Button */}
        {currentBannerData.link && currentBannerData.buttonText && (
          <Fade in={true} timeout={2000}>
            <Button
              variant="contained"
              size="large"
              href={currentBannerData.link}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s ease',
              }}
            >
              {currentBannerData.buttonText}
            </Button>
          </Fade>
        )}

        {/* Text Overlays */}
        {currentBannerData.texts && currentBannerData.texts.map((textOverlay, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${textOverlay.position.x}%`,
              top: `${textOverlay.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: textOverlay.color,
                fontSize: textOverlay.fontSize,
                fontWeight: textOverlay.fontWeight,
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {textOverlay.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 3,
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentBanner(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentBanner ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              minWidth: 40,
              height: 40,
              borderRadius: '50%',
              zIndex: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            ‹
          </Button>
          <Button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              minWidth: 40,
              height: 40,
              borderRadius: '50%',
              zIndex: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            ›
          </Button>
        </>
      )}
    </Box>
  );
};

export default BannerSlider;


