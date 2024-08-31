import loadRefererUrls from '../config/refererConfig.js';

const getRandomReferer = () => {
  const referers = loadRefererUrls();
  if (!referers.length) {
    return null;
  }
  return referers[Math.floor(Math.random() * referers.length)];
};

export default {
  getRandomReferer
};
