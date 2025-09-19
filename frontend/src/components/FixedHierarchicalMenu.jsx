import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Breadcrumbs,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Category,
  Home,
} from '@mui/icons-material';
import { getCategories, getSubcategories } from '../admin/apiAdmin';

const FixedHierarchicalMenu = ({ onClose }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMainCategories();
  }, []);

  const loadMainCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      if (data && !data.error) {
        const mainCats = data.filter(cat => !cat.parent);
        setMainCategories(mainCats);
        setCurrentCategories(mainCats);
        setNavigationStack([]);
      }
    } catch (error) {
      console.error('Error loading main categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      const subcategories = await getSubcategories(category._id);
      if (subcategories && subcategories.length > 0) {
        // Has subcategories, show them
        setCurrentCategories(subcategories);
        setNavigationStack(prev => [...prev, { id: category._id, name: category.name }]);
      } else {
        // No subcategories, go to shop
        window.location.href = `/shop?category=${category._id}`;
        onClose();
      }
    } catch (error) {
      console.error('Error checking subcategories:', error);
      // If error, go to shop
      window.location.href = `/shop?category=${category._id}`;
      onClose();
    }
  };

  const handleBackClick = () => {
    if (navigationStack.length === 0) {
      onClose();
      return;
    }

    if (navigationStack.length === 1) {
      // Go back to main categories
      setCurrentCategories(mainCategories);
      setNavigationStack([]);
    } else {
      // Go back one level
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      
      if (newStack.length === 0) {
        setCurrentCategories(mainCategories);
      } else {
        // Load the parent's subcategories
        const parentId = newStack[newStack.length - 1].id;
        loadSubcategories(parentId);
      }
    }
  };

  const loadSubcategories = async (parentId) => {
    try {
      const data = await getSubcategories(parentId);
      if (data && !data.error) {
        setCurrentCategories(data);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      // Home clicked
      setCurrentCategories(mainCategories);
      setNavigationStack([]);
    } else {
      // Navigate to specific level
      const newStack = navigationStack.slice(0, index + 1);
      setNavigationStack(newStack);
      
      if (newStack.length === 0) {
        setCurrentCategories(mainCategories);
      } else {
        const parentId = newStack[newStack.length - 1].id;
        loadSubcategories(parentId);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 400, maxHeight: 500, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={handleBackClick} size="small" sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {navigationStack.length === 0 ? 'Categories' : navigationStack[navigationStack.length - 1]?.name}
          </Typography>
        </Box>
        
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<ArrowForward fontSize="small" />} sx={{ fontSize: '0.875rem' }}>
          <Chip
            label="Home"
            size="small"
            icon={<Home />}
            onClick={() => handleBreadcrumbClick(-1)}
            sx={{ cursor: 'pointer' }}
          />
          {navigationStack.map((item, index) => (
            <Chip
              key={item.id}
              label={item.name}
              size="small"
              onClick={() => handleBreadcrumbClick(index)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Breadcrumbs>
      </Box>

      {/* Categories List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {currentCategories.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Category sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography color="text.secondary">
              No categories available
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {currentCategories.map((category) => (
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
                  <ArrowForward sx={{ fontSize: 16, opacity: 0.7 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Click on categories to explore subcategories
        </Typography>
      </Box>
    </Box>
  );
};

export default FixedHierarchicalMenu;
