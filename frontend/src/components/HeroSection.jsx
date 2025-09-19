import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Fade,
  Slide,
} from '@mui/material';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Welcome to Gentleman Jones',
      subtitle: 'Discover Amazing Products',
      description: 'Shop the latest trends and find everything you need in one place. Quality products at unbeatable prices.',
      buttonText: 'Shop Now',
      buttonLink: '/shop'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Special Offers',
      subtitle: 'Limited Time Deals',
      description: 'Don\'t miss out on our exclusive offers. Save big on your favorite items with our special discounts.',
      buttonText: 'View Offers',
      buttonLink: '/shop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: { xs: 500, md: 700 },
        overflow: 'hidden',
        mt: 4, // Add top margin for gap from header
        mb: 4,
        boxShadow: 3,
      }}
    >
      {/* Background Images with Sliding Effect */}
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: 'transform 0.8s ease-in-out',
            zIndex: 1,
          }}
        />
      ))}

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 2,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 3,
          px: { xs: 3, sm: 6, md: 8 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
          {/* Centered Content */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '80%' },
              textAlign: 'center',
            }}
          >
            <Fade in={true} timeout={1000}>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {slides[currentSlide].title}
              </Typography>
            </Fade>

            <Fade in={true} timeout={1500}>
              <Typography
                variant="h4"
                sx={{
                  color: '#FFD700',
                  fontWeight: 600,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                }}
              >
                {slides[currentSlide].subtitle}
              </Typography>
            </Fade>

            <Fade in={true} timeout={2000}>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  mb: 3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                {slides[currentSlide].description}
              </Typography>
            </Fade>

            <Fade in={true} timeout={2500}>
              <Button
                variant="contained"
                size="large"
                href={slides[currentSlide].buttonLink}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: 3,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {slides[currentSlide].buttonText}
              </Button>
            </Fade>
          </Box>
        </Box>

      {/* Navigation Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 4,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
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

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          minWidth: 50,
          height: 50,
          borderRadius: '50%',
          zIndex: 4,
          fontSize: '1.5rem',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        ‹
      </Button>
      
      <Button
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          minWidth: 50,
          height: 50,
          borderRadius: '50%',
          zIndex: 4,
          fontSize: '1.5rem',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
            transform: 'translateY(-50%) scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        ›
      </Button>
    </Box>
  );
};

export default HeroSection;
