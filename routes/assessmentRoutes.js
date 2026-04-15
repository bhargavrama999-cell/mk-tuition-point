const express = require('express');
const router = express.Router();
const { getAssessments, createAssessment, updateAssessment, deleteAssessment, toggleBlockAssessment, addQuestion, bulkUploadQuestions, getAssessmentQuestions } = require('../controllers/assessmentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getAssessments)
  .post(protect, admin, createAssessment);

router.route('/:id')
  .put(protect, admin, updateAssessment)
  .delete(protect, admin, deleteAssessment);

router.route('/:id/block')
  .put(protect, admin, toggleBlockAssessment);

router.route('/:assessmentId/questions')
  .get(protect, getAssessmentQuestions)
  .post(protect, admin, addQuestion);

router.route('/:assessmentId/questions/upload-csv')
  .post(protect, admin, upload.single('file'), bulkUploadQuestions);

module.exports = router;
