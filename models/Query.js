const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Replied'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);
