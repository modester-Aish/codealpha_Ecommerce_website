import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Grid,
  Paper,
} from '@mui/material';
import {
  Category as CategoryIcon,
  AddCircle as AddCircleIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';

const AdminDashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  return (
    <Layout>
      <Box sx={{ mt: 12, mb: 6 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <AdminSidebar />

          {/* MAIN CONTENT */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Card elevation={3} sx={{ minHeight: 500 }}>
              <CardHeader
                title='Admin Profile'
                sx={{
                  bgcolor: 'background.paper',
                  py: 3,
                }}
              />
              <Divider />
              <CardContent sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 4,
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant='h4' component='div' sx={{ mb: 1 }}>
                      {name}
                    </Typography>
                    <Chip
                      label={role === 1 ? 'Administrator' : 'Registered User'}
                      color='primary'
                      size='medium'
                      sx={{ fontSize: '0.9rem', py: 2 }}
                    />
                  </Box>
                </Box>

                <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 3 }}>
                  <List>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 50 }}>
                        <PersonIcon color='primary' sx={{ fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary='User ID' 
                        secondary={_id}
                        primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ variant: 'body1', sx: { mt: 1 } }}
                      />
                    </ListItem>
                    <Divider component='li' sx={{ my: 2 }} />
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon sx={{ minWidth: 50 }}>
                        <EmailIcon color='primary' sx={{ fontSize: '1.5rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary='Email' 
                        secondary={email}
                        primaryTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ variant: 'body1', sx: { mt: 1 } }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
