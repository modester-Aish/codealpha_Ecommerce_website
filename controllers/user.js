const mongoose = require('mongoose');
const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.userById = async (req, res, next, id) => {
  try {
    console.log('userById middleware called with ID:', id);
    
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ error: 'Database connection error' });
    }
    
    const user = await User.findById(id).maxTimeMS(10000); // 10 second timeout
    if (!user) {
      console.log('User not found for ID:', id);
      return res.status(400).json({ error: 'User not found' });
    }
    console.log('User found:', user.name, 'Role:', user.role);
    req.profile = user;
    next();
  } catch (err) {
    console.error('Error in userById middleware:', err);
    
    // Handle specific error types
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    } else if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
      return res.status(500).json({ error: 'Database connection timeout' });
    } else if (err.name === 'MongoNetworkError') {
      return res.status(500).json({ error: 'Database network error' });
    }
    
    return res.status(400).json({ error: 'User not found' });
  }
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        error: 'You are not authorized to perform this action',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: 'You are not authorized to perform this action',
    });
  }
};

exports.addOrderToUserHistory = async (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  try {
    await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $push: { history: history } },
      { new: true }
    );
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Could not update user purchase history',
    });
  }
};

exports.purchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id })
      .populate('user', '_id name')
      .sort('-created');
    res.json(orders);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
