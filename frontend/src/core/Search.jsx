import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { list } from './apiCore';
import Card from './Card';

const Search = () => {
  const [data, setData] = useState({
    search: '',
    results: [],
    searched: false,
  });

  const { search, results, searched } = data;

  // Removed category loading since we don't need categories in search anymore

  const searchData = () => {
    if (search) {
      list({ search: search || undefined }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData((prevData) => ({
              ...prevData,
              results: response,
              searched: true,
            }));
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (event) => {
    setData((prevData) => ({
      ...prevData,
      search: event.target.value,
      searched: false,
    }));
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
    return '';
  };

  const searchedProducts = (results = []) => {
    return (
      <Box sx={{ mt: 4 }}>
        {searched && (
          <Typography variant='h5' align='center' gutterBottom>
            {searchMessage(searched, results)}
          </Typography>
        )}
        <Grid container spacing={3}>
          {results.map((product, i) => (
            <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
              <Card product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Paper
        component='form'
        onSubmit={searchSubmit}
        sx={{
          p: 3,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          maxWidth: 600,
          mx: 'auto',
          boxShadow: 3,
        }}
      >
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search products...'
          value={search}
          onChange={handleChange}
          size='small'
          InputProps={{
            startAdornment: <SearchIcon color='action' sx={{ mr: 1 }} />,
          }}
          sx={{
            flexGrow: 1,
            maxWidth: 400,
          }}
        />

        <Button
          variant='contained'
          type='submit'
          size='large'
          sx={{
            px: 4,
            height: 40,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Search
        </Button>
      </Paper>

      {searchedProducts(results)}
    </Container>
  );
};

export default Search;
