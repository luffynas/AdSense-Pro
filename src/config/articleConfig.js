import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadArticleUrls = () => {
  const filePath = path.resolve(process.cwd(), process.env.ARTICLE_URLS_FILE || 'article_urls.txt');
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').filter(line => line.trim() !== '');
  } else {
    console.error('Article URLs file not found:', filePath);
    return [];
  }
};

export default loadArticleUrls;
