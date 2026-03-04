import path from 'node:path';

export const appPublicPath = path.join(import.meta.dirname, 'app', 'public');
export const liteDistPath = path.join(import.meta.dirname, 'lite', 'public');
