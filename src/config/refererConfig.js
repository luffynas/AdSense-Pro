import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const loadRefererUrls = () => {
  const filePath = path.resolve(process.cwd(), process.env.REFERER_URLS_FILE || 'referer_urls.txt');
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').filter(line => line.trim() !== '');
  } else {
    console.error('Referer URLs file not found:', filePath);
    return [];
  }
};

export default loadRefererUrls;
