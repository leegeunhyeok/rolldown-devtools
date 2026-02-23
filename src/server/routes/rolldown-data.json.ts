import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler((event) => {
  const jsonData = fs.readFileSync(path.resolve(process.cwd(), 'rolldown-data.json'), 'utf-8');
  setResponseHeader(event, 'Content-Type', 'application/json');
  return jsonData;
});
