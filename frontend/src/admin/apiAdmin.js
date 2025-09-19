import { API } from '../config';

export const createCategory = (userId, token, category) => {
  return fetch(`${API}/category/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createProduct = (userId, token, product) => {
  return fetch(`${API}/product/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCategories = () => {
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  return fetch(`${API}/categories?t=${timestamp}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getMainCategories = () => {
  console.log('Making API call to getMainCategories:', `${API}/categories/main`);
  return fetch(`${API}/categories/main`, {
    method: 'GET',
  })
    .then((response) => {
      console.log('getMainCategories response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.error('getMainCategories error:', err);
      throw err;
    });
};

export const getSubcategories = (parentId) => {
  console.log('Making API call to getSubcategories:', `${API}/categories/subcategories/${parentId}`);
  return fetch(`${API}/categories/subcategories/${parentId}`, {
    method: 'GET',
  })
    .then((response) => {
      console.log('getSubcategories response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.error('getSubcategories error:', err);
      throw err;
    });
};

export const getCategory = (categoryId) => {
  return fetch(`${API}/category/${categoryId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateCategory = (categoryId, userId, token, category) => {
  return fetch(`${API}/category/${categoryId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteCategory = (categoryId, userId, token) => {
  console.log('Making delete request to:', `${API}/category/${categoryId}/${userId}`);
  return fetch(`${API}/category/${categoryId}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log('Delete response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.error('Delete category error:', err);
      throw err;
    });
};

export const listOrders = (userId, token) => {
  return fetch(`${API}/order/list/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getStatusValues = (userId, token) => {
  return fetch(`${API}/order/status-values/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateOrderStatus = (userId, token, orderId, status) => {
  return fetch(`${API}/order/${orderId}/status/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, orderId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

/**
 * to perform crud on product
 * get all products
 * get a single product
 * update single product
 * delete single product
 */

export const getProducts = () => {
  return fetch(`${API}/products?limit=undefined`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteProduct = (productId, userId, token) => {
  console.log('Delete product API call:', {
    productId,
    userId,
    url: `${API}/product/${productId}/${userId}`
  });
  
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log('Delete response status:', response.status);
      return response.json();
    })
    .then((data) => {
      console.log('Delete response data:', data);
      return data;
    })
    .catch((err) => {
      console.error('Delete product error:', err);
      return { error: 'Failed to delete product' };
    });
};

export const getProduct = (productId) => {
  return fetch(`${API}/product/${productId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateProduct = (productId, userId, token, product) => {
  console.log('Update product API call:', {
    productId,
    userId,
    url: `${API}/product/${productId}/${userId}`,
    body: product
  });
  
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })
    .then((response) => {
      console.log('Update response status:', response.status);
      return response.json();
    })
    .then((data) => {
      console.log('Update response data:', data);
      return data;
    })
    .catch((err) => {
      console.error('Update product error:', err);
      return { error: 'Failed to update product' };
    });
};

export const getUsers = () => {
  return fetch(`${API}/users`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Banner API functions
export const createBanner = (userId, token, banner) => {
  return fetch(`${API}/banner/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: banner,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getBanners = () => {
  return fetch(`${API}/banners`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getActiveBanners = () => {
  return fetch(`${API}/banners/active`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getBanner = (bannerId) => {
  return fetch(`${API}/banner/${bannerId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateBanner = (bannerId, userId, token, banner) => {
  return fetch(`${API}/banner/${bannerId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: banner,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteBanner = (bannerId, userId, token) => {
  return fetch(`${API}/banner/${bannerId}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
