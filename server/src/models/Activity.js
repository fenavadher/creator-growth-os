const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: {
      type: String,
      enum: ['signup', 'login', 'post', 'like', 'unlike', 'comment', 'follow', 'unfollow', 'profile_update'],
      required: true
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
