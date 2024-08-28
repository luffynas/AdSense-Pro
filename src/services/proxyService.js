import http from 'http';
import https from 'https';
import { URL } from 'url';
import loadProxies from '../config/proxyConfig.js';

const getProxies = async () => {
  const proxies = loadProxies();
  if (!proxies.length) {
    throw new Error('No proxies available. Please check your proxy configuration.');
  }
  return proxies;
};

// Fungsi untuk mengetes koneksi proxy
export const testProxyConnection = async (proxy) => {
    return new Promise((resolve, reject) => {
      const [auth, proxyHost] = proxy.split('@');
      const [username, password] = auth.split(':');
      const proxyUrl = new URL(`http://${proxyHost}`);
      const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  
      const options = {
        hostname: proxyUrl.hostname,
        port: proxyUrl.port,
        path: 'https://www.example.com',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Proxy-Authorization': authHeader, // Sertakan autentikasi proxy
        },
        timeout: 5000, // Waktu timeout 5 detik
      };
  
      const req = (proxyUrl.protocol === 'https:' ? https : http).request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true); // Koneksi berhasil
        } else {
        //   reject(new Error(`Proxy connection failed with status code: ${res.statusCode}`));
            resolve(false); // Koneksi berhasil
        }
      });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.end();
    });
};

export default {
  getProxies
};
