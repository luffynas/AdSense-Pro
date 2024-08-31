import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import articleService from './articleService.js';
import {markProxyAsFailed, markProxyAsUsed, testProxyConnection} from './proxyService.js';
import getRandomBehavior from './behaviorService.js'; 
import refererService from './refererService.js';
import { getAnalytics, incrementVisitCount, incrementClickCount } from './analyticsService.js';

puppeteer.use(StealthPlugin());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const startBrowser = async (proxy, fingerprint) => {
  let browser;

  try {
    // Test koneksi proxy terlebih dahulu
    const proxyIsValid = await testProxyConnection(proxy);
    console.log(`proxyIsValid ::: ${proxyIsValid}`);

    if (!proxyIsValid) {
      throw new Error('Proxy connection test failed. Trying the next proxy...');
        // return;
    }

    // Periksa apakah proxy menggunakan autentikasi
    let proxyServer;
    let username, password;

    if (proxy.includes('@')) {
      // Proxy dengan autentikasi
      [username, password] = proxy.split('@')[0].split(':');
      proxyServer = proxy.split('@')[1];
    } else {
      // Proxy tanpa autentikasi
      proxyServer = proxy;
    }

    let retries = 3;
    while (retries > 0) {
      try {
        browser = await puppeteer.launch({
          headless: false,
          args: [
            // `--proxy-server=${proxy}`,
            // `--proxy-server=${proxy.split('@')[1]}`, 
            `--proxy-server=${proxyServer}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            `--user-agent=${fingerprint.userAgent}`,
            `--window-size=${fingerprint.viewport.width},${fingerprint.viewport.height}`,
            fingerprint.isMobile ? '--app=' : '--start-maximized'
          ],
          protocolTimeout: 120000, // Timeout untuk operasi protokol diatur ke 120 detik
          timeout: 60000, // Timeout untuk meluncurkan browser diatur ke 60 detik
        });
    
        const pages = await browser.pages();
        const page = pages[0];
    
        // Autentikasi proxy jika diperlukan
        if (username && password) {
          await page.authenticate({ username, password });
        }
    
        const referer = refererService.getRandomReferer();
        const randomUrl = articleService.getRandomUrl();
        let randomUrlReferer = randomUrl;
        let newUrl = randomUrl;
    
        const options = {
          waitUntil: 'load',
          timeout: 60000,
        };
    
        // Tambahkan referer hanya jika ada
        if (referer) {
          options.referer = referer;
        }
    
        let totalArticlesToRead = getRandomInt(3, 7);
    
        for (let i = 0; i < totalArticlesToRead; i++) {
          if (page.url() === 'about:blank') {
            await page.goto(randomUrl, options);
          } else {
            await page.goto(newUrl, { ...options, referer: randomUrlReferer });
          }
    
          await page.setViewport({
            width: fingerprint.viewport.width,
            height: fingerprint.viewport.height,
            deviceScaleFactor: fingerprint.viewport.deviceScaleFactor,
            isMobile: fingerprint.isMobile,
            hasTouch: fingerprint.hasTouch,
            isLandscape: fingerprint.isLandscape
          });
    
          // Scroll behavior
          // const randomBehavior = getRandomBehavior();
          // await randomBehavior(page);
    
          // Scroll kembali ke atas
          // await page.evaluate(async () => {
          //   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
          //   const scrollStep = 100;
          //   let totalHeight = document.body.scrollHeight;
    
          //   while (totalHeight > 0) {
          //     window.scrollBy(0, -scrollStep);
          //     totalHeight -= scrollStep;
          //     await delay(500 + Math.random() * 1000);
          //   }
          // });
    
          await incrementVisitCount(); // Increment visit count
    
          const { total_visits, total_clicks } = await getAnalytics();
    
          // Kalkulasi apakah klik iklan akan dilakukan berdasarkan rasio 15%
          const clickAd = (total_clicks / total_visits) < 0.15;
    
          if (clickAd) {
            // const ad = await page.$('ins.adsbygoogle');
            // if (ad) {
            //   await ad.click();
            //   await delay(5000 + Math.random() * 5000); // Tunggu setelah klik iklan
    
            //   // Klik link pertama setelah iklan
            //   const link = await page.$('a');
            //   if (link) {
            //     await link.click();
            //     await incrementClickCount(); // Increment click count
            //   }
            // }

            // // Tunggu sampai elemen iklan AFS muncul di halaman
            // await page.waitForSelector('#google-anno-sa, .google-anno-t');

            // console.log('Selektor ditemukan, memulai evaluasi...');
            // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

            // // Klik iklan AFS
            // const result = await page.evaluate(() => {
            //   const adElementSa = document.querySelector('#google-anno-sa');
            //   const adElementT = document.querySelector('.google-anno-t');
              
            //   if (adElementSa) {
            //     console.log('Elemen #google-anno-sa ditemukan dan diklik');
            //     adElementSa.click();
            //   } else if (adElementT) {
            //     console.log('Elemen .google-anno-t ditemukan dan diklik');
            //     adElementT.click();
            //   } else {
            //     console.log('Tidak ada elemen yang ditemukan untuk diklik.');
            //   }
            // });

            // console.log(`jgjgjhjh : ${result}`);

            // console.log('Evaluasi selesai.');

            // // Tunggu hingga drawer muncul
            // await page.waitForSelector('#hd-drawer');

            // // Dapatkan dokumen dari iframe
            // const iframeElement = await page.$('#hd-drawer iframe');
            // const iframe = await iframeElement.contentFrame();

            // // Tunggu elemen iklan di dalam iframe
            // await iframe.waitForSelector('a[href*="googleadservices.com/pagead/aclk"]');

            // // Klik iklan
            // await iframe.evaluate(() => {
            //   const adLink = document.querySelector('a[href*="googleadservices.com/pagead/aclk"]');
            //   if (adLink) {
            //     adLink.click();
            //   }
            // });
          }

          let isBottom = false;
          let foundElement = false;

          // Scroll ke bawah hingga mencapai bagian paling bawah halaman
          while (!isBottom) {
            isBottom = await page.evaluate(() => {
              window.scrollBy(0, 100); // Scroll sedikit ke bawah
              return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
            });
            await delay(1000);
          }

          // Berhenti sejenak ketika mencapai bagian bawah
          console.log('Mencapai bagian bawah halaman. Berhenti sejenak...');
          await delay(2000);

          // Random apakah akan scroll ke atas, ke tengah, atau ke sepertiga halaman
          const scrollChoice = Math.floor(Math.random() * 3); // 0: atas, 1: tengah, 2: sepertiga

          let scrollToY;
          if (scrollChoice === 0) {
            scrollToY = 0; // Scroll ke atas
            console.log(`Scrolling kembali ke atas...${scrollToY}`);
          } else if (scrollChoice === 1) {
            scrollToY = document.body.scrollHeight / 2; // Scroll ke tengah
            console.log(`Scrolling ke tengah halaman...${scrollToY}`);
          } else {
            scrollToY = document.body.scrollHeight / 3; // Scroll ke sepertiga halaman
            console.log(`Scrolling ke sepertiga halaman... ${scrollToY}`);
          }

          await page.evaluate((scrollToY) => {
            window.scrollTo(0, scrollToY); // Scroll ke posisi yang ditentukan
          }, scrollToY);

          await delay(1000);

          // Cari elemen dengan kelas .google-anno-t dan klik jika ditemukan
          while (!foundElement) {
            foundElement = await page.evaluate(() => {
              const element = document.querySelector('.google-anno-t');
              if (element) {
                element.scrollIntoView(); // Bawa elemen ke dalam pandangan
                return true;
              }
              return false;
            });
            if (!foundElement) {
              console.log('Tidak ada elemen yang ditemukan, mencoba kembali...');
              // await page.waitForTimeout(1000); // Berhenti sejenak sebelum mencoba lagi
              await delay(1000);
            }
          }

          console.log('Elemen ditemukan, mengeksekusi klik...');

          const result = await page.evaluate(() => {
            const adElementSa = document.querySelector('#google-anno-sa');
            const adElementT = document.querySelector('.google-anno-t');
            
            if (adElementT) {
              adElementT.click();
              return 'Elemen .google-anno-t ditemukan dan diklik';
            } else if (adElementSa) {
              adElementSa.click();
              return 'Elemen #google-anno-sa ditemukan dan diklik';
            } else {
              return 'Tidak ada elemen yang ditemukan untuk diklik.';
            }
          });

          console.log(`Hasil evaluasi: ${result}`);

          await delay(5000);
          // await page.waitForTimeout(5000);
    
          console.log(`Total Visits: ${total_visits}, Total Clicks: ${total_clicks}`);
    
          // Berpindah ke artikel berikutnya jika masih ada
          if (i < totalArticlesToRead - 1) {
            await delay(10000 + Math.random() * 5000); // Jeda sebelum membuka artikel berikutnya
            randomUrlReferer = newUrl;
            newUrl = articleService.getRandomUrl();
          }
        }
    
        await browser.close();
        markProxyAsUsed(proxy);
        break;
      } catch (error) {
        console.error(`Failed to launch browser, retrying... (${retries})`, error);
        if (browser) {
          await browser.close();
        }
        retries--;
        if (retries === 0) {
          console.error('All retries failed.');
          markProxyAsFailed(proxy);
        }
      }
    }
  } catch (error) {
    console.error('Error launching browser with proxy:', proxy);
    console.error('Error details:', error);
    if (browser) {
      await browser.close(); // Pastikan browser ditutup hanya jika telah berhasil diluncurkan
    }
    markProxyAsFailed(proxy);
    throw new Error('Failed to start browser with the specified proxy.');
  }
};

export default {
  startBrowser,
};
