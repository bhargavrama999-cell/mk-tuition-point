const Query = require('../models/Query');

const submitQuery = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question text is required' });
    }

    const queryInfo = await Query.create({
      student: req.user._id,
      question
    });

    res.status(201).json(queryInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQueries = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      filter = { student: req.user._id };
    }
    const queries = await Query.find(filter).populate('student', 'name');
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const replyQuery = async (req, res) => {
  try {
    const { reply } = req.body;
    const queryInfo = await Query.findById(req.params.id);

    if (queryInfo) {
      queryInfo.reply = reply;
      queryInfo.status = 'Replied';
      await queryInfo.save();
      res.json(queryInfo);
    } else {
      res.status(404).json({ message: 'Query not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitQuery, getQueries, replyQuery };
