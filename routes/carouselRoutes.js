const express = require('express');
const router = express.Router();
const { getCarousels, createCarousel, updateCarousel, deleteCarousel } = require('../controllers/carouselController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getCarousels)
  .post(protect, admin, upload.single('image'), createCarousel);

router.route('/:id')
  .put(protect, admin, upload.single('image'), updateCarousel)
  .delete(protect, admin, deleteCarousel);

module.exports = router;
