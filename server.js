const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes Configuration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/carousel', require('./routes/carouselRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));

app.get('/', (req, res) => {
  res.send('MK Tuition Points API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
