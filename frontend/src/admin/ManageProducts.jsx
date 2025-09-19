import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getProducts, deleteProduct } from './apiAdmin';
import { API } from '../config';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    setLoading(true);
    getProducts().then((data) => {
      if (data.error) {
        setError(data.error);
        console.log(data.error);
      } else {
        setProducts(data);
        setError('');
      }
      setLoading(false);
    }).catch((err) => {
      setError('Failed to load products');
      setLoading(false);
    });
  };

  const handleDeleteClick = (productId, productName) => {
    setDeleteDialog({
      open: true,
      productId,
      productName,
    });
  };

  const handleDeleteConfirm = () => {
    setLoading(true);
    console.log('Attempting to delete product:', deleteDialog.productId);
    
    deleteProduct(deleteDialog.productId, user._id, token).then((data) => {
      console.log('Delete response received:', data);
      
      if (data.error) {
        setError(data.error);
        console.error('Delete error:', data.error);
      } else {
        setSuccess(`${deleteDialog.productName} deleted successfully!`);
        console.log('Product deleted successfully, reloading products...');
        loadProducts();
      }
      setLoading(false);
      setDeleteDialog({ open: false, productId: null, productName: '' });
    }).catch((err) => {
      console.error('Delete catch error:', err);
      setError('Failed to delete product');
      setLoading(false);
      setDeleteDialog({ open: false, productId: null, productName: '' });
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, productId: null, productName: '' });
  };

  useEffect(() => {
    loadProducts();
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
              title={`Total Products: ${products.length}`}
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button
                  component={Link}
                  to="/create/product"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Add New Product
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Typography>Loading products...</Typography>
                </Box>
              ) : products.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant='h6' color='text.secondary' gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Start by adding your first product
                  </Typography>
                  <Button
                    component={Link}
                    to="/create/product"
                    variant="contained"
                    color="primary"
                  >
                    Add Product
                  </Button>
                </Box>
              ) : (
                <List>
                  {products.map((p, i) => (
                    <React.Fragment key={p._id}>
                      <ListItem
                        sx={{ py: 2 }}
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title='Edit Product'>
                              <IconButton
                                component={Link}
                                to={`/admin/product/update/${p._id}`}
                                color='primary'
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete Product'>
                              <IconButton
                                color='error'
                                size="small"
                                onClick={() => handleDeleteClick(p._id, p.name)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`${API.replace('/api', '')}/api/product/photo/${p._id}`}
                            alt={p.name}
                            sx={{ width: 56, height: 56 }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/56x56?text=No+Image';
                            }}
                          >
                            <ImageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" component="span">
                                {p.name}
                              </Typography>
                              <Chip 
                                label={`$${p.price}`} 
                                color="primary" 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {p.description && p.description.length > 100 
                                  ? `${p.description.substring(0, 100)}...` 
                                  : p.description || 'No description available'
                                }
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={`Qty: ${p.quantity}`} 
                                  size="small" 
                                  variant="outlined"
                                  color={p.quantity > 0 ? "success" : "error"}
                                />
                                <Chip 
                                  label={p.shipping ? "Shipping Available" : "No Shipping"} 
                                  size="small" 
                                  variant="outlined"
                                  color={p.shipping ? "info" : "default"}
                                />
                                {p.category && (
                                  <Chip 
                                    label={p.category.name} 
                                    size="small" 
                                    variant="outlined"
                                    color="secondary"
                                  />
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < products.length - 1 && <Divider />}
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
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the product "{deleteDialog.productName}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ManageProducts;
