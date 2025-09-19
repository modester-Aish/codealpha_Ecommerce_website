import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import { read, listRelated, getProducts } from './apiCore';
import Card from './Card';
import { addItem } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { API } from '../config';

import {
  Box,
  Grid,
  Typography,
  Alert,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
  Card as MuiCard,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  CircularProgress,
  Rating,
  Breadcrumbs,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  ZoomIn,
  Star,
  LocalShipping,
  Security,
  Support,
} from '@mui/icons-material';
import moment from 'moment';

const Product = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [quantity, setQuantity] = useState(1);

  const { productId } = useParams();

  const loadSingleProduct = (productId) => {
    setLoading(true);
    setError('');
    console.log('Loading product with ID:', productId);

    read(productId).then((data) => {
      console.log('Product data received:', data);
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProduct(data);
        setError('');
        listRelated(data._id).then((relatedData) => {
          console.log('Related products data received:', relatedData);
          if (relatedData.error) {
            console.log('Related products error:', relatedData.error);
            // If no related products found, try to get some general products
            getProducts('createdAt').then((generalProducts) => {
              if (generalProducts && generalProducts.length > 0) {
                // Filter out the current product and take first 4
                const filteredProducts = generalProducts
                  .filter(p => p._id !== data._id)
                  .slice(0, 4);
                setRelatedProducts(filteredProducts);
              }
            });
          } else if (relatedData && relatedData.length > 0) {
            console.log('Setting related products:', relatedData);
            setRelatedProducts(relatedData);
          } else {
            // If no related products found, try to get some general products
            getProducts('createdAt').then((generalProducts) => {
              if (generalProducts && generalProducts.length > 0) {
                // Filter out the current product and take first 4
                const filteredProducts = generalProducts
                  .filter(p => p._id !== data._id)
                  .slice(0, 4);
                setRelatedProducts(filteredProducts);
              }
            });
          }
          setLoading(false);
        }).catch((err) => {
          console.log('Related products fetch error:', err);
          // Fallback to general products
          getProducts('createdAt').then((generalProducts) => {
            if (generalProducts && generalProducts.length > 0) {
              const filteredProducts = generalProducts
                .filter(p => p._id !== data._id)
                .slice(0, 4);
              setRelatedProducts(filteredProducts);
            }
          });
          setLoading(false);
        });
      }
    }).catch((err) => {
      console.log('Product fetch error:', err);
      setError('Failed to load product details');
      setLoading(false);
    });
  };

  useEffect(() => {
    if (productId) {
      loadSingleProduct(productId);
    }
  }, [productId]);

  const addToCart = () => {
    if (isAuthenticated()) {
      addItem(product, () => {
        setSnackbar({ open: true, message: `${product.name} added to cart!` });
      });
    } else {
      setSnackbar({ open: true, message: 'Please sign in to add items to cart' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <Chip label="In Stock" color="success" size="small" />
    ) : (
      <Chip label="Out of Stock" color="error" size="small" />
    );
  };

  const getDefaultImage = (category) => {
    const categoryImages = {
      'Beauty & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop',
      'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
      'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
    };
    return categoryImages[category] || 'https://via.placeholder.com/400x500?text=No+Image+Available';
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom color="error">
            Error Loading Product
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" href="/" color="primary">
            Go Back Home
          </Button>
        </Box>
      </Layout>
    );
  }

  if (!product && !loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            Product Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button variant="contained" href="/" color="primary">
            Go Back Home
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
            Shop
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Main Product Display - Two Column Layout */}
        <Grid container spacing={6} sx={{ mb: 6 }}>
          {/* Left Column - Product Images */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Thumbnail Gallery - Above Main Image */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <MuiCard 
                    key={index} 
                    elevation={0} 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      '&:hover': {
                        border: '2px solid #1976d2',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="60"
                      image={`${API.replace('/api', '')}/api/product/photo/${product._id}`}
                      alt={`${product.name} ${index}`}
                      onError={(e) => {
                        e.target.src = getDefaultImage(product.category?.name);
                      }}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                  </MuiCard>
                ))}
              </Stack>

              {/* Main Product Image */}
              <MuiCard elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <CardMedia
                  component="img"
                  height="700"
                  image={`${API.replace('/api', '')}/api/product/photo/${product._id}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = getDefaultImage(product.category?.name);
                  }}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
              </MuiCard>
            </Box>
          </Grid>

          {/* Right Column - Product Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 4 } }}>
              {/* Product Title */}
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 400, mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.name}
              </Typography>
              
              {/* Product Type */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 300, mb: 2, color: 'text.secondary' }}>
                {product.category?.name}
              </Typography>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 500 }}>
                  ${product.price}
                </Typography>
              </Box>

              {/* Reviews */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Rating value={5} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  122 reviews
                </Typography>
              </Box>

              {/* Promotion */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  • 50% Off Archive Sales. Discount applied in cart.
                </Typography>
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                  Quantity:
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      border: '1px solid #ccc',
                      '&:hover': {
                        border: '1px solid #1976d2',
                      }
                    }}
                  >
                    -
                  </Button>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                    sx={{ 
                      minWidth: 40, 
                      height: 40,
                      border: '1px solid #ccc',
                      '&:hover': {
                        border: '1px solid #1976d2',
                      }
                    }}
                  >
                    +
                  </Button>
                </Stack>
              </Box>

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={addToCart}
                disabled={product.quantity === 0}
                sx={{ 
                  width: '100%', 
                  mb: 4, 
                  height: 50,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: '1px'
                }}
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {/* Description Section - Collapsible */}
              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', flexGrow: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 300 }}>
                    −
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: 'text.secondary'
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Related Products */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
            {relatedProducts && relatedProducts.length > 0 ? 'Related Products' : 'Other Products'}
          </Typography>
          {relatedProducts && relatedProducts.length > 0 ? (
            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={relatedProduct._id}>
                  <Card 
                    product={relatedProduct} 
                    showViewProductButton={true}
                    showAddToCartButton={true}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Loading other products...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Product;