const Post = require('../models/Post');
const Activity = require('../models/Activity');
const { extractHashtags, predictEngagement } = require('../utils/ai');

exports.create = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    if (!text && !image) return res.status(400).json({ error: 'Post needs text or an image' });

    const hashtags = extractHashtags(text);
    const prediction = predictEngagement({
      text,
      hasImage: !!image,
      followerCount: req.user.followers.length,
      hashtagCount: hashtags.length
    });

    const post = await Post.create({
      author: req.user._id,
      text,
      image,
      hashtags,
      predictedEngagement: prediction.level
    });
    await Activity.create({ user: req.user._id, type: 'post', meta: { postId: post._id } });

    const populated = await post.populate('author', 'name avatar');
    res.status(201).json({ post: populated, prediction });
  } catch (err) {
    next(err);
  }
};

exports.feed = async (req, res, next) => {
  try {
    const ids = [...req.user.following, req.user._id];
    const posts = await Post.find({ author: { $in: ids } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.explore = async (_req, res, next) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(60)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.byUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const idx = post.likes.findIndex((u) => String(u) === String(req.user._id));
    let liked;
    if (idx >= 0) {
      post.likes.splice(idx, 1);
      liked = false;
      await Activity.create({ user: req.user._id, type: 'unlike', meta: { postId: post._id } });
    } else {
      post.likes.push(req.user._id);
      liked = true;
      await Activity.create({ user: req.user._id, type: 'like', meta: { postId: post._id } });
    }
    await post.save();
    res.json({ liked, likes: post.likes.length });
  } catch (err) {
    next(err);
  }
};

exports.comment = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ error: 'Comment text required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ user: req.user._id, text });
    await post.save();
    await Activity.create({ user: req.user._id, type: 'comment', meta: { postId: post._id } });
    const populated = await post.populate('comments.user', 'name avatar');
    res.json({ comments: populated.comments });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (String(post.author) !== String(req.user._id)) return res.status(403).json({ error: 'Not your post' });
    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
