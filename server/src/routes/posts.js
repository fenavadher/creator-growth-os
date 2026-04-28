const router = require('express').Router();
const ctrl = require('../controllers/posts');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/feed', protect, ctrl.feed);
router.get('/explore', protect, ctrl.explore);
router.get('/user/:id', protect, ctrl.byUser);
router.post('/', protect, upload.single('image'), ctrl.create);
router.post('/:id/like', protect, ctrl.toggleLike);
router.post('/:id/comment', protect, ctrl.comment);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
