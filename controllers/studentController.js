const User = require('../models/User');
const Category = require('../models/Category');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');

// Category Management
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryExists = await Category.findOne({ name });
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student Management
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).populate('category', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { name, email, password, categoryId } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Student',
      category: categoryId,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadStudentsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const salt = await bcrypt.genSalt(10);
          
          for (let row of results) {
            // Assume CSV has name, email, password, categoryName
            const { name, email, password, categoryName } = row;
            if (!name || !email || !password) continue;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) continue;
            
            let categoryId = null;
            if (categoryName) {
              const category = await Category.findOne({ name: categoryName });
              if (category) categoryId = category._id;
            }

            const hashedPassword = await bcrypt.hash(password, salt);
            
            await User.create({
              name,
              email,
              password: hashedPassword,
              role: 'Student',
              category: categoryId
            });
          }
          
          res.status(200).json({ message: 'Students imported successfully' });
        } catch (err) {
          res.status(500).json({ message: err.message });
        } finally {
          // Clean up the uploaded file
          fs.unlinkSync(req.file.path);
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory, getCategories, getStudents, addStudent, uploadStudentsCSV };
