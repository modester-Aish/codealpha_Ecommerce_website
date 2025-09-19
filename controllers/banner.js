const Banner = require('../models/banner');
const { errorHandler } = require('../helpers/dbErrorHandler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.bannerById = async (req, res, next, id) => {
  try {
    const banner = await Banner.findById(id).exec();
    if (!banner) {
      return res.status(400).json({
        error: "Banner doesn't exist",
      });
    }
    req.banner = banner;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('Banner creation started...');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title, subtitle, texts, link, buttonText, order } = req.body;
    
    if (!title) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }
    
    let imageUrl = '';
    let cloudinaryId = '';
    
    // Check if Cloudinary credentials are available
    if (process.env.CLOUDINARY_CLOUD_NAME && req.file) {
      console.log('Uploading to Cloudinary...');
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'banners',
          resource_type: 'auto',
        });
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
        console.log('Cloudinary upload successful:', imageUrl);
      } catch (cloudinaryErr) {
        console.error('Cloudinary upload error:', cloudinaryErr);
        // Fallback to local file path
        imageUrl = req.file.path;
        cloudinaryId = 'local_file';
      }
    } else if (req.file) {
      // Use local file path if Cloudinary not configured
      imageUrl = req.file.path;
      cloudinaryId = 'local_file';
      console.log('Using local file path:', imageUrl);
    } else {
      return res.status(400).json({
        error: 'Image is required',
      });
    }

    const bannerData = {
      title,
      subtitle,
      image: imageUrl,
      cloudinaryId: cloudinaryId,
      texts: texts ? JSON.parse(texts) : [],
      link,
      buttonText,
      order: order || 0,
    };

    console.log('Banner data to save:', bannerData);
    
    const banner = new Banner(bannerData);
    const data = await banner.save();
    console.log('Banner saved successfully:', data._id);
    res.json({ data });
  } catch (err) {
    console.error('Banner creation error:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.read = (req, res) => {
  return res.json(req.banner);
};

exports.update = async (req, res) => {
  try {
    const banner = req.banner;
    const { title, subtitle, texts, link, buttonText, order, isActive } = req.body;

    banner.title = title;
    banner.subtitle = subtitle;
    banner.texts = texts ? JSON.parse(texts) : banner.texts;
    banner.link = link;
    banner.buttonText = buttonText;
    banner.order = order || banner.order;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (banner.cloudinaryId) {
        await cloudinary.uploader.destroy(banner.cloudinaryId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'banners',
        resource_type: 'auto',
      });

      banner.image = result.secure_url;
      banner.cloudinaryId = result.public_id;
    }

    const data = await banner.save();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const banner = req.banner;

    // Delete image from Cloudinary
    if (banner.cloudinaryId) {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
    }

    await Banner.findByIdAndDelete(banner._id);
    res.json({
      message: 'Banner deleted successfully',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  try {
    console.log('Fetching all banners...');
    const data = await Banner.find()
      .sort({ order: 1, createdAt: -1 })
      .exec();
    console.log('Banners found:', data.length);
    res.json(data);
  } catch (err) {
    console.error('Error fetching banners:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.listActive = async (req, res) => {
  try {
    console.log('Fetching active banners...');
    const data = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
    console.log('Active banners found:', data.length);
    res.json(data);
  } catch (err) {
    console.error('Error fetching active banners:', err);
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};
