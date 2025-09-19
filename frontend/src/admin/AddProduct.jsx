import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Typography,
  InputAdornment,
} from '@mui/material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { createProduct, getMainCategories, getSubcategories } from './apiAdmin';

const AddProduct = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subcategory: '',
    subSubcategory: '',
    subcategories: [],
    subSubcategories: [],
    shipping: '',
    quantity: '',
    photo: null,
    loading: false,
    error: '',
    createdProduct: '',
    formData: new FormData(),
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    category: false,
    subcategory: false,
    subSubcategory: false,
    shipping: false,
    quantity: false,
    photo: false,
  });

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    categories,
    category,
    subcategory,
    subSubcategory,
    subcategories,
    subSubcategories,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
  } = values;

  // Form validation
  const validate = () => {
    return (
      name.trim() !== '' &&
      description.trim() !== '' &&
      price > 0 &&
      category !== '' &&
      subcategory !== '' &&
      subSubcategory !== '' &&
      shipping !== '' &&
      quantity > 0 &&
      formData.get('photo') !== null &&
      formData.get('photo') !== 'null'
    );
  };

  const isFormValid = validate();

  // load categories and set form data
  const init = () => {
    console.log('Loading main categories for AddProduct...');
    console.log('Making API call to: /categories/main');
    getMainCategories().then((data) => {
      console.log('Main categories received:', data);
      console.log('Data type:', typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      
      if (data.error) {
        console.error('Error loading categories:', data.error);
        setValues({ ...values, error: data.error });
      } else if (Array.isArray(data)) {
        console.log('Setting categories:', data.length, 'categories');
        console.log('Categories data:', data.map(cat => ({ name: cat.name, id: cat._id })));
        
        setValues({
          ...values,
          categories: data,
        });
      } else {
        console.error('Unexpected data format:', data);
        setValues({ ...values, error: 'Unexpected data format received' });
      }
    }).catch((error) => {
      console.error('Failed to load categories:', error);
      setValues({ ...values, error: 'Failed to load categories' });
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    // Update formData
    const newFormData = new FormData();
    for (let [key, val] of formData.entries()) {
      if (key !== name) {
        newFormData.set(key, val);
      }
    }
    if (value !== undefined && value !== null) {
      newFormData.set(name, value);
    }

    // Handle hierarchical category selection
    if (name === 'category') {
      if (value) {
        console.log('Loading subcategories for category:', value);
        getSubcategories(value).then((data) => {
          console.log('Subcategories received:', data);
          if (data.error) {
            console.error('Error loading subcategories:', data.error);
            setValues({ ...values, error: data.error });
          } else {
            console.log('Setting subcategories:', data.length, 'subcategories');
            setValues({
              ...values,
              [name]: value,
              subcategories: data,
              subcategory: '', // Reset subcategory when category changes
              subSubcategory: '', // Reset sub-subcategory
              subSubcategories: [], // Clear sub-subcategories
              formData: newFormData,
              error: '',
            });
          }
        }).catch((error) => {
          console.error('Failed to load subcategories:', error);
          setValues({ ...values, error: 'Failed to load subcategories' });
        });
      } else {
        console.log('No category selected, clearing subcategories');
        setValues({
          ...values,
          [name]: value,
          subcategories: [],
          subcategory: '',
          subSubcategory: '',
          subSubcategories: [],
          formData: newFormData,
          error: '',
        });
      }
    } else if (name === 'subcategory') {
      if (value) {
        console.log('Loading sub-subcategories for subcategory:', value);
        getSubcategories(value).then((data) => {
          console.log('Sub-subcategories received:', data);
          if (data.error) {
            console.error('Error loading sub-subcategories:', data.error);
            setValues({ ...values, error: data.error });
          } else {
            console.log('Setting sub-subcategories:', data.length, 'sub-subcategories');
            setValues({
              ...values,
              [name]: value,
              subSubcategories: data,
              subSubcategory: '', // Reset sub-subcategory when subcategory changes
              formData: newFormData,
              error: '',
            });
          }
        }).catch((error) => {
          console.error('Failed to load sub-subcategories:', error);
          setValues({ ...values, error: 'Failed to load sub-subcategories' });
        });
      } else {
        console.log('No subcategory selected, clearing sub-subcategories');
        setValues({
          ...values,
          [name]: value,
          subSubcategories: [],
          subSubcategory: '',
          formData: newFormData,
          error: '',
        });
      }
    } else {
      setValues({
        ...values,
        [name]: value,
        formData: newFormData,
        error: '',
      });
    }

    // Mark field as touched
    setTouched({ ...touched, [name]: true });
  };

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: null,
          price: '',
          quantity: '',
          category: '',
          subcategory: '',
          subSubcategory: '',
          subcategories: [],
          subSubcategories: [],
          shipping: '',
          loading: false,
          createdProduct: data.name,
          formData: new FormData(),
        });
        setTouched({
          name: false,
          description: false,
          price: false,
          category: false,
          subcategory: false,
          subSubcategory: false,
          shipping: false,
          quantity: false,
          photo: false,
        });
      }
    });
  };

  const newPostForm = () => (
    <form onSubmit={clickSubmit} encType='multipart/form-data' style={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Button
          variant='outlined'
          component='label'
          fullWidth
          color={touched.photo && (!formData.get('photo') || formData.get('photo') === 'null') ? 'error' : 'primary'}
        >
          Upload Product Photo *
          <input
            type='file'
            name='photo'
            accept='image/*'
            onChange={handleChange('photo')}
            onBlur={handleBlur('photo')}
            hidden
            required
          />
        </Button>
        {touched.photo && (!formData.get('photo') || formData.get('photo') === 'null') && (
          <FormHelperText error>Product photo is required</FormHelperText>
        )}
        {formData.get('photo') && formData.get('photo') !== 'null' && (
          <FormHelperText sx={{ color: 'success.main' }}>
            ✓ Photo selected successfully
          </FormHelperText>
        )}
      </Box>

      <TextField
        label='Product Name'
        variant='outlined'
        fullWidth
        margin='normal'
        value={name}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
        error={touched.name && name.trim() === ''}
        helperText={
          touched.name && name.trim() === '' ? 'Product name is required' : ''
        }
        required
      />

      <TextField
        label='Description'
        variant='outlined'
        fullWidth
        margin='normal'
        multiline
        rows={4}
        value={description}
        onChange={handleChange('description')}
        onBlur={handleBlur('description')}
        error={touched.description && description.trim() === ''}
        helperText={
          touched.description && description.trim() === ''
            ? 'Description is required'
            : ''
        }
        required
      />

      <TextField
        label='Price ($)'
        variant='outlined'
        fullWidth
        margin='normal'
        type='number'
        value={price}
        onChange={handleChange('price')}
        onBlur={handleBlur('price')}
        error={touched.price && (price === '' || price <= 0)}
        helperText={
          touched.price && (price === '' || price <= 0)
            ? 'Price must be greater than 0'
            : 'Enter price in dollars'
        }
        required
        inputProps={{ min: 0, step: 0.01 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />

      {/* Main Category Selection */}
      <FormControl
        fullWidth
        margin='normal'
        error={touched.category && category === ''}
      >
        <InputLabel id='category-label'>Main Category *</InputLabel>
        <Select
          labelId='category-label'
          value={category}
          label='Main Category *'
          onChange={handleChange('category')}
          onBlur={handleBlur('category')}
        >
          <MenuItem value=''>
            <em>Select a main category</em>
          </MenuItem>
          {categories.length === 0 ? (
            <MenuItem disabled>
              <em>No categories available - Create categories first</em>
            </MenuItem>
          ) : (
            categories.map((c) => {
              console.log('Rendering category:', c.name, 'ID:', c._id);
              return (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
              );
            })
          )}
        </Select>
        {touched.category && category === '' && (
          <FormHelperText>Main category is required</FormHelperText>
        )}
      </FormControl>

      {/* Subcategory Selection */}
      {subcategories.length > 0 && (
        <FormControl fullWidth margin='normal' error={touched.subcategory && subcategory === ''}>
          <InputLabel id='subcategory-label'>Subcategory *</InputLabel>
          <Select
            labelId='subcategory-label'
            value={subcategory}
            label='Subcategory *'
            onChange={handleChange('subcategory')}
            onBlur={handleBlur('subcategory')}
          >
            <MenuItem value=''>
              <em>Select a subcategory</em>
            </MenuItem>
            {subcategories.map((sub) => {
              console.log('Rendering subcategory:', sub.name, 'ID:', sub._id);
              return (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.name}
                </MenuItem>
              );
            })}
          </Select>
          {touched.subcategory && subcategory === '' && (
            <FormHelperText>Subcategory is required</FormHelperText>
          )}
        </FormControl>
      )}

      {/* Sub-Subcategory Selection */}
      {subSubcategories.length > 0 && (
        <FormControl fullWidth margin='normal' error={touched.subSubcategory && subSubcategory === ''}>
          <InputLabel id='sub-subcategory-label'>Sub-Subcategory *</InputLabel>
          <Select
            labelId='sub-subcategory-label'
            value={subSubcategory}
            label='Sub-Subcategory *'
            onChange={handleChange('subSubcategory')}
            onBlur={handleBlur('subSubcategory')}
          >
            <MenuItem value=''>
              <em>Select a sub-subcategory</em>
            </MenuItem>
            {subSubcategories.map((subSub) => {
              console.log('Rendering sub-subcategory:', subSub.name, 'ID:', subSub._id);
              return (
                <MenuItem key={subSub._id} value={subSub._id}>
                  {subSub.name}
                </MenuItem>
              );
            })}
          </Select>
          {touched.subSubcategory && subSubcategory === '' && (
            <FormHelperText>Sub-subcategory is required</FormHelperText>
          )}
        </FormControl>
      )}

      <FormControl
        fullWidth
        margin='normal'
        error={touched.shipping && shipping === ''}
      >
        <InputLabel id='shipping-label'>Shipping *</InputLabel>
        <Select
          labelId='shipping-label'
          value={shipping}
          label='Shipping *'
          onChange={handleChange('shipping')}
          onBlur={handleBlur('shipping')}
        >
          <MenuItem value=''>
            <em>Select shipping option</em>
          </MenuItem>
          <MenuItem value='0'>No</MenuItem>
          <MenuItem value='1'>Yes</MenuItem>
        </Select>
        {touched.shipping && shipping === '' && (
          <FormHelperText>Shipping option is required</FormHelperText>
        )}
      </FormControl>

      <TextField
        label='Quantity'
        variant='outlined'
        fullWidth
        margin='normal'
        type='number'
        value={quantity}
        onChange={handleChange('quantity')}
        onBlur={handleBlur('quantity')}
        error={touched.quantity && (quantity === '' || quantity <= 0)}
        helperText={
          touched.quantity && (quantity === '' || quantity <= 0)
            ? 'Quantity must be greater than 0'
            : ''
        }
        required
        inputProps={{ min: 0 }}
      />

      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        size='large'
        sx={{ mt: 3 }}
        disabled={!isFormValid || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Product'}
      </Button>
    </form>
  );

  return (
    <Layout>
      <Grid container spacing={2}>
        {/* LEFT SIDEBAR */}
        <AdminSidebar />
  
        {/* MAIN CONTENT */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title='Add New Product'
              sx={{
                bgcolor: 'background.paper',
              }}
            />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                {error && (
                  <Alert severity='error' sx={{ width: '100%' }}>
                    {error}
                  </Alert>
                )}

                {createdProduct && (
                  <Alert severity='success' sx={{ width: '100%' }}>
                    <Typography variant='h6'>
                      {`${createdProduct}`} has been created successfully!
                    </Typography>
                  </Alert>
                )}

                {loading && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}

                {newPostForm()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AddProduct;
