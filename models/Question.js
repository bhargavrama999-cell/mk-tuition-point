const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    topic: {
      type: String, // E.g., Algebra, Trigonometry - to be used for AI feedback
    },
    options: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true },
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
