import db from '../config/dbConfig.js';
import { getAvailableProxy } from './proxyService.js';
import { getAvailableFingerprint } from './fingerprintService.js';

export const getAnalytics = () => {
  return db.prepare('SELECT total_visits, total_clicks FROM analytics WHERE id = 1').get();
};

export const incrementVisitCount = async () => {
  db.prepare('UPDATE analytics SET total_visits = total_visits + 1 WHERE id = 1').run();
};

export const incrementClickCount = async () => {
  db.prepare('UPDATE analytics SET total_clicks = total_clicks + 1 WHERE id = 1').run();
};

export const getAvailableProxyAndFingerprint = async() => {
  const proxy = getAvailableProxy();
  const fingerprint = getAvailableFingerprint();
  return { proxy, fingerprint };
};
