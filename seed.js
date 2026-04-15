const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Load Models
const User = require('./models/User');
const Category = require('./models/Category');

const seedDatabase = async () => {
  try {
    // Attempt connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing Admins so we prevent duplicates on multiple runs
    await User.deleteMany({ role: 'Admin' });

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@mktuition.com',
      password: hashedAdminPassword,
      role: 'Admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@mktuition.com | Password: admin123');

    // Make some dummy categories and a dummy student just to fill the dashboard
    const existingCats = await Category.countDocuments();
    if (existingCats === 0) {
      const cat1 = await Category.create({ name: 'Class 10', description: 'Curriculum for Class 10' });
      const cat2 = await Category.create({ name: 'Class 12', description: 'Curriculum for Class 12' });

      // Create a dummy student
      const hashedStudentPassword = await bcrypt.hash('student123', salt);
      await User.create({
        name: 'Demo Student',
        email: 'student@mktuition.com',
        password: hashedStudentPassword,
        role: 'Student',
        category: cat1._id,
      });

      console.log('✅ Test Categories and Demo Student created successfully!');
      console.log('Email: student@mktuition.com | Password: student123');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Data destruction failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
