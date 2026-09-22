#!/usr/bin/env bash
# Empaqueta public/ para subir a public_html en Hostinger.
# Los archivos quedan en la raiz del ZIP, sin la carpeta public/ por delante:
# al extraerlo dentro de public_html cada archivo cae donde debe.
set -euo pipefail
cd "$(dirname "$0")"

# Las invariantes de SEO se verifican ANTES de empaquetar: un NAP divergente
# o una pagina fuera del sitemap no deberia poder llegar al servidor.
./check-seo.sh
echo

cd public
rm -f ../flamia-public_html.zip
zip -qrX ../flamia-public_html.zip . -x '.DS_Store' '*/.DS_Store'
cd ..
echo "Listo: flamia-public_html.zip"
unzip -l flamia-public_html.zip | tail -n +4 | head -20
