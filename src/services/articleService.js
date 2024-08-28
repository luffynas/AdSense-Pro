import loadArticleUrls from '../config/articleConfig.js';

const getRandomUrl = () => {
  const urls = loadArticleUrls();
  if (!urls.length) {
    throw new Error('No article URLs available. Please check your article configuration.');
  }
  return urls[Math.floor(Math.random() * urls.length)];
};

export default {
  getRandomUrl
};
