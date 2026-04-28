const {
  detectNiche,
  suggestCaptions,
  suggestHashtags,
  improvementTips,
  bestTimeToPost,
  predictEngagement,
  extractHashtags
} = require('../utils/ai');

exports.analyze = async (req, res) => {
  const text = (req.body.text || '').trim();
  const hasImage = !!req.file || !!req.body.hasImage;
  const niche = detectNiche(text);
  const captions = suggestCaptions(text, niche);
  const hashtags = suggestHashtags(niche);
  const tips = improvementTips({ text, hasImage });
  const bestTime = bestTimeToPost();

  res.json({
    niche,
    captions,
    hashtags,
    tips,
    bestTime,
    image: req.file ? `/uploads/${req.file.filename}` : null
  });
};

exports.predict = async (req, res) => {
  const text = (req.body.text || '').trim();
  const hasImage = !!req.body.hasImage;
  const followerCount = Number(req.body.followerCount) || (req.user?.followers?.length || 0);
  const hashtagCount = extractHashtags(text).length;
  const result = predictEngagement({ text, hasImage, followerCount, hashtagCount });
  res.json(result);
};
