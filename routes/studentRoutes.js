const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getStudents, addStudent, uploadStudentsCSV } = require('../controllers/studentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Categories
router.route('/categories')
  .get(protect, getCategories)
  .post(protect, admin, createCategory);

// Students
router.route('/')
  .get(protect, admin, getStudents)
  .post(protect, admin, addStudent);

router.post('/upload-csv', protect, admin, upload.single('file'), uploadStudentsCSV);

module.exports = router;
