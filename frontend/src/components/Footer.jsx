import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  ArrowForward,
} from '@mui/icons-material';
import { getCategories } from '../core/apiCore';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        // Filter only parent categories (those without parent)
        const parentCategories = data.filter(category => !category.parent);
        setCategories(parentCategories);
      }
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2C3E50',
        color: '#B0BEC5',
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/footer.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      
      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4, px: 2 }}>
        <Grid container spacing={8}>
          {/* Contact Column - Left */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#E0E0E0' }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                info@mernecommerce.com
              </Typography>
            </Box>
          </Grid>

          {/* Shop Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#E0E0E0' }}>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <MuiLink
                component={Link}
                to="/shop"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                All Products
              </MuiLink>
              {categories.map((category) => (
                <MuiLink
                  key={category._id}
                  component={Link}
                  to={`/shop?category=${category._id}`}
                  sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
                >
                  {category.name}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Customer Service Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#E0E0E0' }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <MuiLink
                component={Link}
                to="/cart"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                Shopping Cart
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                Order Tracking
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                Shipping Info
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                Returns & Exchanges
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                Size Guide
              </MuiLink>
              <MuiLink
                href="#"
                sx={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#E0E0E0' } }}
              >
                FAQ
              </MuiLink>
            </Box>
          </Grid>

          {/* Newsletter Column - Right */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#E0E0E0' }}>
              Newsletter
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Typography variant="body2" sx={{ color: '#B0BEC5', fontSize: '0.875rem' }}>
                Subscribe to get updates on new products and exclusive offers
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="YOUR EMAIL ADDRESS"
                  variant="outlined"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'transparent',
                      '& fieldset': {
                        borderColor: '#B0BEC5',
                      },
                      '&:hover fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E0E0E0',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#B0BEC5',
                      fontSize: '0.75rem',
                      '&::placeholder': {
                        color: '#B0BEC5',
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    width: 40,
                    height: 40,
                    borderColor: '#B0BEC5',
                    color: '#B0BEC5',
                    '&:hover': {
                      borderColor: '#E0E0E0',
                      color: '#E0E0E0',
                    },
                  }}
                >
                  <ArrowForward sx={{ fontSize: 16 }} />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#B0BEC5' }} />

        {/* Bottom Section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#B0BEC5', fontSize: '0.875rem' }}>
              Copyright © {currentYear} MERN E-commerce Ltd
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
              <IconButton
                sx={{ color: '#B0BEC5', '&:hover': { color: '#E0E0E0' } }}
                component="a"
                href="#"
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{ color: '#B0BEC5', '&:hover': { color: '#E0E0E0' } }}
                component="a"
                href="#"
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: '#B0BEC5', '&:hover': { color: '#E0E0E0' } }}
                component="a"
                href="#"
              >
                <Twitter />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
