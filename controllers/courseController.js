const Course = require('../models/Course');

const getCourses = async (req, res) => {
  try {
    // Both students and admin can view courses
    const courses = await Course.find({}).populate('category', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let pdfFile = '';

    if (req.file) {
      pdfFile = req.file.path.replace(/\\/g, '/');
    }

    if (!title || !pdfFile) {
      return res.status(400).json({ message: 'Title and PDF file are required' });
    }

    const course = await Course.create({
      title,
      description,
      pdfFile,
      category,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, addCourse };
