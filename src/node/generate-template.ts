import fs from 'node:fs';
import path from 'node:path';
import { generateData } from './generate-data';
import { frontendPublicPath } from './public';

export interface GenerateTemplateOptions {
  logsPath: string;
  metaPath: string;
  outDir: string;
}

export async function generateTemplate(options: GenerateTemplateOptions): Promise<void> {
  const { logsPath, metaPath, outDir } = options;

  const data = await generateData({ logsPath, metaPath });

  fs.mkdirSync(outDir, { recursive: true });

  // Copy built frontend static files to outDir
  copyDirSync(frontendPublicPath, outDir);

  // Write generated data
  fs.writeFileSync(
    path.join(outDir, 'rolldown-data.json'),
    JSON.stringify(data),
  );
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
