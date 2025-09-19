const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
  try {
    console.log('categoryById middleware called with ID:', id);
    const category = await Category.findById(id).exec();
    console.log('Category found:', category ? category.name : 'NOT FOUND');
    if (!category) {
      console.log('Category not found, returning 400 error');
      return res.status(400).json({
        error: "Category doesn't exist",
      });
    }
    req.category = category;
    console.log('Category set in req.category:', req.category.name);
    next();
  } catch (err) {
    console.error('Error in categoryById middleware:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.create = async (req, res) => {
  const { name, parent } = req.body;
  
  // If parent is provided, set isSubcategory to true
  const categoryData = {
    name,
    parent: parent || null,
    isSubcategory: !!parent
  };
  
  const category = new Category(categoryData);
  try {
    const data = await category.save();
    // Populate parent information in response
    await data.populate('parent', 'name');
    res.json({ data });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = async (req, res) => {
  const category = req.category;
  const { name, parent } = req.body;
  
  category.name = name;
  category.parent = parent || null;
  category.isSubcategory = !!parent;
  
  try {
    const data = await category.save();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.remove = async (req, res) => {
  console.log('Remove function called');
  console.log('req.category exists:', !!req.category);
  if (!req.category) {
    console.log('req.category is undefined, returning error');
    return res.status(400).json({
      error: "Category not found in request",
    });
  }
  const category = req.category;
  console.log('Delete request for category:', category.name, 'ID:', category._id);
  
  try {
    // Check if category has subcategories
    const subcategories = await Category.find({ parent: category._id });
    console.log('Subcategories found:', subcategories.length);
    
    if (subcategories.length > 0) {
      // Delete all subcategories first
      console.log('Deleting subcategories first...');
      await Category.deleteMany({ parent: category._id });
      console.log('Subcategories deleted');
    }
    
    // Check if category is used in products
    const Product = require('../models/product');
    const productsWithCategory = await Product.find({ 
      $or: [
        { category: category._id },
        { subcategory: category._id }
      ]
    });
    console.log('Products using this category:', productsWithCategory.length);
    
    if (productsWithCategory.length > 0) {
      console.log('Cannot delete - category is used by products');
      return res.status(400).json({
        error: `Cannot delete category "${category.name}" because it is being used by ${productsWithCategory.length} product(s). Please remove or reassign these products first.`,
      });
    }
    
    console.log('Deleting main category...');
    await Category.findByIdAndDelete(category._id);
    console.log('Category deleted successfully');
    
    res.json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Category.find()
      .populate('parent', 'name')
      .sort({ isSubcategory: 1, name: 1 })
      .exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// Get only main categories (not subcategories)
exports.listMainCategories = async (req, res) => {
  try {
    console.log('listMainCategories called');
    // Use parent: null instead of isSubcategory: false for better compatibility
    const data = await Category.find({ parent: null })
      .sort({ name: 1 })
      .exec();
    console.log('Main categories found:', data.length);
    console.log('Main categories data:', data.map(cat => ({ name: cat.name, id: cat._id })));
    res.json(data);
  } catch (err) {
    console.error('Error in listMainCategories:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// Get subcategories for a specific parent category
exports.listSubcategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    console.log('listSubcategories called with parentId:', parentId);
    // Use parent: parentId instead of isSubcategory: true for better compatibility
    const data = await Category.find({ 
      parent: parentId
    })
      .sort({ name: 1 })
      .exec();
    console.log('Subcategories found:', data.length);
    console.log('Subcategories data:', data.map(cat => ({ name: cat.name, id: cat._id })));
    res.json(data);
  } catch (err) {
    console.error('Error in listSubcategories:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
