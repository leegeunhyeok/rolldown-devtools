import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { generateData } from './generate-data';
import { generateAnalyzer, generateDevtools } from './generate-template';

const program = new Command();

program
  .name('rolldown-analyzer')
  .description('Standalone Analyzer for Rolldown');

// rolldown-analyzer generate -t devtools --logs <path> --meta <path> -o <dir>
// rolldown-analyzer generate -t analyzer --data <path> -o <dir>
program
  .command('generate')
  .description('Generate static analysis page')
  .requiredOption('-t, --template <type>', 'Template type: "full" or "lite"')
  .requiredOption('-o, --out-dir <path>', 'Output directory')
  .option('--logs <path>', 'Path to logs.json (for "full" template)')
  .option('--meta <path>', 'Path to meta.json (for "full" template)')
  .option('--data <path>', 'Path to bundle-analysis.json (for "lite" template)')
  .action(async (options) => {
    const outDir = path.resolve(options.outDir);

    if (options.template === 'full') {
      if (!options.logs || !options.meta) {
        console.error('Error: --logs and --meta are required for "full" template');
        process.exit(1);
      }
      await generateDevtools({
        logsPath: path.resolve(options.logs),
        metaPath: path.resolve(options.meta),
        outDir,
      });
      console.log(`Generated full page in ${outDir}`);
    } else if (options.template === 'lite') {
      if (!options.data) {
        console.error('Error: --data is required for "lite" template');
        process.exit(1);
      }
      generateAnalyzer({
        dataPath: path.resolve(options.data),
        outDir,
      });
      console.log(`Generated lite page in ${outDir}`);
    } else {
      console.error(`Error: unknown template "${options.template}". Use "full" or "lite"`);
      process.exit(1);
    }
  });

// rolldown-analyzer generate-data --logs <path> --meta <path> -o <file>
program
  .command('generate-data')
  .description('Generate devtools data as JSON (without "full" template)')
  .requiredOption('--logs <path>', 'Path to logs.json')
  .requiredOption('--meta <path>', 'Path to meta.json')
  .requiredOption('-o, --out-file <path>', 'Output JSON file path')
  .action(async (options) => {
    const data = await generateData({
      logsPath: path.resolve(options.logs),
      metaPath: path.resolve(options.meta),
    });
    const outFile = path.resolve(options.outFile);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(data));
    console.log(`Generated data at ${outFile}`);
  });

program.parse();
