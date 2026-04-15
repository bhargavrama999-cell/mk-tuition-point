const express = require('express');
const router = express.Router();
const { getCourses, addCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, upload.single('pdf'), addCourse);

module.exports = router;
