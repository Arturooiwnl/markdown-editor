// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import clerk from "@clerk/astro";
import { dark } from '@clerk/themes'

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), clerk({
    appearance:{
      baseTheme: dark,
    }
  })],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
  output: 'server',
});