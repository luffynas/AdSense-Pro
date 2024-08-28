import loadFingerprints from '../config/fingerprintConfig.js';

const getFingerprints = async () => {
  const fingerprints = loadFingerprints();
  if (!fingerprints.length) {
    throw new Error('No fingerprints available. Please check your fingerprint configuration.');
  }
  return fingerprints;
};

export default {
  getFingerprints
};
