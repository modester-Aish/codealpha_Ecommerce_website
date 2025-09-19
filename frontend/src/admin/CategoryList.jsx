import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getCategories, deleteCategory } from './apiAdmin';

const CategoryList = () => {
  const { user, token } = isAuthenticated();

  const [categories, setCategories] = React.useState([]);
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    category: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const handleDeleteClick = (category) => {
    setDeleteDialog({
      open: true,
      category: category,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.category) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await deleteCategory(deleteDialog.category._id, user._id, token);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`Category "${deleteDialog.category.name}" deleted successfully!`);
        loadCategories(); // Reload categories
        setDeleteDialog({ open: false, category: null });
      }
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, category: null });
  };

  // Group categories by main categories and subcategories
  const groupedCategories = React.useMemo(() => {
    const mainCategories = categories.filter(cat => !cat.isSubcategory);
    const subcategories = categories.filter(cat => cat.isSubcategory);
    
    return mainCategories.map(mainCat => ({
      ...mainCat,
      subcategories: subcategories.filter(sub => sub.parent && sub.parent._id === mainCat._id)
    }));
  }, [categories]);

  // Get all subcategories that are not direct children of main categories
  const nestedSubcategories = React.useMemo(() => {
    const mainCategories = categories.filter(cat => !cat.isSubcategory);
    const subcategories = categories.filter(cat => cat.isSubcategory);
    
    return subcategories.filter(sub => {
      // Check if this subcategory's parent is also a subcategory
      const parent = sub.parent;
      if (!parent) return false;
      
      // If parent is a subcategory, this is a nested subcategory
      return subcategories.some(s => s._id === parent._id);
    });
  }, [categories]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Layout>
      <Grid container spacing={2}>
        {/* LEFT SIDEBAR */}
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title='Category List'
              sx={{
                bgcolor: 'background.paper',
              }}
            />
            <Divider />
            <CardContent>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity='success' sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              
              {groupedCategories.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No categories found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Create your first category to get started
                  </Typography>
                </Box>
              ) : (
              <List dense>
                  {groupedCategories.map((category) => (
                  <React.Fragment key={category._id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            component={Link}
                            to={`/admin/category/edit/${category._id}`}
                            color="primary"
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(category)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{category.name}</Typography>
                            <Chip 
                              label="Main Category" 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                            {category.subcategories && category.subcategories.length > 0 && (
                              <Chip 
                                label={`${category.subcategories.length} subcategories`} 
                                size="small" 
                                color="info" 
                                variant="filled" 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          category.subcategories && category.subcategories.length > 0 
                            ? `Contains ${category.subcategories.length} subcategories`
                            : "No subcategories"
                        }
                      />
                    </ListItem>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <Box sx={{ ml: 4, borderLeft: '2px solid', borderColor: 'primary.light', pl: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                          Subcategories:
                        </Typography>
                        {category.subcategories.map((subcategory) => {
                          // Find nested subcategories for this subcategory
                          const nestedSubs = nestedSubcategories.filter(nested => 
                            nested.parent && nested.parent._id === subcategory._id
                          );
                          
                          return (
                            <React.Fragment key={subcategory._id}>
                              <ListItem 
                                sx={{ py: 0.5 }}
                                secondaryAction={
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      component={Link}
                                      to={`/admin/category/edit/${subcategory._id}`}
                                      color="primary"
                                      size="small"
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDeleteClick(subcategory)}
                                      color="error"
                                      size="small"
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                }
                              >
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body2">• {subcategory.name}</Typography>
                                      <Chip 
                                        label="Child" 
                                        size="small" 
                                        color="secondary" 
                                        variant="outlined" 
                                      />
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {nestedSubs.length > 0 && (
                                <Box sx={{ ml: 3, borderLeft: '1px solid', borderColor: 'secondary.light', pl: 1 }}>
                                  {nestedSubs.map((nestedSub) => (
                                    <ListItem 
                                      key={nestedSub._id} 
                                      sx={{ py: 0.3 }}
                                      secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <IconButton
                                            component={Link}
                                            to={`/admin/category/edit/${nestedSub._id}`}
                                            color="primary"
                                            size="small"
                                          >
                                            <Edit />
                                          </IconButton>
                                          <IconButton
                                            onClick={() => handleDeleteClick(nestedSub)}
                                            color="error"
                                            size="small"
                                          >
                                            <Delete />
                                          </IconButton>
                                        </Box>
                                      }
                                    >
                                      <ListItemText 
                                        primary={
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                              └─ {nestedSub.name}
                                            </Typography>
                                            <Chip 
                                              label="Nested" 
                                              size="small" 
                                              color="warning" 
                                              variant="outlined" 
                                            />
                                          </Box>
                                        }
                                      />
                  </ListItem>
                                  ))}
                                </Box>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </Box>
                    )}
                    <Divider sx={{ my: 2 }} />
                  </React.Fragment>
                ))}
              </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the category "{deleteDialog.category?.name}"?
            {deleteDialog.category?.isSubcategory && (
              <><br /><br />
              <strong>Warning:</strong> This will also delete any nested subcategories under this category.
              </>
            )}
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CategoryList;
