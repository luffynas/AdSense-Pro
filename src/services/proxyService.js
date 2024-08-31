import http from 'http';
import https from 'https';
import { URL } from 'url';
import loadProxies from '../config/proxyConfig.js';
import db from '../config/dbConfig.js';

export const initializeProxies = async () => {
  const proxies = loadProxies();
  if (!proxies.length) {
    throw new Error('No proxies available. Please check your proxy configuration.');
  }
  // return proxies;

  proxies.forEach(proxy => {
    addProxy(proxy);
  });
};

const addProxy = (proxy) => {
  db.prepare('INSERT OR IGNORE INTO proxies (proxy) VALUES (?)').run(proxy);
};

export const getAvailableProxy = () => {
  const availableProxy = db.prepare('SELECT * FROM proxies WHERE used = 0 LIMIT 1').get();
  if (!availableProxy) {
    // throw new Error('Tidak ada proxy yang tersedia.');
    return null;
  }
  // Tandai proxy sebagai digunakan
  db.prepare('UPDATE proxies SET used = 1 WHERE id = ?').run(availableProxy.id);
  return availableProxy.proxy;
};

export const getTotalAvailableProxies = (limit = null) => {
  let query = 'SELECT COUNT(*) as total FROM proxies WHERE used = 0 AND fail = 0';
  
  if (limit !== null) {
    query = `SELECT COUNT(*) as total FROM (SELECT * FROM proxies WHERE used = 0 AND fail = 0 LIMIT ${limit})`;
  }

  const result = db.prepare(query).get();
  return result.total;
};

export const flagProxyAsFail = (proxy) => {
  db.prepare('UPDATE proxies SET used = 1, fail = 1 WHERE proxy = ?').run(proxy);
};

export const deleteProxy = (proxy) => {
  db.prepare('DELETE FROM proxies WHERE proxy = ?').run(proxy);
};

export const markProxyAsFailed = (proxy) => {
  db.prepare('UPDATE proxies SET fail = fail + 1 WHERE proxy = ?').run(proxy);

  console.log(`Proxy ${proxy} has been marked as failed.`);
};

export const markProxyAsUsed = (proxy) => {
  db.prepare('UPDATE proxies SET used = 1 WHERE proxy = ?').run(proxy);

  console.log(`Proxy ${proxy} has been marked as used.`);
};

export const resetProxyUsage = async () => {
  db.prepare('UPDATE proxies SET used = 0, fail = 0').run();
};

// Fungsi untuk mengetes koneksi proxy
export const testProxyConnection = async (proxy) => {
  return new Promise((resolve, reject) => {
    let options;
    let proxyUrl;
    let authHeader;
    
    // Periksa apakah proxy memiliki autentikasi (jika ada '@')
    if (proxy.includes('@')) {
      const [auth, proxyHost] = proxy.split('@');
      const [username, password] = auth.split(':');
      proxyUrl = new URL(`http://${proxyHost}`);
      authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

      options = {
        hostname: proxyUrl.hostname,
        port: proxyUrl.port,
        path: 'https://www.google.com',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Proxy-Authorization': authHeader, // Sertakan autentikasi proxy
        },
        timeout: 5000, // Waktu timeout 5 detik
      };
    } else {
      proxyUrl = new URL(`http://${proxy}`);
      
      options = {
        hostname: proxyUrl.hostname,
        port: proxyUrl.port,
        path: 'https://www.google.com',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 5000, // Waktu timeout 5 detik
      };
    }

    const req = (proxyUrl.protocol === 'https:' ? https : http).request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true); // Koneksi berhasil
      } else {
        console.error(`Proxy connection failed with status code: ${res.statusCode} for proxy: ${proxy}`);
        reject(new Error(`Proxy connection failed with status code: ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.error(`Error during proxy connection test for proxy: ${proxy}`, err);
      reject(err);
    });

    req.end();
  });
};