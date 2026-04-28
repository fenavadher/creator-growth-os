const router = require('express').Router();
const ctrl = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.me);

module.exports = router;
