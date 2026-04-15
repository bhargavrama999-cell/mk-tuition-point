const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const setupUploadDirs = () => {
  const dirs = ['uploads/images', 'uploads/csv', 'uploads/pdf'];
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

setupUploadDirs();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, 'uploads/csv/');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdf/');
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|csv/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Invalid file type!');
    }
  },
});

module.exports = upload;
