import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => {
  // Default placeholder images based on category
  const getDefaultImage = (category) => {
    const categoryImages = {
      'Beauty & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=250&fit=crop',
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=250&fit=crop',
      'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=250&fit=crop',
      'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=250&fit=crop',
      'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=250&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=250&fit=crop',
    };
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=250&fit=crop';
  };

  return (
    <div className='product-img' style={{height: '250px'}}>
      <img
        src={`${API}/${url}/photo/${item._id}`}
        alt={item.name}
        className='mb-3'
        onError={(e) => {
          e.target.src = getDefaultImage(item.category?.name);
        }}
        style={{ objectFit: 'cover', height: '100%', width: '100%', display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
      />
    </div>
  );
};

export default ShowImage;
