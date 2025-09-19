import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Category,
} from '@mui/icons-material';
import { getCategories, getSubcategories } from '../admin/apiAdmin';

const SimpleCategoryMenu = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      if (data && !data.error) {
        // Filter only main categories (no parent)
        const mainCats = data.filter(cat => !cat.parent);
        setCategories(mainCats);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    // For now, just navigate to shop with this category
    window.location.href = `/shop?category=${category._id}`;
    onClose();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading categories...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Categories</Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {categories.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Category sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography color="text.secondary">
              No categories available
            </Typography>
          </Box>
        ) : (
          categories.map((category) => (
            <ListItem key={category._id} disablePadding>
              <ListItemButton
                onClick={() => handleCategoryClick(category)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                <Category sx={{ mr: 2, fontSize: 20 }} />
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default SimpleCategoryMenu;
