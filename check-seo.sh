#!/usr/bin/env bash
# Verifica las invariantes de SEO que el README pide sostener a mano.
# Las tres se rompen igual: alguien edita una pagina y olvida las otras.
# package.sh lo ejecuta antes de empaquetar, asi que una de estas fallas
# no puede llegar al servidor.
#
#   1. NAP identico en todas las paginas y en el JSON-LD.
#   2. La seccion #faq visible y el bloque FAQPage tienen el mismo numero
#      de preguntas.
#   3. Toda pagina publicable esta en sitemap.xml.
#
# Uso: ./check-seo.sh    (salida 0 = todo bien, 1 = hay que arreglar algo)
set -uo pipefail
cd "$(dirname "$0")/public"

# --- NAP canonico: si el negocio cambia de telefono, se cambia AQUI -------
NAP_NOMBRE="Flamia Group"
NAP_TEL_VISIBLE="+506 8940 1202"   # como se lee en el pie
NAP_TEL_ENLACE="+50689401202"      # como va en href="tel:" y en el JSON-LD
NAP_EMAIL="contacto@flamiagroup.com"
NAP_LOCALIDAD="Heredia, Costa Rica"

PAGINAS=(*.html)   # se descubren solas: una pagina nueva entra sin tocar el script
fallos=0

fallo() { printf '  \033[31mFALLA\033[0m  %s\n' "$1"; fallos=$((fallos + 1)); }
ok()    { printf '  \033[32mok\033[0m     %s\n' "$1"; }

echo "1. NAP consistente"
for pagina in "${PAGINAS[@]}"; do
  [ -f "$pagina" ] || { fallo "$pagina no existe"; continue; }
  faltantes=()
  for dato in "$NAP_NOMBRE" "$NAP_TEL_VISIBLE" "$NAP_TEL_ENLACE" "$NAP_EMAIL" "$NAP_LOCALIDAD"; do
    grep -qF "$dato" "$pagina" || faltantes+=("$dato")
  done
  if [ ${#faltantes[@]} -eq 0 ]; then
    ok "$pagina"
  else
    fallo "$pagina no contiene: $(printf '%s | ' "${faltantes[@]}")"
  fi
done

# Cualquier otro numero +506 en el sitio es un NAP divergente. Se excluyen
# los atributos placeholder, que son ejemplos de formulario, no el NAP.
for pagina in "${PAGINAS[@]}"; do
  [ -f "$pagina" ] || continue
  while read -r encontrado; do
    digitos=$(printf '%s' "$encontrado" | tr -cd '0-9')
    [ "$digitos" = "50689401202" ] || fallo "$pagina: telefono divergente '$encontrado'"
  done < <(grep -v 'placeholder="' "$pagina" | grep -oE '\+506[0-9 ]{8,12}')
done

# El JSON-LD declara su propio NAP, y Google compara ese con la ficha de
# Google Business Profile: si se va de sincronia, el marcado no sirve.
echo "2. NAP del JSON-LD"
for campo in "\"telephone\": \"$NAP_TEL_ENLACE\"" "\"email\": \"$NAP_EMAIL\"" '"addressLocality": "Heredia"' '"addressCountry": "CR"'; do
  if grep -qF "$campo" index.html; then ok "$campo"; else fallo "JSON-LD sin $campo"; fi
done

echo "3. FAQ visible == FAQPage"
faq_visible=$(grep -c '<details class="faq-item">' index.html)
faq_schema=$(grep -c '"@type": "Question"' index.html)
if [ "$faq_visible" -eq "$faq_schema" ] && [ "$faq_visible" -gt 0 ]; then
  ok "$faq_visible preguntas en ambos"
else
  fallo "seccion #faq tiene $faq_visible preguntas y el FAQPage tiene $faq_schema"
fi

echo "4. Paginas en sitemap.xml"
for pagina in *.html; do
  # 404.html no se indexa a proposito: es la respuesta a una URL que no existe.
  [ "$pagina" = "404.html" ] && continue
  # Las paginas de servicio se sirven sin extension (ver .htaccess), asi que
  # su URL canonica no es la del archivo.
  case "$pagina" in
    index.html)       url="https://flamiagroup.com/" ;;
    gohighlevel.html) url="https://flamiagroup.com/gohighlevel" ;;
    *)                url="https://flamiagroup.com/$pagina" ;;
  esac
  if grep -qF "<loc>$url</loc>" sitemap.xml; then ok "$pagina"; else fallo "$pagina no esta en sitemap.xml ($url)"; fi
done

echo
if [ "$fallos" -eq 0 ]; then
  echo "Todo en orden."
else
  echo "$fallos problema(s). Corrige antes de publicar."
  exit 1
fi
