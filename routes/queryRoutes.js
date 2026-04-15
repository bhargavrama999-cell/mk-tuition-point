const express = require('express');
const router = express.Router();
const { submitQuery, getQueries, replyQuery } = require('../controllers/queryController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getQueries)
  .post(protect, submitQuery);

router.route('/:id/reply')
  .post(protect, admin, replyQuery);

module.exports = router;
