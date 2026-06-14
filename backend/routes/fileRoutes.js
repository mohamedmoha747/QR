const express = require('express');
const multer = require('multer');
const { uploadLogo, downloadQrSvg } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), uploadLogo);
router.post('/download-svg', protect, downloadQrSvg);

module.exports = router;
