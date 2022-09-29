import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
    server: {
        port: 3002,
    },
    output: 'server',
    adapter: node(),
    integrations: [tailwind(), solidJs()],
});
