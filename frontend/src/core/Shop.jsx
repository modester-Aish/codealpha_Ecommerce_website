import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Button from '@mui/material/Button';
import Card from './Card.jsx';
import { getMainCategories, getFilteredProducts } from './apiCore.js';
import CategoriesFilter from './CategoriesFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'; // Updated import

import Search from './Search';
import { prices } from './fixedPrices.js';
import Copyright from './Copyright';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 20px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
}));

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const init = () => {
    getMainCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setMainCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size > skip + limit && (
        <GradientButton onClick={loadMore} variant='contained'>
          Load more
        </GradientButton>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(newFilters.filters);
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

  const hasActiveFilters = () => {
    return (myFilters.filters.category && myFilters.filters.category.length > 0) || 
           (myFilters.filters.price && myFilters.filters.price.length > 0);
  };

  return (
    <Layout
      className='container-fluid'
    >
      <Box sx={{ mt: 8 }}>
        <Search />
      </Box>
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
          <Typography variant='h4' gutterBottom>
            {hasActiveFilters() ? `Filtered Products (${filteredResults.length})` : 'Products'}
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
            {filteredResults.map((product, i) => (
              <Grid item key={i} xs={6} md={4}>
                <Card product={product} />
              </Grid>
            ))}
          </Box>
          <hr />
          {loadMoreButton()}
        </Grid>
      </Grid>
      <Copyright />
    </Layout>
  );
};

export default Shop;
