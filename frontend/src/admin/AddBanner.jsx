import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { Add, Delete, CloudUpload } from '@mui/icons-material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { createBanner } from './apiAdmin';

const AddBanner = () => {
  const navigate = useNavigate();
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    title: '',
    subtitle: '',
    link: '',
    buttonText: '',
    order: 0,
    image: '',
    texts: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleImageChange = (event) => {
    setValues({ ...values, image: event.target.files[0] });
  };

  const addTextOverlay = () => {
    setValues({
      ...values,
      texts: [
        ...values.texts,
        {
          text: '',
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          position: { x: 50, y: 50 }
        }
      ]
    });
  };

  const removeTextOverlay = (index) => {
    const newTexts = values.texts.filter((_, i) => i !== index);
    setValues({ ...values, texts: newTexts });
  };

  const updateTextOverlay = (index, field, value) => {
    const newTexts = [...values.texts];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newTexts[index][parent][child] = value;
    } else {
      newTexts[index][field] = value;
    }
    setValues({ ...values, texts: newTexts });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('subtitle', values.subtitle);
    formData.append('link', values.link);
    formData.append('buttonText', values.buttonText);
    formData.append('order', values.order);
    formData.append('texts', JSON.stringify(values.texts));
    formData.append('image', values.image);

    createBanner(user._id, token, formData).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setSuccess('Banner created successfully!');
        setLoading(false);
        setTimeout(() => {
          navigate('/admin/banners');
        }, 2000);
      }
    });
  };

  const bannerForm = () => (
    <form onSubmit={clickSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Banner Title"
            value={values.title}
            onChange={handleChange('title')}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Subtitle"
            value={values.subtitle}
            onChange={handleChange('subtitle')}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Link URL"
            value={values.link}
            onChange={handleChange('link')}
            fullWidth
            variant="outlined"
            placeholder="https://example.com"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Button Text"
            value={values.buttonText}
            onChange={handleChange('buttonText')}
            fullWidth
            variant="outlined"
            placeholder="Shop Now"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Display Order"
            type="number"
            value={values.order}
            onChange={handleChange('order')}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="banner-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="banner-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ height: '56px' }}
              >
                {values.image ? values.image.name : 'Upload Banner Image'}
              </Button>
            </label>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Text Overlays</Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addTextOverlay}
              size="small"
            >
              Add Text
            </Button>
          </Box>

          {values.texts.map((text, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2">Text Overlay {index + 1}</Typography>
                <IconButton
                  color="error"
                  onClick={() => removeTextOverlay(index)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Text Content"
                    value={text.text}
                    onChange={(e) => updateTextOverlay(index, 'text', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="Color"
                    type="color"
                    value={text.color}
                    onChange={(e) => updateTextOverlay(index, 'color', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="Font Size"
                    value={text.fontSize}
                    onChange={(e) => updateTextOverlay(index, 'fontSize', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="24px"
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="Font Weight"
                    value={text.fontWeight}
                    onChange={(e) => updateTextOverlay(index, 'fontWeight', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Lighter</option>
                    <option value="bolder">Bolder</option>
                  </TextField>
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="X Position (%)"
                    type="number"
                    value={text.position.x}
                    onChange={(e) => updateTextOverlay(index, 'position.x', parseInt(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    label="Y Position (%)"
                    type="number"
                    value={text.position.y}
                    onChange={(e) => updateTextOverlay(index, 'position.y', parseInt(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={clickSubmit}
            disabled={loading || !values.title || !values.image}
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Creating Banner...' : 'Create Banner'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Layout>
      <Grid container spacing={2}>
        <AdminSidebar />
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title="Add New Banner"
              sx={{
                bgcolor: 'background.paper',
              }}
            />
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
              {bannerForm()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AddBanner;


