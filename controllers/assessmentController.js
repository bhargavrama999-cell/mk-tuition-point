const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const fs = require('fs');
const xlsx = require('xlsx');

// Assessment CRUD
const getAssessments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Student') {
      const now = new Date();
      filter = {
        active: true,
        blocked: { $ne: true },
        category: req.user.category,
        $or: [
          { startDate: { $exists: false } },
          { startDate: null },
          { startDate: { $lte: now } }
        ]
      };
    }
    const assessments = await Assessment.find(filter).populate('category', 'name');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAssessment = async (req, res) => {
  try {
    const { title, description, duration, category, active, startDate, endDate } = req.body;
    const assessment = await Assessment.create({
      title, description, duration, category, active,
      startDate: startDate || null,
      endDate: endDate || null,
    });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const { title, description, duration, category, active, blocked, startDate, endDate } = req.body;
    if (title !== undefined) assessment.title = title;
    if (description !== undefined) assessment.description = description;
    if (duration !== undefined) assessment.duration = duration;
    if (category !== undefined) assessment.category = category;
    if (active !== undefined) assessment.active = active;
    if (blocked !== undefined) assessment.blocked = blocked;
    if (startDate !== undefined) assessment.startDate = startDate;
    if (endDate !== undefined) assessment.endDate = endDate;

    const updated = await assessment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    
    // Also delete associated questions
    await Question.deleteMany({ assessment: req.params.id });
    await Assessment.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Assessment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBlockAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    assessment.blocked = !assessment.blocked;
    const updated = await assessment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Question CRUD
const addQuestion = async (req, res) => {
  try {
    const { assessment, questionText, topic, options, correctAnswer } = req.body;
    let derivedTopic = topic || 'General';

    const question = await Question.create({
      assessment,
      questionText,
      topic: derivedTopic,
      options,
      correctAnswer
    });
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk Upload Questions via CSV or Excel
const bulkUploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV or Excel file' });
    }

    const assessmentId = req.params.assessmentId;

    try {
      // Use xlsx to read both CSV and Excel files
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const results = xlsx.utils.sheet_to_json(worksheet);

      let added = 0;
      for (const row of results) {
        // Excel columns matched to object keys based on the header row
        const { questionText, optionA, optionB, optionC, optionD, correctAnswer, topic } = row;
        if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) continue;

        await Question.create({
          assessment: assessmentId,
          questionText: String(questionText),
          topic: topic ? String(topic) : 'General',
          options: { 
            A: String(optionA), 
            B: String(optionB), 
            C: String(optionC), 
            D: String(optionD) 
          },
          correctAnswer: String(correctAnswer).toUpperCase().trim(),
        });
        added++;
      }

      res.status(200).json({ message: `${added} questions uploaded successfully` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    } finally {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssessmentQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ assessment: req.params.assessmentId });
    if (req.user.role === 'Student') {
      const sanitized = questions.map(q => {
        const { correctAnswer, ...rest } = q.toObject();
        return rest;
      });
      return res.json(sanitized);
    }
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssessments, createAssessment, updateAssessment, deleteAssessment, toggleBlockAssessment, addQuestion, bulkUploadQuestions, getAssessmentQuestions };
