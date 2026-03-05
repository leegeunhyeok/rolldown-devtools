import fs from 'node:fs';
import path from 'node:path';
import { generateData } from './generate-data';
import { appPublicPath, liteDistPath } from './public';

export interface GenerateDevtoolsOptions {
  logsPath: string;
  metaPath: string;
  outDir: string;
}

export interface GenerateAnalyzerOptions {
  dataPath: string;
  outDir: string;
}

/**
 * Generate full devtools page from logs.json + meta.json
 */
export async function generateDevtools(options: GenerateDevtoolsOptions): Promise<void> {
  const { logsPath, metaPath, outDir } = options;
  const data = await generateData({ logsPath, metaPath });

  fs.mkdirSync(outDir, { recursive: true });
  copyDirSync(appPublicPath, outDir);
  fs.writeFileSync(
    path.join(outDir, 'rolldown-data.json'),
    JSON.stringify(data),
  );
}

/**
 * Generate single-file analyzer page from analyze-data.json
 */
export function generateAnalyzer(options: GenerateAnalyzerOptions): void {
  const { dataPath, outDir } = options;

  const htmlPath = path.join(liteDistPath, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Analyze template not found at ${htmlPath}. Run 'build:lite' first.`);
  }

  const json = fs.readFileSync(dataPath, 'utf-8');
  const parsedJson = JSON.parse(json);

  let html = fs.readFileSync(htmlPath, 'utf-8');
  html = html.replace(
    'window.__ANALYZE_DATA__ = window.__ANALYZE_DATA__ || {};',
    `window.__ANALYZE_DATA__ = ${JSON.stringify(parsedJson)};`,
  );

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
}

function copyDirSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
