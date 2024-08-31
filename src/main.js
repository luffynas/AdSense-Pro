import { initializeProxies, getTotalAvailableProxies, resetProxyUsage } from './services/proxyService.js';
import { initializeFingerprints, resetFingerprintUsage } from './services/fingerprintService.js';
import browserService from './services/browserService.js';
import { getAvailableProxyAndFingerprint } from './services/analyticsService.js';
import { flagProxyAsFail, deleteProxy } from './services/proxyService.js';

// const runAutomation = async () => {
//   const proxies = await proxyService.getProxies();
//   const fingerprints = await fingerprintService.getFingerprints();

//   const proxyLock = {}; // Menggunakan objek untuk melacak status penggunaan proxy
//   const proxyFailCount = {}; // Melacak jumlah kegagalan untuk setiap proxy
//   proxies.forEach(proxy => {
//     proxyLock[proxy] = false; // Awalnya, semua proxy tidak digunakan
//     proxyFailCount[proxy] = 0; // Inisialisasi hitungan kegagalan
//   });

//   let browserCount = 0;
//   const maxBrowsers = 20;
//   const maxProxyFails = 3; // Jumlah kegagalan maksimum sebelum proxy dilewati

//   const interval = setInterval(async () => {
//     if (browserCount >= maxBrowsers) {
//       clearInterval(interval);
//       console.log('Finished launching browsers.');
//       return;
//     }

//     for (let i = 0; i < proxies.length; i++) {
//         const proxy = proxies[i];
//         if (proxyLock[proxy] || proxyFailCount[proxy] >= maxProxyFails) {
//             // Jika proxy sedang digunakan atau telah gagal terlalu sering, lanjut ke proxy berikutnya
//             continue;
//           }
  
//         proxyLock[proxy] = true; // Tandai proxy sebagai "digunakan"
//         const fingerprint = fingerprints[browserCount % fingerprints.length];
  
//         try {
//           await browserService.startBrowser(proxy, fingerprint);
//           browserCount++;
//           break; // Jika berhasil, keluar dari loop
//         } catch (error) {
//           console.error('Proxy failed, trying next one...');
//           proxyFailCount[proxy] += 1;
//           proxyLock[proxy] = false; // Tandai proxy sebagai "tidak digunakan" jika gagal
//         }
//     }
//   }, 300000 + Math.random() * 300000); // Setiap 5-10 menit
// };

//Reset Data
await resetProxyUsage();
await resetFingerprintUsage();

//Initial Data
await initializeProxies();
await initializeFingerprints();

const runAutomation = async () => {
  const maxBrowsers = 20;
  const maxProxyFails = 3; // Jumlah kegagalan maksimum sebelum proxy dilewati

  const limit = 10;
  const totalAvailableProxies = getTotalAvailableProxies(limit);

  let browserCount = 0;
  let proxyFailCount = {};

  const effectiveMaxBrowsers = Math.min(maxBrowsers, totalAvailableProxies);

  if (effectiveMaxBrowsers === 0) {
    console.log('No available proxies. Exiting...');
    return;
  }

  const interval = setInterval(async () => {
    const { proxy, fingerprint } = await getAvailableProxyAndFingerprint();

    try {
      if (browserCount >= effectiveMaxBrowsers || !proxy) {
        clearInterval(interval);
        console.log('Finished launching browsers.');
        return;
      }

      await browserService.startBrowser(proxy, fingerprint); // Mulai browser dengan proxy dan fingerprint yang dipilih
      browserCount++;
    } catch (error) {
      console.error('Failed to start browser session:', error);

      // Melacak kegagalan proxy dan menanganinya
      if (!proxyFailCount[proxy]) {
        proxyFailCount[proxy] = 0;
      }

      proxyFailCount[proxy] += 1;

      if (proxyFailCount[proxy] >= maxProxyFails) {
        console.log(`Proxy ${proxy} has failed ${maxProxyFails} times. It will be flagged as fail or deleted.`);
        flagProxyAsFail(proxy); // Atau gunakan deleteProxy(proxy) jika ingin menghapusnya
      } else {
        console.log(`Retrying proxy ${proxy}. Failure count: ${proxyFailCount[proxy]}`);
      }
    }
  }, 3000 + Math.random() * 3000); // Setiap 5-10 menit
};


runAutomation();
