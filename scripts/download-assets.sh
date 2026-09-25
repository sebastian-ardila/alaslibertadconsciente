#!/usr/bin/env bash
# Descarga las imágenes originales de la landing de WordPress con nombres semánticos.
set -euo pipefail
BASE="https://alaslibertadconsciente.com/cursosonline/wp-content/uploads/2026/04"
DEST="$(dirname "$0")/../src/assets/img"
mkdir -p "$DEST"
while read -r src dst; do
  [ -z "$src" ] && continue
  echo "→ $dst"
  curl -fsSL -A "Mozilla/5.0" "$BASE/$src" -o "$DEST/$dst"
done <<'LIST'
ALAS-AZUL.png logo-alas.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-1.png ebook-portada.png
mockup-completo.png mockup-dispositivos.png
ChatGPT-Image-18-abr-2026-11_06_19-a.m.png mujer-ventana.png
ChatGPT-Image-18-abr-2026-04_18_39-p.m.png mujer-luz.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-11.png ilus-camino-alas.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-15.png ilus-manos.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-16.png ilus-chakras.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-17.png ilus-brujula.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-18.png ilus-mariposa.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-2.png bono-cartas.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles.png bono-cierre-ciclos.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-4.png sello-garantia.png
Recursos-Ebook-Un-encuentro-con-los-7-Arcangeles-14.png claudia-palacio.png
LIST
curl -fsSL "https://img.youtube.com/vi/nVO4gGMtxX0/maxresdefault.jpg" -o "$DEST/video-poster.jpg" \
  || curl -fsSL "https://img.youtube.com/vi/nVO4gGMtxX0/hqdefault.jpg" -o "$DEST/video-poster.jpg"
# Variantes del logo (recortado y recoloreado) para fondos claros y oscuros
python3 - "$DEST" <<'PY'
import sys, os
from PIL import Image
d = sys.argv[1]
im = Image.open(os.path.join(d, "logo-alas.png")).convert("RGBA")
im = im.crop(im.getchannel("A").getbbox())
a = im.getchannel("A")
for name, col in [("logo-alas-claro.png", (236, 241, 249)), ("logo-alas-azul.png", (0, 74, 173))]:
    out = Image.new("RGBA", im.size, col + (0,)); out.putalpha(a); out.save(os.path.join(d, name), optimize=True)
os.remove(os.path.join(d, "logo-alas.png"))
PY
echo "Listo."
