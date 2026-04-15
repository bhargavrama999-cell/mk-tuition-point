const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true, // Path to the uploaded image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Carousel', carouselSchema);
