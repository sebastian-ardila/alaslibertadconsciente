// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages sirve el sitio bajo /alaslibertadconsciente/.
// Para un dominio propio: cambiar `site`, quitar `base` y agregar public/CNAME.
export default defineConfig({
  site: 'https://sebastian-ardila.github.io',
  base: '/alaslibertadconsciente',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
});
