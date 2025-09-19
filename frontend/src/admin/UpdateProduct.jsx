import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Alert,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getProduct, getMainCategories, getSubcategories, updateProduct } from './apiAdmin';

const UpdateProduct = () => {
  const { productId } = useParams();

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
    photo: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
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
    redirectToProfile,
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
      quantity > 0
      // Photo is optional in update - can keep existing photo
    );
  };

  const isFormValid = validate();

  // Load product and categories
  const init = (id) => {
    getProduct(id).then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        // Create FormData with existing product data
        const newFormData = new FormData();
        newFormData.set('name', data.name);
        newFormData.set('description', data.description);
        newFormData.set('price', data.price);
        newFormData.set('category', data.category?._id || '');
        newFormData.set('subcategory', data.subcategory?._id || '');
        newFormData.set('subSubcategory', data.subSubcategory?._id || '');
        newFormData.set('shipping', data.shipping ? '1' : '0');
        newFormData.set('quantity', data.quantity);
        
        setValues((prev) => ({
          ...prev,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category?._id || '',
          subcategory: data.subcategory?._id || '',
          subSubcategory: data.subSubcategory?._id || '',
          shipping: data.shipping ? '1' : '0',
          quantity: data.quantity,
          formData: newFormData,
        }));
        initCategories();
      }
    });
  };

  const initCategories = () => {
    getMainCategories().then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({ ...prev, categories: data }));
      }
    });
  };

  useEffect(() => {
    if (productId) {
      init(productId);
    }
  }, [productId]);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    // Update formData - preserve existing data and update the changed field
    const newFormData = new FormData();
    for (let [key, val] of formData.entries()) {
      if (key !== name) {
        newFormData.set(key, val);
      }
    }
    if (value !== undefined && value !== null) {
      newFormData.set(name, value);
    }
    
    console.log('Form field changed:', name, 'Value:', value);
    console.log('Updated FormData entries:');
    for (let [key, val] of newFormData.entries()) {
      console.log(key, ':', val);
    }

    // Handle hierarchical category selection
    if (name === 'category') {
      if (value) {
        getSubcategories(value).then((data) => {
          if (data.error) {
            setValues((prev) => ({ ...prev, error: data.error }));
          } else {
            setValues((prev) => ({
              ...prev,
              [name]: value,
              subcategories: data,
              subcategory: '', // Reset subcategory when category changes
              subSubcategory: '', // Reset sub-subcategory
              subSubcategories: [], // Clear sub-subcategories
              formData: newFormData,
              error: '',
            }));
          }
        }).catch((error) => {
          setValues((prev) => ({ ...prev, error: 'Failed to load subcategories' }));
        });
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: value,
          subcategories: [],
          subcategory: '',
          subSubcategory: '',
          subSubcategories: [],
          formData: newFormData,
          error: '',
        }));
      }
    } else if (name === 'subcategory') {
      if (value) {
        getSubcategories(value).then((data) => {
          if (data.error) {
            setValues((prev) => ({ ...prev, error: data.error }));
          } else {
            setValues((prev) => ({
              ...prev,
              [name]: value,
              subSubcategories: data,
              subSubcategory: '', // Reset sub-subcategory when subcategory changes
              formData: newFormData,
              error: '',
            }));
          }
        }).catch((error) => {
          setValues((prev) => ({ ...prev, error: 'Failed to load sub-subcategories' }));
        });
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: value,
          subSubcategories: [],
          subSubcategory: '',
          formData: newFormData,
          error: '',
        }));
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
        formData: newFormData,
        error: '',
      }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    console.log('Update product form submitted');
    console.log('Form data:', formData);
    console.log('Product ID:', productId);
    console.log('User ID:', user._id);
    
    setValues((prev) => ({ ...prev, error: '', loading: true }));

    updateProduct(productId, user._id, token, formData).then((data) => {
      console.log('Update response received:', data);
      
      if (data.error) {
        console.error('Update error:', data.error);
        setValues((prev) => ({ ...prev, error: data.error, loading: false }));
      } else {
        console.log('Product updated successfully:', data.name);
        setValues((prev) => ({
          ...prev,
          loading: false,
          error: '',
          redirectToProfile: true,
          createdProduct: data.name,
        }));
      }
    }).catch((err) => {
      console.error('Update catch error:', err);
      setValues((prev) => ({ ...prev, error: 'Failed to update product', loading: false }));
    });
  };

  const redirectUser = () => {
    if (redirectToProfile && !error) {
      return <Navigate to='/admin/products' />;
    }
  };

  return (
    <Layout>
      <Grid container spacing={2}>
        <AdminSidebar />

        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader title='Edit Product Details' />
            <Divider />
            <CardContent>
              {loading && <Alert severity='info'>Updating product...</Alert>}
              {error && <Alert severity='error'>{error}</Alert>}
              {createdProduct && (
                <Alert severity='success'>
                  {`${createdProduct} updated successfully!`}
                </Alert>
              )}

              <Box component='form' onSubmit={clickSubmit} sx={{ fullWidth: true }}>
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant='outlined'
                    component='label'
                    fullWidth
                    color='primary'
                  >
                    Update Product Photo (Optional)
                    <input
                      type='file'
                      name='photo'
                      accept='image/*'
                      onChange={handleChange('photo')}
                      onBlur={handleBlur('photo')}
                      hidden
                    />
                  </Button>
                  <FormHelperText>
                    Leave empty to keep current photo, or select a new image to update
                  </FormHelperText>
                  {formData.get('photo') && formData.get('photo') !== 'null' && (
                    <FormHelperText sx={{ color: 'success.main' }}>
                      ✓ New photo selected - will replace current photo
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
                        <em>No categories available</em>
                      </MenuItem>
                    ) : (
                      categories.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))
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
                      {subcategories.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                          {sub.name}
                        </MenuItem>
                      ))}
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
                      {subSubcategories.map((subSub) => (
                        <MenuItem key={subSub._id} value={subSub._id}>
                          {subSub.name}
                        </MenuItem>
                      ))}
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
                  {loading ? <CircularProgress size={24} /> : 'Update Product'}
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {redirectUser()}
    </Layout>
  );
};

export default UpdateProduct;
