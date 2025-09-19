const express = require('express');
const router = express.Router();

const {
  create,
  bannerById,
  read,
  update,
  remove,
  list,
  listActive
} = require('../controllers/banner');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// Middleware for file upload
const formidable = require('formidable');

// Parse multipart form data
const parseForm = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 5 * 1024 * 1024; // 5MB

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Error parsing form data',
      });
    }
    req.body = fields;
    req.file = files.image;
    next();
  });
};

router.get('/banner/:bannerId', read);
router.post('/banner/create/:userId', requireSignin, isAuth, isAdmin, parseForm, create);
router.put(
  '/banner/:bannerId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  parseForm,
  update
);
router.delete(
  '/banner/:bannerId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.get('/banners', list);
router.get('/banners/active', listActive);

router.param('bannerId', bannerById);
router.param('userId', userById);

module.exports = router;
