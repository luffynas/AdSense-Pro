import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import articleService from './articleService.js';
import http from 'http';
import https from 'https';
import { URL } from 'url';

puppeteer.use(StealthPlugin());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mengetes koneksi proxy
const testProxyConnection = async (proxy) => {
    return new Promise((resolve, reject) => {
      const [auth, proxyHost] = proxy.split('@');
      const [username, password] = auth.split(':');
      const proxyUrl = new URL(`http://${proxyHost}`);
      const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  
      const options = {
        hostname: proxyUrl.hostname,
        port: proxyUrl.port,
        path: 'https://patih.my.id',
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
          reject(new Error(`Proxy connection failed with status code: ${res.statusCode}`));
            // resolve(false); // Koneksi berhasil
        }
      });
  
      req.on('error', (err) => {
        reject(err);
      });
  
      req.end();
    });
};

const scrollPage = async (page) => {
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
      const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
      const scrollStep = () => {
        return random(200, 600); // Panjang scroll yang acak
      };
  
      const scrollInterval = () => {
        return random(500, 1500); // Waktu antar scroll yang acak (500ms - 1500ms)
      };
  
      const scrollBehavior = async () => {
        let totalHeight = 0;
        while (totalHeight < document.body.scrollHeight) {
          const distance = scrollStep();
          window.scrollBy(0, distance);
          totalHeight += distance;
  
          if (totalHeight >= document.body.scrollHeight) break;
  
          await delay(scrollInterval());
  
          // Sesekali berhenti lebih lama seolah-olah sedang membaca
          if (Math.random() > 0.9) {
            await delay(random(2000, 5000)); // Berhenti membaca selama 2-5 detik
          }
        }
      };
  
      const scrollBackUp = async () => {
        let totalHeight = document.body.scrollHeight;
        while (totalHeight > 0) {
          const distance = -scrollStep();
          window.scrollBy(0, distance);
          totalHeight += distance;
  
          if (totalHeight <= 0) break;
  
          await delay(scrollInterval());
  
          // Sesekali berhenti lebih lama seolah-olah sedang membaca
          if (Math.random() > 0.9) {
            await delay(random(2000, 5000)); // Berhenti membaca selama 2-5 detik
          }
        }
      };
  
      await scrollBehavior();
  
      // Keputusan untuk menggulir kembali ke atas (misalnya 50% kemungkinan)
      if (Math.random() > 0.5) {
        await scrollBackUp();
      }
    });
};

const startBrowser = async (proxy, fingerprint) => {
  try {
    // Test koneksi proxy terlebih dahulu
    const proxyIsValid = await testProxyConnection(proxy);
    console.log(`proxyIsValid ::: ${proxyIsValid}`);

    if (!proxyIsValid) {
      throw new Error('Proxy connection test failed. Trying the next proxy...');
        // return;
    }

    const randomUrl = articleService.getRandomUrl();

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        // `--proxy-server=${proxy}`,
        `--proxy-server=${proxy.split('@')[1]}`, 
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        `--user-agent=${fingerprint.userAgent}`,
        `--window-size=${fingerprint.viewport.width},${fingerprint.viewport.height}`,
        fingerprint.isMobile ? `--app=${randomUrl}` : '--start-maximized'
      ],
    });

    const pages = await browser.pages();
    const page = pages[0];

    // Autentikasi proxy jika diperlukan
    const [username, password] = proxy.split('@')[0].split(':');
    await page.authenticate({ username, password });

    if (page.url() === 'about:blank') {
      await page.goto(randomUrl, { waitUntil: 'load', timeout: 60000 });
    }

    await page.setViewport({
      width: fingerprint.viewport.width,
      height: fingerprint.viewport.height,
      deviceScaleFactor: fingerprint.viewport.deviceScaleFactor,
      isMobile: fingerprint.isMobile,
      hasTouch: fingerprint.hasTouch,
      isLandscape: fingerprint.isLandscape
    });

    await scrollPage(page);

    await delay(1800 + Math.random() * 1200); // Scroll selama 3-5 menit

    await browser.close();
  } catch (error) {
    console.error('Error launching browser with proxy:', proxy);
    console.error('Error details:', error);
    throw new Error('Failed to start browser with the specified proxy.');
  }
};

export default {
  startBrowser,
};
