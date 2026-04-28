const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 500 }
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, default: '', maxlength: 2200 },
    image: { type: String, default: '' },
    hashtags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    predictedEngagement: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' }
  },
  { timestamps: true }
);

PostSchema.virtual('engagementRate').get(function () {
  const total = (this.likes?.length || 0) + (this.comments?.length || 0);
  return total;
});

PostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);
