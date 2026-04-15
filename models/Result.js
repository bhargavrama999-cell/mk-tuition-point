const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
    feedback: {
      strongTopics: [{ type: String }],
      weakTopics: [{ type: String }],
      suggestions: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
