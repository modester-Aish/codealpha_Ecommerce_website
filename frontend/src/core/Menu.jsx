import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';
import { getCategories, getSubcategories, deleteCategory } from '../admin/apiAdmin';
import FixedHierarchicalMenu from '../components/FixedHierarchicalMenu';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu as MuiMenu,
  MenuItem,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  Home,
  Storefront,
  Dashboard,
  AccountCircle,
  PersonAdd,
  ExitToApp,
  Store,
  Menu as MenuIcon,
  Category,
  ExpandMore,
  ExpandLess,
  Add,
  Remove,
  Delete,
  Image,
  Search,
  Phone,
  Favorite,
  Facebook,
  Twitter,
  YouTube,
  Instagram,
  KeyboardArrowDown,
} from '@mui/icons-material';

const MaterialAppBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null,
    isSubcategory: false,
    isSubSubcategory: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const currentPath = window.location.pathname;

  const isMobileMenuOpen = Boolean(mobileAnchorEl);


  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleCategoryMenuClick = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
    setShowCategoryMenu(true);
  };

  const handleCategoryMenuClose = () => {
    setShowCategoryMenu(false);
    setCategoryMenuAnchor(null);
  };


  const handleDeleteClick = (category, isSubcategory = false, isSubSubcategory = false, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Delete button clicked for category:', category, 'isSubcategory:', isSubcategory, 'isSubSubcategory:', isSubSubcategory);
    setDeleteDialog({
      open: true,
      category: category,
      isSubcategory: isSubcategory,
      isSubSubcategory: isSubSubcategory,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.category) return;
    
    console.log('Delete confirm clicked for category:', deleteDialog.category);
    setIsDeleting(true);
    try {
      const { user, token } = isAuthenticated();
      console.log('User:', user, 'Token:', token ? 'Present' : 'Missing');
      
      console.log('Making delete request for category ID:', deleteDialog.category._id);
      console.log('User ID:', user._id);
      console.log('Token present:', !!token);
      
      const data = await deleteCategory(deleteDialog.category._id, user._id, token);
      console.log('Delete API response:', data);
      
      if (data && data.error) {
        // Show detailed error message
        alert(`Cannot delete category: ${data.error}`);
        console.error('Delete error:', data.error);
      } else {
        // Reload categories after successful deletion
        console.log('Delete successful, reloading categories...');
        await handleCategoryMenuEnter();
        console.log('Categories reloaded after deletion');
        alert(`Category "${deleteDialog.category.name}" deleted successfully!`);
      }
    } catch (error) {
      alert('Failed to delete category. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, category: null, isSubcategory: false, isSubSubcategory: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, category: null, isSubcategory: false, isSubSubcategory: false });
  };

  const handleSignout = () => {
    signout(() => {
      navigate('/');
    });
    handleMobileMenuClose();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isActive = (path) => currentPath === path;

  // Scroll effect to hide banner when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Navigation items data
  const navItems = [
    { path: '/', label: 'Home', icon: <Home />, show: true },
    { path: '/shop', label: 'Shop', icon: <Storefront />, show: true },
    {
      path: '/user/dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      show: isAuthenticated() && isAuthenticated().user.role === 0,
    },
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      show: isAuthenticated() && isAuthenticated().user.role === 1,
    },
    {
      path: '/signin',
      label: 'Sign In',
      icon: <AccountCircle />,
      show: !isAuthenticated(),
    },
    {
      path: '/signup',
      label: 'Sign Up',
      icon: <PersonAdd />,
      show: !isAuthenticated(),
    },
  ];

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
      {/* Center navigation */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Home Button */}
            <Button
              component={Link}
        to="/"
              sx={{
                color: 'white',
          minWidth: 'auto',
          px: 1.5,
          fontSize: '0.875rem',
          fontWeight: isActive('/') ? 'bold' : 'normal',
          backgroundColor: isActive('/')
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
        Home
            </Button>
      
      {/* Categories Click Menu */}
      <Button
        onClick={handleCategoryMenuClick}
        sx={{
          color: 'white',
          minWidth: 'auto',
          px: 2,
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        Categories
      </Button>
      
      {/* Rest of navigation items */}
      {navItems
        .filter(item => item.path !== '/' && item.show)
        .map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              color: 'white',
              minWidth: 'auto',
              px: 1.5,
              fontSize: '0.875rem',
              fontWeight: isActive(item.path) ? 'bold' : 'normal',
              backgroundColor: isActive(item.path)
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      
      {isAuthenticated() && (
        <Button
          onClick={handleSignout}
          sx={{
            color: 'white',
            minWidth: 'auto',
            px: 1.5,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Sign Out
        </Button>
      )}
      </Box>
      
      {/* Category Menu - Shows on click */}
      <MuiMenu
        anchorEl={categoryMenuAnchor}
        open={showCategoryMenu}
        onClose={handleCategoryMenuClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
          },
        }}
      >
        <FixedHierarchicalMenu onClose={handleCategoryMenuClose} />
      </MuiMenu>
    </Box>
  );

  const renderMobileMenu = () => (
    <MuiMenu
      anchorEl={mobileAnchorEl}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      }}
      MenuListProps={{
        sx: {
          padding: 0,
        },
      }}
    >
      {/* Search in mobile menu */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'white', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiInputBase-input': {
                color: 'white',
                fontSize: '0.875rem',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Navigation items */}
      {navItems.map(
        (item) =>
          item.show && (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{
                backgroundColor: isActive(item.path)
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          )
      )}

      {/* Cart in mobile menu */}
      <MenuItem
        component={Link}
        to="/cart"
        onClick={handleMobileMenuClose}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <ListItemIcon sx={{ color: 'white' }}>
          <Badge badgeContent={itemTotal()} color="error">
            <ShoppingCart />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Cart" />
      </MenuItem>

      {isAuthenticated() && (
        <>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          <MenuItem
            onClick={handleSignout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary='Sign Out' />
          </MenuItem>
        </>
      )}
    </MuiMenu>
  );

  // Removed old category menu function - now using hover-based navigation

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: theme.zIndex.drawer + 1 }}>
      {/* Top Golden Banner - Only show on home page and hide when scrolled */}
      {currentPath === '/' && !isScrolled && currentPath !== '/shop' && (
        <Box
          sx={{
            backgroundColor: '#2C3E50', // Dark blue/grey like footer
            color: 'white',
            py: 0.2,
            px: 3,
            transition: 'transform 0.3s ease-in-out',
            transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)',
          }}
        >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left - Social Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
                <Facebook sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
                <Twitter sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
                <YouTube sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
                <Instagram sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            {/* Right - My Account */}
            {isAuthenticated() ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccountCircle sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {isAuthenticated().user.name}
                </Typography>
                <Button
                  onClick={handleSignout}
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  component={Link}
                  to="/signin"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
            component={Link}
                  to="/signup"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Container>
        </Box>
      )}

      {/* Main Header - White Background */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          py: 1,
          transition: 'transform 0.3s ease-in-out',
          transform: isScrolled && currentPath === '/' ? 'translateY(-40px)' : 'translateY(0)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left - Phone Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#B0BEC5', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#B0BEC5', fontSize: '0.75rem' }}>
                CALL US
              </Typography>
              <Typography variant="body2" sx={{ color: '#B0BEC5', fontWeight: 'bold' }}>
                (123) 456 7890
              </Typography>
            </Box>

            {/* Center - Brand Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#2C3E50',
                  borderRadius: '50% 50% 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                  }}
                >
                  G
                </Typography>
              </Box>
          <Typography
                variant="subtitle1"
            component={Link}
                to="/"
            sx={{
              fontWeight: 'bold',
              textDecoration: 'none',
                  color: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.9rem',
            }}
          >
                GENTLEMAN JONES
          </Typography>
        </Box>

            {/* Right - Search, Wishlist, Cart */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(44, 62, 80, 0.1)',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  minWidth: 200,
                  '&:hover': {
                    backgroundColor: 'rgba(44, 62, 80, 0.2)',
                  },
                  '&:focus-within': {
                    backgroundColor: 'rgba(44, 62, 80, 0.2)',
                  },
                }}
              >
                <TextField
                  variant="standard"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#2C3E50', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-input': {
                      color: 'black',
                      fontSize: '0.875rem',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
              <IconButton sx={{ color: '#2C3E50', position: 'relative' }}>
                <Favorite />
                <Badge
                  badgeContent={0}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    '& .MuiBadge-badge': {
                      backgroundColor: '#2C3E50',
                      color: 'white',
                      fontSize: '0.6rem',
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                />
              </IconButton>
              <IconButton
                component={Link}
                to="/cart"
                sx={{ color: '#2C3E50', position: 'relative' }}
              >
                <ShoppingCart />
                <Badge
                  badgeContent={itemTotal()}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    '& .MuiBadge-badge': {
                      backgroundColor: '#2C3E50',
                      color: 'white',
                      fontSize: '0.6rem',
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '2px solid #2C3E50',
          py: 0.3,
          mb: (currentPath === '/admin/dashboard' || currentPath === '/user/dashboard') ? 4 : 2, // More margin for dashboard pages
          transition: 'transform 0.3s ease-in-out',
          transform: isScrolled && currentPath === '/' ? 'translateY(-40px)' : 'translateY(0)',
        }}
      >
        <Container maxWidth="lg">
        {!isMobile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {currentPath === '/shop' ? (
                // Show Home, Categories, and Dashboard on shop page
                <>
                  <Button
                    component={Link}
                    to="/"
                    sx={{
                      color: 'black',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      letterSpacing: '1px',
                      borderBottom: isActive('/') ? '2px solid #2C3E50' : '2px solid transparent',
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        borderBottom: '2px solid #2C3E50',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={handleCategoryMenuClick}
                    sx={{
                      color: 'black',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      letterSpacing: '1px',
                      borderBottom: '2px solid transparent',
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        borderBottom: '2px solid #2C3E50',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Categories
                  </Button>
                  {/* Dashboard option for authenticated users */}
                  {isAuthenticated() && (
                    <Button
                      component={Link}
                      to={isAuthenticated().user.role === 1 ? '/admin/dashboard' : '/user/dashboard'}
                      sx={{
                        color: 'black',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        letterSpacing: '1px',
                        borderBottom: isActive('/admin/dashboard') || isActive('/user/dashboard') ? '2px solid #D4AF37' : '2px solid transparent',
                        borderRadius: 0,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          borderBottom: '2px solid #2C3E50',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                  )}
                </>
              ) : (
                // Show all navigation items on other pages
                <>
                  {navItems
                    .filter(item => item.show)
                    .map((item) => (
                      <Button
                        key={item.path}
                        component={Link}
                        to={item.path}
                        sx={{
                          color: 'black',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          letterSpacing: '1px',
                          borderBottom: isActive(item.path) ? '2px solid #D4AF37' : '2px solid transparent',
                          borderRadius: 0,
                          px: 2,
                          py: 1,
                          '&:hover': {
                            borderBottom: '2px solid #2C3E50',
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  <Button
                    onClick={handleCategoryMenuClick}
                    sx={{
                      color: 'black',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      letterSpacing: '1px',
                      borderBottom: '2px solid transparent',
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        borderBottom: '2px solid #2C3E50',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Categories
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            color='inherit'
            aria-label='open menu'
            onClick={handleMobileMenuOpen}
                sx={{ color: '#2C3E50' }}
          >
            <MenuIcon />
          </IconButton>
            </Box>
          )}
        </Container>
      </Box>

      {/* Category Menu */}
      <MuiMenu
        anchorEl={categoryMenuAnchor}
        open={showCategoryMenu}
        onClose={handleCategoryMenuClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
          },
        }}
      >
        <FixedHierarchicalMenu onClose={handleCategoryMenuClose} />
      </MuiMenu>

      {/* Mobile Menu */}
      {isMobile && renderMobileMenu()}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete {deleteDialog.isSubSubcategory ? 'Sub-Subcategory' : deleteDialog.isSubcategory ? 'Subcategory' : 'Category'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the {deleteDialog.isSubSubcategory ? 'sub-subcategory' : deleteDialog.isSubcategory ? 'subcategory' : 'category'} "{deleteDialog.category?.name}"?
            {deleteDialog.isSubSubcategory && (
              <><br /><br />
              <strong>Note:</strong> This will permanently remove the sub-subcategory.
              </>
            )}
            {deleteDialog.isSubcategory && !deleteDialog.isSubSubcategory && (
              <><br /><br />
              <strong>Note:</strong> This will permanently remove the subcategory.
              </>
            )}
            {!deleteDialog.isSubcategory && !deleteDialog.isSubSubcategory && (
              <><br /><br />
              <strong>Warning:</strong> This will also delete any subcategories and sub-subcategories under this category.
              </>
            )}
            <br /><br />
            <strong>Important:</strong> If this category is being used by any products, deletion will be prevented. You'll need to remove or reassign those products first.
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialAppBar;
