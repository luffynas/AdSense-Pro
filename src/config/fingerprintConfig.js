import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const loadFingerprints = () => {
    let fingerprints = [];

    const filePath = path.resolve(process.cwd(), process.env.FINGERPRINT_LIST_FILE || 'fingerprints.json');
    console.log('File path:', filePath); // Debugging untuk melihat path file

    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        fingerprints = JSON.parse(fileContent);
        console.log('Loaded Fingerprints:', fingerprints); // Debugging untuk melihat isi file
    } else {
        console.error('File not found:', filePath); // Jika file tidak ditemukan
    }

    return fingerprints;
};

export default loadFingerprints;
