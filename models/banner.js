const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    image: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    texts: [{
      text: {
        type: String,
        required: true,
        maxlength: 150,
      },
      color: {
        type: String,
        default: '#ffffff',
      },
      fontSize: {
        type: String,
        default: '24px',
      },
      fontWeight: {
        type: String,
        default: 'bold',
      },
      position: {
        x: {
          type: Number,
          default: 50,
        },
        y: {
          type: Number,
          default: 50,
        }
      }
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);


