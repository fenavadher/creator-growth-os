const router = require('express').Router();
const ctrl = require('../controllers/ai');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/analyze', protect, upload.single('image'), ctrl.analyze);
router.post('/predict', protect, ctrl.predict);

module.exports = router;
