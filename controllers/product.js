const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Get product by ID middleware
exports.productById = async (req, res, next, id) => {
  try {
    console.log('productById middleware called with ID:', id);
    const product = await Product.findById(id)
      .populate('category')
      .populate('subcategory')
      .populate('subSubcategory')
      .exec();
    
    console.log('Product found:', product ? product.name : 'Not found');
    
    if (!product) {
      console.log('Product not found for ID:', id);
      return res.status(400).json({ error: 'Product not found' });
    }
    req.product = product;
    next();
  } catch (err) {
    console.error('Error in productById middleware:', err);
    return res.status(400).json({ error: 'Product not found' });
  }
};

// Read product details
exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Create a new product
exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024; // 5MB max file size
  form.uploadDir = './uploads'; // Set upload directory
  form.multiples = false;

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads', { recursive: true });
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable parse error:', err);
      return res.status(400).json({ error: 'Image could not be uploaded: ' + err.message });
    }

    console.log('Formidable parsed data:');
    console.log('Fields:', fields);
    console.log('Files:', files);
    console.log('Files keys:', Object.keys(files));

    const { name, description, price, category, subcategory, subSubcategory, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Handle photo file - formidable returns array
    const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
    
    if (!photoFile) {
      return res.status(400).json({ error: 'Product photo is required' });
    }

    // Fix form fields - convert arrays to proper types
    const processedFields = { ...fields };
    
    // Convert quantity from array to number
    if (Array.isArray(processedFields.quantity)) {
      processedFields.quantity = parseInt(processedFields.quantity[0], 10);
    } else {
      processedFields.quantity = parseInt(processedFields.quantity, 10);
    }
    
    // Convert price from array to number
    if (Array.isArray(processedFields.price)) {
      processedFields.price = parseFloat(processedFields.price[0]);
    } else {
      processedFields.price = parseFloat(processedFields.price);
    }
    
    // Convert shipping from array to boolean
    if (Array.isArray(processedFields.shipping)) {
      processedFields.shipping = processedFields.shipping[0] === '1' || processedFields.shipping[0] === 'true';
    } else {
      processedFields.shipping = processedFields.shipping === '1' || processedFields.shipping === 'true';
    }
    
    // Convert string fields from arrays to strings
    const stringFields = ['name', 'description', 'category', 'subcategory', 'subSubcategory'];
    stringFields.forEach(field => {
      if (Array.isArray(processedFields[field])) {
        processedFields[field] = processedFields[field][0];
      }
    });

    let product = new Product(processedFields);

    console.log('Photo file received:', {
      name: photoFile.originalFilename,
      size: photoFile.size,
      type: photoFile.mimetype,
      path: photoFile.filepath
    });
    
    if (photoFile.size > 1000000) {
      return res
        .status(400)
        .json({ error: 'Image should be less than 1MB in size' });
    }
    
    try {
      // Check if file exists and has a path
      if (photoFile && photoFile.filepath) {
        // Read the file data
        const fileData = fs.readFileSync(photoFile.filepath);
        product.photo.data = fileData;
        product.photo.contentType = photoFile.mimetype;
        console.log('Photo saved successfully, size:', fileData.length, 'bytes');
        
        // Clean up the temporary file
        try {
          fs.unlinkSync(photoFile.filepath);
          console.log('Temporary file cleaned up');
        } catch (cleanupError) {
          console.log('Could not clean up temporary file:', cleanupError.message);
        }
      } else {
        console.error('Photo file or path is missing:', photoFile);
        return res.status(400).json({ error: 'Photo file or path is missing' });
      }
    } catch (photoError) {
      console.error('Error reading photo file:', photoError);
      return res.status(400).json({ error: 'Error processing photo file: ' + photoError.message });
    }

    try {
      const result = await product.save();
      res.json(result);
    } catch (error) {
      return res.status(400).json({ error: errorHandler(error) });
    }
  });
};

