const router = require('express').Router();
const ctrl = require('../controllers/admin');
const { protect, adminOnly } = require('../middlewares/auth');

router.get('/activity', protect, adminOnly, ctrl.activity);

module.exports = router;
