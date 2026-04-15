const express = require('express');
const router = express.Router();
const { submitAssessment, getResults } = require('../controllers/resultController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getResults)
  .post(protect, submitAssessment);

module.exports = router;
