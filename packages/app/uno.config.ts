import { defineConfig } from 'unocss';

import { presetDevToolsUI } from '@rolldown-analyzer/core/ui/unocss';

export default defineConfig({
  presets: [presetDevToolsUI()],
});
