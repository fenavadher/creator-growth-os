const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getMe = async (req, res) => {
  res.json({ user: req.user.toPublic() });
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    if (typeof name === 'string') req.user.name = name;
    if (typeof bio === 'string') req.user.bio = bio;
    if (req.file) req.user.avatar = `/uploads/${req.file.filename}`;
    await req.user.save();
    await Activity.create({ user: req.user._id, type: 'profile_update' });
    res.json({ user: req.user.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name avatar').populate('following', 'name avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.toggleFollow = async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) return res.status(400).json({ error: 'You cannot follow yourself' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const me = req.user;
    const isFollowing = me.following.some((id) => String(id) === String(target._id));
    if (isFollowing) {
      me.following = me.following.filter((id) => String(id) !== String(target._id));
      target.followers = target.followers.filter((id) => String(id) !== String(me._id));
      await Activity.create({ user: me._id, type: 'unfollow', meta: { target: target._id } });
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
      await Activity.create({ user: me._id, type: 'follow', meta: { target: target._id } });
    }
    await me.save();
    await target.save();
    res.json({ following: !isFollowing, target: target.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.explore = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('name bio avatar followers');
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });
    const users = await User.find({ name: { $regex: q, $options: 'i' } })
      .limit(20)
      .select('name bio avatar');
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
