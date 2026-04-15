const Result = require('../models/Result');
const Question = require('../models/Question');

const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers } = req.body;
    // answers is an array of { questionId, selectedOption }

    // Fetch all questions for this assessment
    const questions = await Question.find({ assessment: assessmentId });
    
    let score = 0;
    const processedAnswers = [];
    const weakTopics = new Set();
    const strongTopics = new Set();
    
    for (const ans of answers) {
      const q = questions.find(question => question._id.toString() === ans.questionId);
      if (!q) continue;

      const isCorrect = q.correctAnswer === ans.selectedOption;
      if (isCorrect) {
        score++;
        strongTopics.add(q.topic);
      } else {
        weakTopics.add(q.topic);
      }

      processedAnswers.push({
        question: q._id,
        selectedOption: ans.selectedOption,
        isCorrect
      });
    }

    // AI Performance Analysis Heuristic
    // Filter out weakTopics that are also in strongTopics (mixed performance)
    const pureWeakTopics = [...weakTopics].filter(t => !strongTopics.has(t));
    const pureStrongTopics = [...strongTopics].filter(t => !weakTopics.has(t));
    const mixedTopics = [...weakTopics].filter(t => strongTopics.has(t));

    let suggestions = "Great job on completing the assessment.";
    if (pureWeakTopics.length > 0) {
      suggestions += ` Focus more on ${pureWeakTopics.join(' and ')}.`;
    }
    if (mixedTopics.length > 0) {
      suggestions += ` You have basic understanding but need more practice in ${mixedTopics.join(', ')}.`;
    }

    const result = await Result.create({
      student: req.user._id,
      assessment: assessmentId,
      score,
      totalQuestions: questions.length,
      answers: processedAnswers,
      feedback: {
        strongTopics: pureStrongTopics,
        weakTopics: [...pureWeakTopics, ...mixedTopics],
        suggestions
      }
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResults = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      filter = { student: req.user._id };
    }
    const results = await Result.find(filter)
      .populate('student', 'name email')
      .populate('assessment', 'title');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAssessment, getResults };
