# Banner Management Feature

This feature adds a complete banner management system to your MERN e-commerce application, allowing admins to create, manage, and display banners on the home page with sliding text overlays.

## Features

### Admin Dashboard
- **Banner List**: View all banners with preview images, status, and order
- **Add Banner**: Create new banners with image upload and text overlays
- **Edit Banner**: Modify existing banners including image replacement
- **Delete Banner**: Remove banners (also deletes from Cloudinary)
- **Toggle Active/Inactive**: Enable/disable banners without deleting

### Banner Properties
- **Title & Subtitle**: Main banner text content
- **Image Upload**: High-quality banner images stored in Cloudinary
- **Text Overlays**: Multiple customizable text elements with:
  - Custom text content
  - Color selection
  - Font size and weight
  - Position (X/Y coordinates as percentages)
- **Link & Button**: Optional call-to-action button
- **Display Order**: Control banner sequence
- **Active Status**: Show/hide banners

### Home Page Display
- **Banner Slider**: Automatic rotation every 5 seconds
- **Navigation Dots**: Click to jump to specific banners
- **Arrow Navigation**: Manual banner navigation
- **Responsive Design**: Optimized for mobile and desktop
- **Smooth Transitions**: Fade and slide animations

## Setup Instructions

### 1. Environment Variables
Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your `.env` file

### 3. Dependencies
The following packages are already installed:
- `cloudinary` - For image upload and management

### 4. Database
The Banner model will be automatically created when you start the server.

## Usage

### Creating a Banner
1. Go to Admin Dashboard → Add Banner
2. Fill in the banner details:
   - Title (required)
   - Subtitle (optional)
   - Upload banner image
   - Add text overlays with custom positioning
   - Set link and button text (optional)
   - Set display order
3. Click "Create Banner"

### Managing Banners
1. Go to Admin Dashboard → Banner List
2. View all banners with preview images
3. Toggle active/inactive status
4. Edit banners by clicking the edit icon
5. Delete banners by clicking the delete icon

### Text Overlays
- Add multiple text overlays to each banner
- Position them using X/Y coordinates (0-100%)
- Customize color, font size, and weight
- Text overlays will appear on top of the banner image

## API Endpoints

### Banner Routes
- `GET /api/banners` - Get all banners
- `GET /api/banners/active` - Get active banners only
- `GET /api/banner/:bannerId` - Get specific banner
- `POST /api/banner/create/:userId` - Create new banner (Admin only)
- `PUT /api/banner/:bannerId/:userId` - Update banner (Admin only)
- `DELETE /api/banner/:bannerId/:userId` - Delete banner (Admin only)

## File Structure

### Backend
- `models/banner.js` - Banner database model
- `controllers/banner.js` - Banner business logic
- `routes/banner.js` - Banner API routes

### Frontend
- `admin/BannerList.jsx` - Banner management list
- `admin/AddBanner.jsx` - Create new banner form
- `admin/EditBanner.jsx` - Edit existing banner form
- `components/BannerSlider.jsx` - Home page banner display
- `admin/apiAdmin.js` - Banner API functions

## Customization

### Banner Slider Settings
In `components/BannerSlider.jsx`, you can modify:
- Auto-rotation interval (currently 5 seconds)
- Animation duration and effects
- Navigation button styles
- Responsive breakpoints

### Text Overlay Styling
Text overlays support:
- Any CSS color value
- Font sizes in px, em, rem, or %
- Font weights: normal, bold, lighter, bolder
- Precise positioning with percentage coordinates

## Troubleshooting

### Common Issues
1. **Images not uploading**: Check Cloudinary credentials in `.env`
2. **Banners not displaying**: Ensure banners are marked as active
3. **Text overlays not visible**: Check text color contrast against background
4. **Slideshow not working**: Verify multiple active banners exist

### Support
For issues or questions about this banner feature, check:
1. Browser console for JavaScript errors
2. Server logs for API errors
3. Cloudinary dashboard for upload issues
4. Database connection for data persistence




