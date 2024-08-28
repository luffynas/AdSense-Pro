import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const loadProxies = () => {
    let proxies = [];

    if (process.env.PROXY_LIST_FILE) {
        const filePath = path.resolve(process.cwd(), process.env.PROXY_LIST_FILE);
        console.log('File path:', filePath); // Debugging untuk melihat path file

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            console.log('File content:', fileContent); // Debugging untuk melihat isi file

            proxies = fileContent.split('\n').filter(line => line.trim() !== '');
            console.log('Loaded Proxies:', proxies); // Debugging untuk melihat daftar proxy yang dihasilkan
        } else {
            console.error('File not found:', filePath); // Jika file tidak ditemukan
        }
    } else {
        console.error('PROXY_LIST_FILE environment variable is not set.'); // Jika variabel lingkungan tidak diset
    }

    return proxies;
};

export default loadProxies;
