import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts, getMainCategories } from './apiCore.js';
import Card from './Card.jsx';
import Search from './Search';
import Copyright from './Copyright.jsx';
import HeroSection from '../components/HeroSection';
import CategoriesFilter from './CategoriesFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { prices } from './fixedPrices';
import { 
  Box, 
  Container, 
  Typography, 
  Grid
} from '@mui/material';

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const loadAllProducts = () => {
    // Load products by arrival (newest first)
    getProducts('createdAt').then((arrivalData) => {
      if (arrivalData.error) {
        setError(arrivalData.error);
      } else {
        setProductsByArrival(arrivalData);
        setAllProducts(arrivalData);
        setFilteredProducts(arrivalData);
      }
    });

    // Load products by sell (most sold first)
    getProducts('sold').then((sellData) => {
      if (sellData.error) {
        setError(sellData.error);
      } else {
        setProductsBySell(sellData);
      }
    });
  };

  const loadMainCategories = () => {
    getMainCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setMainCategories(data);
      }
    });
  };

  // Filter handling functions
  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    
    applyFilters(newFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const applyFilters = (filters) => {
    let filtered = [...allProducts];

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product => 
        product.category && filters.category.includes(product.category._id)
      );
    }

    // Filter by price range
    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter(product => 
        product.price >= filters.price[0] && product.price <= filters.price[1]
      );
    }

    setFilteredProducts(filtered);
  };

  const hasActiveFilters = () => {
    return (myFilters.filters.category && myFilters.filters.category.length > 0) || 
           (myFilters.filters.price && myFilters.filters.price.length > 0);
  };

  useEffect(() => {
    loadAllProducts();
    loadMainCategories();
  }, []);

  return (
    <Layout
      className='container-fluid'
    >
      <Box>
        <HeroSection />
        <Search />
        <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <CategoriesFilter
            categories={mainCategories}
            handleFilters={(filters) => handleFilters(filters, 'category')}
          />
          <PriceRangeFilter
            prices={prices}
            handleFilters={(filters) => handleFilters(filters, 'price')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography 
            variant='h4' 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 3,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                borderRadius: 2,
              }
            }}
          >
            {hasActiveFilters() ? `Filtered Products (${filteredProducts.length})` : 'New Arrivals'}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {(hasActiveFilters() ? filteredProducts : productsByArrival).map((product, i) => (
              <Card key={`arrival-${product._id}`} product={product} />
            ))}
          </Box>

          {!hasActiveFilters() && (
            <>
              <Typography 
                variant='h4' 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                    borderRadius: 2,
                  }
                }}
              >
                Best Sellers
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {productsBySell
                  .filter((product) => {
                    // If we have few products, avoid showing the same product in both sections
                    if (allProducts.length <= 3) {
                      return !productsByArrival.some(arrivalProduct => arrivalProduct._id === product._id);
                    }
                    return true;
                  })
                  .map((product, i) => (
                    <Card key={`sell-${product._id}`} product={product} />
                  ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
      </Box>
      <Copyright />
    </Layout>
  );
};

export default Home;
