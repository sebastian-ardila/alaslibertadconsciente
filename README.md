# Un Encuentro con los 7 Arcángeles — landing

Landing de venta del ebook de Alas Libertad Consciente. Hecha con Astro, GSAP (ScrollTrigger) y Lenis.

- **En vivo:** https://sebastian-ardila.github.io/alaslibertadconsciente/
- **Contenido y enlaces** (checkout de Hotmart, WhatsApp, video): `src/content/landing.ts`
- **Imágenes:** `npm run assets` las vuelve a descargar desde el sitio original a `src/assets/img/`

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/alaslibertadconsciente/
npm run build    # genera dist/
```

Cada push a `main` se publica en GitHub Pages (`.github/workflows/deploy.yml`).

## Dominio propio

En `astro.config.mjs`, cambiar `site` por el dominio, eliminar `base` y crear `public/CNAME` con el dominio.

## Movimiento y accesibilidad

`src/scripts/ui.ts` maneja el header, la barra de compra móvil y reenvía los parámetros `utm_*` al checkout.
`src/scripts/motion.ts` (parallax, escenas fijadas, hilo dorado) solo se carga si la persona no pidió reducir el movimiento. Sin ese archivo, todo el contenido sigue visible.
