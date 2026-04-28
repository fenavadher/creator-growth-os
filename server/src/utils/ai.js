// Smart on-device "AI" — heuristic engine. Fast, free, and surprisingly useful.
// Swap with an OpenAI / Gemini call if you want LLM-grade results.

const NICHE_HASHTAGS = {
  food: ['#foodie', '#homecooking', '#eeeeeats', '#foodphotography', '#yum'],
  travel: ['#travelgram', '#wanderlust', '#exploremore', '#passportready', '#offthebeatenpath'],
  fitness: ['#fitfam', '#workoutmotivation', '#strongnotskinny', '#dailygrind', '#gymlife'],
  fashion: ['#ootd', '#styleinspo', '#streetstyle', '#wiwt', '#fashiondiaries'],
  tech: ['#buildinpublic', '#devlife', '#startup', '#productdesign', '#shipit'],
  art: ['#artistsoninstagram', '#sketchbook', '#wipart', '#dailyart', '#illustration'],
  business: ['#entrepreneur', '#growthmindset', '#smallbiz', '#founderlife', '#sidehustle'],
  default: ['#creator', '#contentcreator', '#dailypost', '#growth', '#community']
};

const BROAD_HASHTAGS = ['#instagood', '#explore', '#viral', '#trending', '#mood'];

function detectNiche(text = '') {
  const t = text.toLowerCase();
  if (/(food|recipe|eat|coffee|brunch|pizza|cook)/.test(t)) return 'food';
  if (/(travel|trip|flight|beach|city|hotel)/.test(t)) return 'travel';
  if (/(gym|workout|run|lift|fitness|protein)/.test(t)) return 'fitness';
  if (/(outfit|fashion|style|wear|fit)/.test(t)) return 'fashion';
  if (/(code|dev|build|launch|startup|product|ai|app)/.test(t)) return 'tech';
  if (/(art|draw|paint|sketch|design)/.test(t)) return 'art';
  if (/(business|founder|hustle|sales|marketing)/.test(t)) return 'business';
  return 'default';
}

function suggestCaptions(text = '', niche) {
  const seed = (text || '').trim();
  const themes = {
    food: 'a plate that earned its photo',
    travel: 'a place you want to come back to',
    fitness: 'one more rep, one more day',
    fashion: 'fit check before the world sees it',
    tech: 'shipping > waiting',
    art: 'a small idea that wouldn\'t leave me alone',
    business: 'progress beats perfection',
    default: 'a moment worth keeping'
  };
  const t = seed || themes[niche] || themes.default;
  return [
    `${capitalize(t)}. What do you think?`,
    `POV: ${t.toLowerCase()} — and you were there for it.`,
    `Three words: ${t.split(' ').slice(0, 3).join(' ')}. Save this for later.`,
    `Nobody asked, but ${t.toLowerCase()} — and I had to share.`,
    `${capitalize(t)}.\n\nDouble tap if this hits. Comment with your take.`
  ];
}

function suggestHashtags(niche) {
  const n = NICHE_HASHTAGS[niche] || NICHE_HASHTAGS.default;
  return [...n, ...BROAD_HASHTAGS].slice(0, 10);
}

function improvementTips({ text = '', hasImage = false }) {
  const tips = [];
  const len = text.trim().length;
  if (len < 30) tips.push('Caption is short. Add a hook line — a question, a bold claim, or a surprising stat.');
  if (len > 600) tips.push('Caption is long. Front-load the most interesting line so people don\'t scroll past.');
  if (!/[?!]/.test(text)) tips.push('Add a question or exclamation — posts that invite a reply get more comments.');
  if (!/(comment|share|save|tag|tell me|what do you|drop)/i.test(text)) tips.push('No CTA detected. End with a small ask: "comment your take", "save for later", "tag a friend".');
  if (!hasImage) tips.push('No image. Visual posts consistently outperform text-only on most feeds.');
  if (!/#/.test(text)) tips.push('No hashtags in the caption — even 3-5 niche hashtags can lift discovery.');
  if (tips.length === 0) tips.push('Strong post. Consider posting at peak audience time for maximum reach.');
  return tips;
}

function bestTimeToPost() {
  // Generic heuristic — high-engagement windows on most platforms.
  const slots = [
    'Tue 11:00 AM',
    'Wed 7:30 PM',
    'Thu 12:30 PM',
    'Fri 6:00 PM',
    'Sun 10:00 AM'
  ];
  return slots[Math.floor(Math.random() * slots.length)];
}

function predictEngagement({ text = '', hasImage = false, followerCount = 0, hashtagCount = 0 }) {
  let score = 0;
  if (hasImage) score += 30;
  const len = text.trim().length;
  if (len >= 80 && len <= 300) score += 20;
  else if (len > 0) score += 8;
  if (/[?!]/.test(text)) score += 10;
  if (/(comment|share|save|tag|drop|tell me)/i.test(text)) score += 12;
  if (hashtagCount >= 3 && hashtagCount <= 10) score += 12;
  else if (hashtagCount > 10) score += 4;
  score += Math.min(20, Math.log10(followerCount + 1) * 6);

  let level = 'Low';
  if (score >= 65) level = 'High';
  else if (score >= 40) level = 'Medium';

  const reasons = [];
  if (hasImage) reasons.push('Has a strong visual.');
  else reasons.push('No image — add one to boost reach.');
  if (len < 30) reasons.push('Caption is too short to drive comments.');
  if (len > 600) reasons.push('Caption is long — trim to keep attention.');
  if (!/[?!]/.test(text)) reasons.push('No question or hook line.');
  if (hashtagCount === 0) reasons.push('No hashtags — discovery will be limited.');
  if (hashtagCount > 12) reasons.push('Too many hashtags — feels spammy.');

  const suggestions = improvementTips({ text, hasImage });

  return { score: Math.round(score), level, reasons, suggestions };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function extractHashtags(text = '') {
  return (text.match(/#[\w]+/g) || []).map((s) => s.toLowerCase());
}

module.exports = {
  detectNiche,
  suggestCaptions,
  suggestHashtags,
  improvementTips,
  bestTimeToPost,
  predictEngagement,
  extractHashtags
};
