const router = require('express').Router();
const ctrl = require('../controllers/dashboard');
const { protect } = require('../middlewares/auth');

router.get('/', protect, ctrl.summary);

module.exports = router;
