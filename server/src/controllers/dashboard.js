const Post = require('../models/Post');
const User = require('../models/User');

exports.summary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
    const followerCount = req.user.followers.length;
    const followingCount = req.user.following.length;

    const engagementRate = totalPosts === 0 || followerCount === 0
      ? 0
      : Math.round(((totalLikes + totalComments) / (totalPosts * Math.max(1, followerCount))) * 1000) / 10;

    const topPost = posts.slice().sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length))[0] || null;

    // weekly trend (last 7 days)
    const trend = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const dayPosts = posts.filter((p) => p.createdAt >= d && p.createdAt < next);
      return {
        date: d.toISOString().slice(0, 10),
        posts: dayPosts.length,
        engagement: dayPosts.reduce((s, p) => s + p.likes.length + p.comments.length, 0)
      };
    });

    const insights = [];
    if (totalPosts === 0) insights.push('Start with your first post — even a simple one. Consistency beats perfection.');
    if (totalPosts > 0 && totalPosts < 5) insights.push('Try posting 3x per week — momentum compounds quickly in the first month.');
    if (engagementRate < 1 && totalPosts >= 3) insights.push('Engagement rate is low. Add a question or CTA to your captions.');
    if (followerCount < 10) insights.push('Follow and engage with creators in your niche — most early follows come from being seen first.');
    if (topPost) {
      insights.push(`Your top post got ${topPost.likes.length + topPost.comments.length} interactions — try posting more like it.`);
    }
    if (insights.length === 0) insights.push('You\'re trending in the right direction. Keep going.');

    res.json({
      totals: { posts: totalPosts, likes: totalLikes, comments: totalComments, followers: followerCount, following: followingCount },
      engagementRate,
      topPost,
      trend,
      insights,
      posts: posts.map((p) => ({
        _id: p._id,
        text: p.text,
        image: p.image,
        likes: p.likes.length,
        comments: p.comments.length,
        engagement: p.likes.length + p.comments.length,
        createdAt: p.createdAt,
        predictedEngagement: p.predictedEngagement
      }))
    });
  } catch (err) {
    next(err);
  }
};
