import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import {
  Category as CategoryIcon,
  AddCircle as AddCircleIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const adminLinks = [
  { text: 'Category List', to: '/admin/categories', icon: <CategoryIcon /> },
  { text: 'Add Category', to: '/create/category', icon: <AddCircleIcon /> },
  { text: 'Add Product', to: '/create/product', icon: <AddCircleIcon /> },
  { text: 'View Orders', to: '/admin/orders', icon: <ShoppingBasketIcon /> },
  { text: 'Manage Products', to: '/admin/products', icon: <InventoryIcon /> },
  { text: 'Manage Users', to: '/admin/users', icon: <PeopleIcon /> },
];

const AdminSidebar = () => {
  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <Card elevation={3} sx={{ minHeight: 500 }}>
        <CardHeader
          title='Admin Actions'
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'common.white',
            py: 3,
          }}
        />
        <Divider />
        <List sx={{ py: 2 }}>
          {adminLinks.map((link, index) => (
            <React.Fragment key={link.text}>
              <ListItem
                button
                component={Link}
                to={link.to}
                sx={{
                  py: 2,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 50 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={link.text}
                  primaryTypographyProps={{ 
                    variant: 'body1', 
                    fontWeight: 'medium',
                    fontSize: '1rem'
                  }}
                />
              </ListItem>
              {index < adminLinks.length - 1 && <Divider component='li' sx={{ mx: 2 }} />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Grid>
  );
};

export default AdminSidebar;
