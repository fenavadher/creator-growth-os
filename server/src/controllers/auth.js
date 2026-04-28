const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

function sign(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const isFirstUser = (await User.countDocuments({})) === 0;
    const user = await User.create({ name, email, password, isAdmin: isFirstUser });
    await Activity.create({ user: user._id, type: 'signup', meta: { email } });

    res.status(201).json({ token: sign(user), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    user.lastLoginAt = new Date();
    await user.save();
    await Activity.create({ user: user._id, type: 'login' });

    res.json({ token: sign(user), user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toPublic() });
};
