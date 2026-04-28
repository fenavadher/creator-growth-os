const router = require('express').Router();
const ctrl = require('../controllers/users');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/me', protect, ctrl.getMe);
router.put('/me', protect, upload.single('avatar'), ctrl.updateMe);
router.get('/explore', protect, ctrl.explore);
router.get('/search', protect, ctrl.search);
router.get('/:id', protect, ctrl.getUser);
router.post('/:id/follow', protect, ctrl.toggleFollow);

module.exports = router;
