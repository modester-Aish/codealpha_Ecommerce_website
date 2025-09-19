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
  CardMedia,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getBanners, deleteBanner, updateBanner } from './apiAdmin';

const BannerList = () => {
  const { user, token } = isAuthenticated();

  const [banners, setBanners] = React.useState([]);
  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    banner: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const loadBanners = () => {
    getBanners().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setBanners(data);
      }
    });
  };

  const handleDeleteClick = (banner) => {
    setDeleteDialog({
      open: true,
      banner: banner,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.banner) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await deleteBanner(deleteDialog.banner._id, user._id, token);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`Banner "${deleteDialog.banner.title}" deleted successfully!`);
        loadBanners(); // Reload banners
        setDeleteDialog({ open: false, banner: null });
      }
    } catch (err) {
      setError('Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, banner: null });
  };

  const handleToggleActive = async (banner) => {
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', banner.title);
      formData.append('subtitle', banner.subtitle || '');
      formData.append('texts', JSON.stringify(banner.texts));
      formData.append('link', banner.link || '');
      formData.append('buttonText', banner.buttonText || '');
      formData.append('order', banner.order);
      formData.append('isActive', !banner.isActive);

      const data = await updateBanner(banner._id, user._id, token, formData);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`Banner "${banner.title}" ${!banner.isActive ? 'activated' : 'deactivated'} successfully!`);
        loadBanners(); // Reload banners
      }
    } catch (err) {
      setError('Failed to update banner status');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadBanners();
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
              title='Banner List'
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
              
              {banners.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No banners found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Create your first banner to get started
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {banners.map((banner) => (
                    <React.Fragment key={banner._id}>
                      <ListItem
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={banner.isActive}
                                  onChange={() => handleToggleActive(banner)}
                                  disabled={loading}
                                  color="primary"
                                />
                              }
                              label={banner.isActive ? "Active" : "Inactive"}
                              labelPlacement="start"
                            />
                            <IconButton
                              component={Link}
                              to={`/admin/banner/edit/${banner._id}`}
                              color="primary"
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClick(banner)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        }
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 1 }}
                            image={banner.image}
                            alt={banner.title}
                          />
                          <Box sx={{ flex: 1 }}>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h6">{banner.title}</Typography>
                                  <Chip 
                                    label={banner.isActive ? "Active" : "Inactive"} 
                                    size="small" 
                                    color={banner.isActive ? "success" : "default"} 
                                    variant="outlined" 
                                  />
                                  <Chip 
                                    label={`Order: ${banner.order}`} 
                                    size="small" 
                                    color="info" 
                                    variant="filled" 
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {banner.subtitle}
                                  </Typography>
                                  {banner.texts && banner.texts.length > 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                      {banner.texts.length} text overlay{banner.texts.length > 1 ? 's' : ''}
                                    </Typography>
                                  )}
                                  {banner.link && (
                                    <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                                      Link: {banner.link}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider sx={{ my: 1 }} />
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
          Delete Banner
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the banner "{deleteDialog.banner?.title}"?
            <br /><br />
            This action cannot be undone and will also delete the image from Cloudinary.
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

export default BannerList;


