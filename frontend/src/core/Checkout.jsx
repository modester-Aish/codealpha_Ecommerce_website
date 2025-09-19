import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Stack,
} from '@mui/material';
import {
  createOrder,
} from './apiCore';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: '',
    deliveryDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const handleDeliveryDetails = (field) => (event) => {
    setData({
      ...data,
      deliveryDetails: {
        ...data.deliveryDetails,
        [field]: event.target.value,
      },
    });
  };

  const getTotal = () =>
    products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);

  const placeOrder = () => {
    setData({ ...data, loading: true, error: '' });
    
    const createOrderData = {
      products: products,
      transaction_id: `COD_${Date.now()}`, // Generate COD transaction ID
      amount: getTotal(products),
      deliveryDetails: data.deliveryDetails,
      paymentMethod: 'Cash on Delivery',
    };

    createOrder(userId, token, createOrderData)
      .then(() => {
        emptyCart(() => {
          setRun(!run);
          setData({
            loading: false,
            success: true,
            error: '',
            deliveryDetails: {
              name: '',
              email: '',
              phone: '',
              address: '',
            },
          });
        });
      })
      .catch((error) => {
        setData({ 
          ...data, 
          loading: false, 
          error: 'Failed to place order. Please try again.' 
        });
      });
  };

  const showOrderForm = () =>
    products.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant='h6' gutterBottom>
          Delivery Information
        </Typography>
        
        <TextField
          label='Full Name'
          placeholder='Enter your full name'
          fullWidth
          value={data.deliveryDetails.name}
          onChange={handleDeliveryDetails('name')}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label='Email'
          placeholder='Enter your email address'
          fullWidth
          type='email'
          value={data.deliveryDetails.email}
          onChange={handleDeliveryDetails('email')}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label='Phone Number'
          placeholder='Enter your phone number'
          fullWidth
          value={data.deliveryDetails.phone}
          onChange={handleDeliveryDetails('phone')}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label='Delivery Address'
          placeholder='Enter your complete delivery address...'
          fullWidth
          multiline
          minRows={3}
          value={data.deliveryDetails.address}
          onChange={handleDeliveryDetails('address')}
          sx={{ mb: 2 }}
          required
        />

        <Alert severity='info' sx={{ mb: 2 }}>
          💰 Payment will be collected at the time of delivery
        </Alert>

        <Button
          onClick={placeOrder}
          variant='contained'
          color='success'
          fullWidth
          sx={{ mt: 2 }}
          disabled={!data.deliveryDetails.name || !data.deliveryDetails.email || !data.deliveryDetails.phone || !data.deliveryDetails.address}
        >
          Place Order (Cash on Delivery) - ${getTotal()}
        </Button>
      </Box>
    );

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Total: ${getTotal()}
      </Typography>

      {data.loading && (
        <Stack alignItems='center' sx={{ mb: 2 }}>
          <CircularProgress color='error' />
        </Stack>
      )}

      {data.success && (
        <Alert severity='success' sx={{ mb: 2 }}>
          🎉 Thanks! Your order has been placed successfully. You will receive a confirmation call soon.
        </Alert>
      )}

      {data.error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {data.error}
        </Alert>
      )}

      {isAuthenticated() ? (
        showOrderForm()
      ) : (
        <Box>
          <Alert severity='info' sx={{ mb: 2 }}>
            Please sign in to proceed with checkout
          </Alert>
          <Button
            component={Link}
            to='/signin'
            variant='contained'
            color='primary'
            fullWidth
          >
            Sign in to checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Checkout;