// Delete a product
exports.remove = async (req, res) => {
  try {
    console.log('Delete product request received');
    console.log('Product ID:', req.params.productId);
    console.log('User ID:', req.params.userId);
    
    let product = req.product;
    console.log('Product found:', product ? product.name : 'Not found');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const result = await Product.findByIdAndDelete(product._id);
    console.log('Delete result:', result);
    
    if (!result) {
      return res.status(404).json({ error: 'Product not found or already deleted' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update a product
exports.update = async (req, res) => {
  console.log('Update product request received');
  console.log('Product ID:', req.params.productId);
  console.log('User ID:', req.params.userId);
  
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024; // 5MB max file size

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable parse error:', err);
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    console.log('Formidable parsed data:');
    console.log('Fields:', fields);
    console.log('Files:', files);

    let product = req.product;
    console.log('Product found:', product ? product.name : 'Not found');
    
    // Fix form fields - convert arrays to proper types
    const processedFields = { ...fields };
    
    // Convert quantity from array to number
    if (processedFields.quantity !== undefined) {
      if (Array.isArray(processedFields.quantity)) {
        processedFields.quantity = parseInt(processedFields.quantity[0], 10);
      } else {
        processedFields.quantity = parseInt(processedFields.quantity, 10);
      }
    }
    
    // Convert price from array to number
    if (processedFields.price !== undefined) {
      if (Array.isArray(processedFields.price)) {
        processedFields.price = parseFloat(processedFields.price[0]);
      } else {
        processedFields.price = parseFloat(processedFields.price);
      }
    }
    
    // Convert shipping from array to boolean
    if (processedFields.shipping !== undefined) {
      if (Array.isArray(processedFields.shipping)) {
        processedFields.shipping = processedFields.shipping[0] === '1' || processedFields.shipping[0] === 'true';
      } else {
        processedFields.shipping = processedFields.shipping === '1' || processedFields.shipping === 'true';
      }
    }
    
    // Convert string fields from arrays to strings
    const stringFields = ['name', 'description', 'category', 'subcategory', 'subSubcategory'];
    stringFields.forEach(field => {
      if (processedFields[field] !== undefined && Array.isArray(processedFields[field])) {
        processedFields[field] = processedFields[field][0];
      }
    });
    
    product = _.extend(product, processedFields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: 'Image should be less than 1MB in size' });
      }
      if (files.photo.path) {
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }
    } else {
      // If no new photo provided, keep existing photo
      // This allows updating other fields without changing photo
    }

    try {
      console.log('Saving updated product...');
      const result = await product.save();
      console.log('Product updated successfully:', result.name);
      res.json(result);
    } catch (err) {
      console.error('Error saving product:', err);
      return res.status(400).json({ error: errorHandler(err) });
    }
  });
};

// List products with filters and pagination
exports.list = async (req, res) => {
  const order = req.query.order || 'asc';
  const sortBy = req.query.sortBy || '_id';
  const limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
    const products = await Product.find()
      .select('-photo')
      .populate('category')
      .populate('subcategory')
      .populate('subSubcategory')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    res.json(products);
  } catch (error) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

// List related products based on category
exports.listRelated = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
    console.log('Finding related products for:', req.product._id);
    console.log('Product category:', req.product.category);
    
    const products = await Product.find({
      _id: { $ne: req.product._id },
      category: req.product.category,
    })
      .limit(limit)
      .populate('category', '_id name')
      .exec();
    
    console.log('Found related products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error finding related products:', error);
    return res.status(400).json({ error: 'Products not found' });
  }
};

// List categories used in products
exports.listCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', {}).exec();
    res.json(categories);
  } catch (error) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};

// List products by search
exports.listBySearch = async (req, res) => {
  const order = req.body.order || 'desc';
  const sortBy = req.body.sortBy || '_id';
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const products = await Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .populate('subcategory')
      .populate('subSubcategory')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();
    res.json({ size: products.length, data: products });
  } catch (error) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

// Product photo handler
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  // Return a default image or 404 if no photo
  return res.status(404).json({ error: 'Photo not found' });
};

// List products by search (query-based)
exports.listSearch = async (req, res) => {
  const query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    try {
      const products = await Product.find(query).select('-photo').exec();
      res.json(products);
    } catch (error) {
      return res.status(400).json({ error: errorHandler(error) });
    }
  }
};

// Decrease product quantity after purchase
exports.decreaseQuantity = async (req, res, next) => {
  const bulkOps = req.body.order.products.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));

  try {
    await Product.bulkWrite(bulkOps, {});
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Could not update product' });
  }
};