import proxyService from './services/proxyService.js';
import fingerprintService from './services/fingerprintService.js';
import browserService from './services/browserService.js';

const runAutomation = async () => {
  const proxies = await proxyService.getProxies();
  const fingerprints = await fingerprintService.getFingerprints();

  const proxyLock = {}; // Menggunakan objek untuk melacak status penggunaan proxy
  const proxyFailCount = {}; // Melacak jumlah kegagalan untuk setiap proxy
  proxies.forEach(proxy => {
    proxyLock[proxy] = false; // Awalnya, semua proxy tidak digunakan
    proxyFailCount[proxy] = 0; // Inisialisasi hitungan kegagalan
  });

  let browserCount = 0;
  const maxBrowsers = 20;
  const maxProxyFails = 3; // Jumlah kegagalan maksimum sebelum proxy dilewati

  const interval = setInterval(async () => {
    if (browserCount >= maxBrowsers) {
      clearInterval(interval);
      console.log('Finished launching browsers.');
      return;
    }

    // const proxy = proxies[browserCount % proxies.length];
    // const fingerprint = fingerprints[browserCount % fingerprints.length];

    // await browserService.startBrowser(proxy, fingerprint);

    // browserCount++;

    for (let i = 0; i < proxies.length; i++) {
        const proxy = proxies[i];
        if (proxyLock[proxy] || proxyFailCount[proxy] >= maxProxyFails) {
            // Jika proxy sedang digunakan atau telah gagal terlalu sering, lanjut ke proxy berikutnya
            continue;
          }
  
        proxyLock[proxy] = true; // Tandai proxy sebagai "digunakan"
        const fingerprint = fingerprints[browserCount % fingerprints.length];
  
        try {
          await browserService.startBrowser(proxy, fingerprint);
          browserCount++;
          break; // Jika berhasil, keluar dari loop
        } catch (error) {
          console.error('Proxy failed, trying next one...');
          proxyFailCount[proxy] += 1;
          proxyLock[proxy] = false; // Tandai proxy sebagai "tidak digunakan" jika gagal
        }
    }
  }, 3000 + Math.random() * 3000); // Setiap 5-10 menit
};

runAutomation();
