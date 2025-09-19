import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getCategory, updateCategory, getCategories } from './apiAdmin';

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [categoryType, setCategoryType] = useState('main');
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  // Load category data and all categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load the category to edit
        const categoryData = await getCategory(categoryId);
        if (categoryData.error) {
          setError(categoryData.error);
          return;
        }
        
        // Load all categories for parent selection
        const allCategoriesData = await getCategories();
        if (allCategoriesData.error) {
          setError(allCategoriesData.error);
          return;
        }
        
        // Filter out the current category from parent options to prevent self-reference
        const filteredCategories = allCategoriesData.filter(cat => cat._id !== categoryId);
        setAllCategories(filteredCategories);
        
        // Set form data
        setName(categoryData.name);
        setCategoryType(categoryData.isSubcategory ? 'sub' : 'main');
        setParent(categoryData.parent ? categoryData.parent._id : '');
        
      } catch (err) {
        setError('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  const handleChange = (e) => {
    setError('');
    setName(e.target.value);
  };

  const handleParentChange = (e) => {
    setParent(e.target.value);
  };

  const handleCategoryTypeChange = (e) => {
    const type = e.target.value;
    setCategoryType(type);
    if (type === 'main') {
      setParent(''); // Clear parent when switching to main category
    }
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    // Validation
    if (categoryType === 'sub' && !parent) {
      setError('Please select a parent category for subcategory');
      setLoading(false);
      return;
    }
    
    // Prepare category data
    const categoryData = { name };
    if (categoryType === 'sub' && parent) {
      categoryData.parent = parent;
    } else if (categoryType === 'main') {
      categoryData.parent = null;
    }
    
    try {
      const data = await updateCategory(categoryId, user._id, token, categoryData);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/categories');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const newCategoryForm = () => (
    <Box
      component='form'
      onSubmit={clickSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        width: '100%',
      }}
    >
      <TextField
        label='Category Name'
        variant='outlined'
        value={name}
        onChange={handleChange}
        autoFocus
        required
        fullWidth
      />
      
      <FormControl fullWidth>
        <InputLabel id='category-type-label'>Category Type</InputLabel>
        <Select
          labelId='category-type-label'
          value={categoryType}
          label='Category Type'
          onChange={handleCategoryTypeChange}
        >
          <MenuItem value='main'>
            <em>Main Category (Independent)</em>
          </MenuItem>
          <MenuItem value='sub'>
            <em>Sub Category (Child of Main Category)</em>
          </MenuItem>
        </Select>
        <FormHelperText>
          Choose whether this is a main category or a subcategory
        </FormHelperText>
      </FormControl>
      
      {categoryType === 'sub' && (
        <FormControl fullWidth required>
          <InputLabel id='parent-category-label'>Parent Category *</InputLabel>
          <Select
            labelId='parent-category-label'
            value={parent}
            label='Parent Category *'
            onChange={handleParentChange}
            error={categoryType === 'sub' && !parent}
          >
            <MenuItem value=''>
              <em>Select a parent category</em>
            </MenuItem>
            {allCategories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.isSubcategory ? `└─ ${category.name}` : category.name}
                {category.isSubcategory && category.parent && (
                  <span style={{ color: '#666', fontSize: '0.8em' }}>
                    {' '}(under {category.parent.name})
                  </span>
                )}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={categoryType === 'sub' && !parent}>
            {categoryType === 'sub' && !parent 
              ? 'Parent category is required for subcategories' 
              : 'Select any category as parent (main or subcategory)'
            }
          </FormHelperText>
        </FormControl>
      )}
      
      <Button
        type='submit'
        variant='contained'
        color='primary'
        sx={{ alignSelf: 'flex-start', px: 4 }}
        disabled={!name.trim() || (categoryType === 'sub' && !parent) || loading}
      >
        {loading ? <CircularProgress size={24} /> : `Update ${categoryType === 'main' ? 'Main' : 'Sub'} Category`}
      </Button>
    </Box>
  );

  const showSuccess = () => {
    if (success) {
      return (
        <Alert severity='success' sx={{ width: '100%' }}>
          {categoryType === 'main' ? 'Main' : 'Sub'} Category <strong>{name}</strong> has been updated successfully! Redirecting...
        </Alert>
      );
    }
  };

  const showError = () => {
    if (error) {
      return (
        <Alert severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      );
    }
  };

  const goBack = () => (
    <Button
      component={Link}
      to='/admin/categories'
      variant='outlined'
      color='warning'
      sx={{ mt: 2 }}
    >
      Back to Categories
    </Button>
  );

  if (loading && !name) {
    return (
      <Layout>
        <Grid container spacing={2}>
          <AdminSidebar />
          <Grid size={{ xs: 12, md: 9 }}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container spacing={2}>
        <AdminSidebar />
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title='Edit Category'
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
                  maxWidth: 500,
                  width: '100%',
                }}
              >
                {showSuccess()}
                {showError()}
                {newCategoryForm()}
                {goBack()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default EditCategory;

