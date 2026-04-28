const Activity = require('../models/Activity');

exports.activity = async (_req, res, next) => {
  try {
    const items = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('user', 'name email');
    res.json({ items });
  } catch (err) {
    next(err);
  }
};
