const express = require('express');
const { createQr, getMyQrs, getQrById, updateQr, deleteQr, archiveQr, redirectDynamicQr, getQrAnalytics } = require('../controllers/qrController');
const router = express.Router();

router.get('/d/:shortCode', redirectDynamicQr);
router.post('/', createQr);
router.get('/', getMyQrs);
router.get('/:shortCode', (req, res, next) => {
  if (/^[a-f0-9]{24}$/i.test(req.params.shortCode)) {
    return next();
  }
  return redirectDynamicQr(req, res, next);
});
router.get('/:id', getQrById);
router.put('/:id', updateQr);
router.delete('/:id', deleteQr);
router.post('/:id/archive', archiveQr);
router.get('/:id/analytics', getQrAnalytics);

module.exports = router;
