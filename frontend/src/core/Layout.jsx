import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Footer from '../components/Footer';
import { Box, Typography, Container } from '@mui/material';

const Layout = ({
  title,
  description,
  className,
  children,
}) => {
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Scroll effect to adjust layout when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Menu />
    {title && description && (
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)',
          mt: isHomePage ? (isScrolled ? '80px' : '120px') : '80px', // Adjust margin based on banner visibility and scroll
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0,
          },
          zIndex: 1,
        }}
      >
        <Container maxWidth='md' sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant='h2'
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant='h5'
            component='p'
            sx={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            {description}
          </Typography>
        </Container>
      </Box>
    )}
    <Box className={className} sx={{ p: { xs: 2, md: 3 }, mt: isHomePage ? (isScrolled ? 2 : 4) : 6, flex: 1, pt: { xs: 2, md: 3 } }}>
      {children}
    </Box>
    <Footer />
  </Box>
  );
};

export default Layout;
