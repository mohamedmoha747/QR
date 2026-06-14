const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createQr, getMyQrs, getQrById, updateQr, deleteQr, archiveQr, redirectDynamicQr, getQrAnalytics } = require('../controllers/qrController');
const router = express.Router();

router.get('/d/:shortCode', redirectDynamicQr);
router.post('/', protect, createQr);
router.get('/', protect, getMyQrs);
router.get('/:shortCode', (req, res, next) => {
  if (/^[a-f0-9]{24}$/i.test(req.params.shortCode)) {
    return next();
  }
  return redirectDynamicQr(req, res, next);
});
router.get('/:id', protect, getQrById);
router.put('/:id', protect, updateQr);
router.delete('/:id', protect, deleteQr);
router.post('/:id/archive', protect, archiveQr);
router.get('/:id/analytics', protect, getQrAnalytics);

module.exports = router;
