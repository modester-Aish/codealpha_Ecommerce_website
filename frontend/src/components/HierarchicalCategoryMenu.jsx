import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Breadcrumbs,
  Chip,
  Paper,
  Collapse,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Category,
  Home,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { getCategories, getSubcategories } from '../admin/apiAdmin';

const HierarchicalCategoryMenu = ({ onClose }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Load main categories on component mount
  useEffect(() => {
    loadMainCategories();
  }, []);

  const loadMainCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      if (data && !data.error) {
        // Filter only main categories (no parent)
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

  const loadSubcategories = async (parentId, parentName) => {
    setLoading(true);
    try {
      const data = await getSubcategories(parentId);
      if (data && !data.error) {
        setCurrentCategories(data);
        // Add current level to navigation stack
        setNavigationStack(prev => [...prev, { id: parentId, name: parentName }]);
      } else {
        // If no subcategories, navigate to shop
        window.location.href = `/shop?category=${parentId}`;
        onClose();
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      // If error, assume no subcategories and navigate to shop
      window.location.href = `/shop?category=${parentId}`;
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    // Check if category has subcategories
    try {
      const subcategories = await getSubcategories(category._id);
      if (subcategories && subcategories.length > 0) {
        // Has subcategories, navigate to them
        setCurrentCategories(subcategories);
        setNavigationStack(prev => [...prev, { id: category._id, name: category.name }]);
      } else {
        // No subcategories, navigate to shop with this category
        window.location.href = `/shop?category=${category._id}`;
        onClose();
      }
    } catch (error) {
      console.error('Error checking subcategories:', error);
      // If error, assume no subcategories and navigate to shop
      window.location.href = `/shop?category=${category._id}`;
      onClose();
    }
  };

  const handleBackClick = () => {
    if (navigationStack.length === 0) {
      // Already at main level, close menu
      onClose();
      return;
    }

    if (navigationStack.length === 1) {
      // Go back to main categories
      setCurrentCategories(mainCategories);
      setNavigationStack([]);
    } else {
      // Go back one level
      const newStack = [...navigationStack];
      newStack.pop();
      const parentId = newStack[newStack.length - 1]?.id;
      
      if (parentId) {
        loadSubcategories(parentId, newStack[newStack.length - 1].name);
      } else {
        setCurrentCategories(mainCategories);
        setNavigationStack([]);
      }
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
        loadSubcategories(parentId, newStack[newStack.length - 1].name);
      }
    }
  };

  const toggleExpanded = (categoryId) => {
    setExpandedItems(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <Box sx={{ width: 400, maxHeight: 500, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header with back button and breadcrumbs */}
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
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : currentCategories.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Category sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography color="text.secondary">
              No categories available
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {currentCategories.map((category, index) => (
              <React.Fragment key={category._id}>
                <ListItem disablePadding>
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
                {index < currentCategories.length - 1 && <Divider />}
              </React.Fragment>
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

export default HierarchicalCategoryMenu;
