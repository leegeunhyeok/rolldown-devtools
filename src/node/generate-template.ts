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

  // 1. generateData로 데이터 생성
  const data = await generateData({ logsPath, metaPath });

  // 2. 출력 디렉토리 생성
  fs.mkdirSync(outDir, { recursive: true });

  // 3. frontendPublicPath(dist/public)의 모든 파일을 outDir로 복사
  copyDirSync(frontendPublicPath, outDir);

  // 4. rolldown-data.json을 outDir에 작성
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
