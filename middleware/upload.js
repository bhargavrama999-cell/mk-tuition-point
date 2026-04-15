const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Use Vercel's writable temporary directory (/tmp) instead of local 'uploads' folder
const tmpDir = os.tmpdir();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Write all uploaded files to OS temp directory which is writable on Vercel
    cb(null, tmpDir);
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|csv|xlsx|xls/;
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
