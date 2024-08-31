import loadFingerprints from '../config/fingerprintConfig.js';
import db from '../config/dbConfig.js';

export const initializeFingerprints = async () => {
  const fingerprints = await loadFingerprints();
  if (!fingerprints.length) {
    throw new Error('No fingerprints available. Please check your fingerprint configuration.');
  }
  // return fingerprints;
  // fingerprints.forEach(fingerprint => {
  //   addFingerprint(fingerprint);
  // });
  await batchInsertFingerprints(fingerprints);
};

const addFingerprint = async (fingerprint) => {
  db.prepare(`
    INSERT INTO fingerprints (data) VALUES (?)
  `).run(JSON.stringify(fingerprint));
};

const batchInsertFingerprints = async (fingerprints) => {
  const batchSize = 10000; // Sesuaikan ukuran batch sesuai kebutuhan
  let batch = [];

  for (let i = 0; i < fingerprints.length; i++) {
    batch.push(fingerprints[i]);

    if (batch.length === batchSize || i === fingerprints.length - 1) {
      db.prepare(`
        INSERT INTO fingerprints (data) VALUES ${batch.map(() => '(?)').join(', ')}
      `).run(batch.map(fingerprint => JSON.stringify(fingerprint)));

      batch = []; // Kosongkan batch setelah dimasukkan ke database
    }
  }
};

export const getAvailableFingerprint = () => {
  const availableFingerprint = db.prepare('SELECT * FROM fingerprints WHERE used = 0 LIMIT 1').get();
  if (!availableFingerprint) {
    throw new Error('Tidak ada fingerprint yang tersedia.');
  }
  // Tandai fingerprint sebagai digunakan
  db.prepare('UPDATE fingerprints SET used = 1 WHERE id = ?').run(availableFingerprint.id);

  const fingerprintData = JSON.parse(availableFingerprint.data);

  // Jika Anda ingin mengubah seluruh objek hasil query menjadi JSON string
  // const fingerprintJsonString = JSON.stringify(availableFingerprint);

  console.log(`DATA JSON ::: ${JSON.stringify(fingerprintData)}`); // Cetak hasil sebagai JSON string

  return fingerprintData;
  
  // return {
  //   deviceId: availableFingerprint.deviceId,
  //   userAgent: availableFingerprint.userAgent,
  //   viewport: {
  //     width: availableFingerprint.viewportWidth,
  //     height: availableFingerprint.viewportHeight,
  //     deviceScaleFactor: availableFingerprint.deviceScaleFactor,
  //     isMobile: Boolean(availableFingerprint.isMobile),
  //     hasTouch: Boolean(availableFingerprint.hasTouch),
  //     isLandscape: Boolean(availableFingerprint.isLandscape),
  //   }
  // };
};

export const resetFingerprintUsage = async () => {
  db.prepare('UPDATE fingerprints SET used = 0').run();
};
