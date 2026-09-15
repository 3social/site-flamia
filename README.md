# Flamia Group – AI Website (Chat + Voice Call)

> ## ⚠️ AL SERVIDOR VA `public/`, NUNCA EL REPOSITORIO
>
> A `public_html` se sube **unicamente el contenido de la carpeta `public/`**,
> con los archivos en la raiz. Nada de `CLAUDE.md`, `README.md`,
> `flammeta.json.template`, `package.sh` ni `.gitignore`.
>
> ```bash
> ./package.sh     # genera flamia-public_html.zip, listo para subir
> ```
>
> Subir el repositorio entero rompe el sitio de dos formas a la vez: deja
> `index.html` dentro de `public/` en vez de la raiz, con lo que el dominio
> se queda sin pagina de inicio, y devuelve al servidor la documentacion
> interna que describe el host de n8n, la ruta del webhook y el nombre del
> header de autenticacion. Ya paso. Dos veces.
>
> Descargar el ZIP desde GitHub (*Code → Download ZIP*) tiene el mismo
> efecto: ese ZIP es el repositorio, no el sitio.


Landing page de Flamia Group con dos funcionalidades clave impulsadas por IA.

Chat Web con IA: asistente conversacional que responde consultas sobre servicios de IA y automatizacion, orientado a conversion (agendar consultoria y calificar leads).

Formulario que dispara una llamada automatica: el lead deja sus datos y recibe una llamada en segundos a traves de un agente de voz (Vapi + Twilio).

## Arquitectura General

Frontend: HTML mas TailwindCSS, JavaScript vanilla, sitio estatico sin build step. Se publica subiendo archivos a Hostinger (ver seccion Deploy). Desarrollo local con python -m http.server 8000.

Integraciones: Chat web hacia Webhook n8n. Formulario de llamada hacia Webhook n8n.

Backend: n8n auto-hosteado (EasyPanel / VPS). Toda la logica, seguridad y claves viven en backend. CORS controlado explicitamente. Webhook de llamada de voz protegido con autenticacion por header (ver seccion Seguridad).

IA: Chat con n8n AI Agent (OpenAI). Voz con Vapi (orquestacion) mas Twilio (telefonia).

## Deploy

El sitio se publica **subiendo los archivos a Hostinger**, no por GitHub Pages.
Verificado contra la API de Hostinger: `flamiagroup.com` es un vhost principal
cuyo document root es `/home/u783834143/domains/flamiagroup.com/public_html`,
y ahi viven los archivos que sirve el dominio. Commitear a `main` no publica
nada por si solo: hay que subir los archivos.

Del mismo `public_html` cuelgan otros dos sitios, que no se deben tocar al
subir cambios de este:

| Subdominio | Carpeta |
| --- | --- |
| `inmobiliaria.flamiagroup.com` | `public_html/inmobiliaria` |
| `ghl.flamiagroup.com` | `public_html/build` |

Por eso las reglas de `.htaccess` preservan el host al redirigir: una regla
que apunte a un dominio fijo arrastraria el trafico de esos subdominios al
dominio principal.

En produccion hay ademas un `data-deletion.html` (pagina de solicitud de
eliminacion de datos, requisito de la app de Meta) que **no esta en este
repositorio**. Conviene versionarlo antes de que se pierda.

## Endpoints

Base n8n: https://personaldev-n8n.aaqnec.easypanel.host

Webhook Chat IA: barra webhook barra chatflamia

Webhook Llamada de voz: barra webhook barra flamia-voice-call

Flujo Chat IA: Webhook chatflamia hacia Preparar Mensaje hacia AI Agent hacia Formatear Respuesta hacia Responder al Frontend. Respuesta esperada: reply con el texto del asistente.

Flujo Llamada de Voz: Webhook flamia-voice-call hacia Rate Limit Check hacia Rate Limit Excedido hacia Normalizar Lead hacia Llamar Vapi hacia Formatear Respuesta hacia Responder al Frontend.

Entrada ejemplo: name, phone, email, source landing-flamia-real-estate.

Respuesta exito: success true, mensaje de llamada iniciada.

Respuesta bloqueada por rate limit HTTP 429: success false, mensaje pidiendo reintentar en unos minutos.

## Seguridad

En julio 2026 se detecto abuso del webhook de llamada de voz, con llamadas automaticas no autorizadas a numeros internacionales que generaron cargos inesperados en Vapi. Se implementaron las siguientes protecciones.

Autenticacion del Webhook: el nodo Webhook de n8n exige un header secreto llamado X Flamia Secret que se valida en cada request. El valor real vive unicamente como credencial en n8n y en el JS del sitio, no se documenta aqui.

Rate limiting: nodo Rate Limit Check en n8n limita a un maximo de 5 llamadas cada 10 minutos en una ventana global, usando workflow static data, devolviendo HTTP 429 si se excede.

Vapi API Keys: la Public Key antigua sin restricciones fue eliminada. Se creo una nueva Public Key restringida por dominio flamiagroup.com y por asistente, solo Sofia, aunque actualmente no se usa en el flujo porque n8n llama a Vapi con Private Key server-side.

### Riesgo residual conocido

El sitio es estatico, por lo que el header secreto sigue siendo visible en el codigo fuente del navegador. El rate limiting mitiga el impacto de un abuso, maximo unas 5 llamadas cada 10 min, pero no elimina la causa raiz.

Mejoras recomendadas pendientes, en orden de prioridad. Prioridad uno: agregar CAPTCHA, reCAPTCHA v3 invisible o hCaptcha, al formulario, verificado server-side en n8n. Prioridad dos: mover el secreto detras de un proxy propio, serverless o worker, para que nunca sea visible client-side. Prioridad tres: sumar rate limiting por IP ademas del limite global actual. Prioridad cuatro: agregar validacion de formato de telefono y email, mas un honeypot field en el formulario.

Ver CLAUDE.md para el detalle completo del incidente y contexto para futuras modificaciones del proyecto.

## Variables de Entorno EasyPanel

OPENAI_KEY, VAPI_API_KEY, N8N_DEFAULT_CORS igual TRUE, N8N_CORS_ALLOW_ORIGIN igual http localhost 8000, WEBHOOK_CORS_ALLOWED_ORIGINS igual http localhost 8000, WEBHOOK_CORS_ALLOWED_METHODS igual GET HEAD POST OPTIONS, WEBHOOK_CORS_ALLOWED_HEADERS igual Content-Type Authorization.

## Estructura del repositorio

Lo que se publica y lo que no estan fisicamente separados. No es una
convencion: es la unica garantia de que un archivo interno no termine
servido en produccion por un descuido.

```
public/          <- esto y solo esto va a public_html
  .htaccess
  index.html  privacy.html  terms.html  404.html
  robots.txt  sitemap.xml
  assets/      (css, fuentes, imagenes)

CLAUDE.md               <- interno, NUNCA se sube
README.md               <- interno, NUNCA se sube
flammeta.json.template  <- interno, NUNCA se sube
package.sh              <- utilidad local
```

Motivo: en produccion se detectaron `CLAUDE.md`, `README.md` y
`flammeta.json.template` servidos publicamente desde `public_html`.
`CLAUDE.md` describe el host de n8n, la ruta del webhook, el nombre del
header de autenticacion, que el secreto es legible en el HTML y cual es el
limite de llamadas: el manual completo del ataque que ya costo dinero una
vez. Las reglas del `.htaccess` los bloquean, pero una regla se puede
borrar; una carpeta que no se sube, no.

### Publicar

```bash
./package.sh     # empaqueta public/ en flamia-public_html.zip
```

Los archivos quedan en la raiz del ZIP, sin la carpeta `public/` por
delante, de modo que al extraerlo dentro de `public_html` cada uno cae donde
debe. Subir el ZIP al Administrador de archivos de Hostinger, extraer,
reemplazar, y borrar el ZIP.

Dos cosas que se olvidan y cuestan una tarde:

- `.htaccess` empieza con punto. Finder y el Explorador de Windows lo
  ocultan, asi que si se descomprime en local y se suben los archivos a
  mano, se queda atras. Extraer **en el servidor**, o subirlo aparte y
  renombrarlo alli.
- Hostinger cachea del lado del servidor. Si tras subir no se ve el cambio:
  hPanel, Rendimiento, Cache, Purgar todo. Para comprobar sin caches de por
  medio, abrir el sitio con un parametro cualquiera: `?v=2`.

## SEO

Archivos que sostienen el SEO del sitio. Todos son estaticos: si publicas
subiendo archivos a Hostinger, van a `public_html` respetando la misma
estructura de carpetas.

| Archivo | Para que sirve |
| --- | --- |
| `robots.txt` | Permite el rastreo y declara el sitemap. Deja pasar a proposito a los bots de IA (GPTBot, PerplexityBot, ClaudeBot): Flamia vende IA, aparecer en esas respuestas es adquisicion. |
| `sitemap.xml` | Lista de URLs para Google Search Console. Actualiza `lastmod` cuando cambie el contenido. |
| `.htaccess` | Una sola URL canonica (https, sin www), compresion, cache, cabeceras de seguridad y pagina 404. Es un archivo oculto: activa "Mostrar archivos ocultos" en el Administrador de archivos de Hostinger. |
| `404.html` | Pagina de error propia, con enlaces de vuelta al sitio. |
| `assets/og-image.jpg` | Tarjeta 1200x630 que se ve al compartir el enlace en WhatsApp, LinkedIn o Facebook. |
| `assets/logo.png` | Logo 512x512 declarado en los datos estructurados (Schema.org). |
| `assets/pages.css` | Estilos de `privacy.html`, `terms.html` y `404.html`. No dependen de Tailwind. |

Los datos estructurados viven en un solo bloque JSON-LD en el `<head>` de
`index.html`, como un `@graph` con Organization, WebSite, WebPage, Service y
FAQPage. La seccion visible `#faq` y el bloque FAQPage tienen que decir lo
mismo: si editas una, edita la otra.

### Rendimiento: sin CDN de terceros

El sitio no carga nada de dominios externos. Antes dependia de dos:

- **Tailwind Play CDN** (`cdn.tailwindcss.com`): ~400 KB de JavaScript que
  compilaban el CSS **en el navegador de cada visitante**, bloqueando el
  render. Sustituido por `assets/tailwind.css`, el mismo CSS ya compilado:
  22 KB, cacheable y sin JavaScript de por medio.
- **Google Fonts**: Inter ahora se sirve desde `assets/fonts/`, como fuente
  variable con el subconjunto latino (48 KB, cubre de 100 a 900 y todos los
  acentos del espanol). Se precarga con `rel="preload"`.

Resultado: la home hace **3 peticiones**, todas al propio dominio.

**IMPORTANTE — `public/assets/tailwind.css` es un archivo generado.** Si agregas o
cambias clases de Tailwind en el HTML, hay que regenerarlo o esas clases no
tendran estilo:

```bash
npx tailwindcss@3 -i <(printf '@tailwind base;@tailwind components;@tailwind utilities;') \
  -o public/assets/tailwind.css --minify --content './public/*.html'
```

Y volver a subir `public/assets/tailwind.css` junto al HTML.

### Despues de publicar

1. Verificar el dominio en Google Search Console y enviar
   `https://flamiagroup.com/sitemap.xml`.
2. Probar el marcado en <https://search.google.com/test/rich-results>.
3. Probar la tarjeta social en <https://www.linkedin.com/post-inspector/>.
4. Medir Core Web Vitals en <https://pagespeed.web.dev/>.

### SEO local (Costa Rica)

El sitio esta posicionado para Costa Rica: `lang="es-CR"`, `og:locale` `es_CR`,
y la entidad principal del JSON-LD se declara como `Organization` +
`ProfessionalService` con `areaServed` Costa Rica, San Jose y Heredia.

Palabras clave secundarias colocadas en el cuerpo: *CRM para inmobiliarias
Costa Rica* (intro de Soluciones), *automatizacion de WhatsApp para bienes
raices* y *software inmobiliario San Jose / Heredia / Costa Rica* (hero).

NAP (nombre, direccion, telefono) del negocio, repetido igual en el pie de
todas las paginas y en el JSON-LD:

- Flamia Group
- +506 8940 1202
- contacto@flamiagroup.com
- Heredia, Costa Rica

Flamia es un negocio digital, sin local con atencion al publico. Por eso el
nodo `PostalAddress` declara `addressLocality` Heredia y `addressCountry` CR,
pero **no** una calle: inventar una direccion fisica que no existe rompe la
coincidencia con Google Business Profile y Google descarta el marcado.
El alcance real se declara en `areaServed` y `serviceArea`.

Si cambia el telefono o la localidad, hay que cambiarlo en los cuatro sitios
a la vez (JSON-LD de `index.html` y pie de `index.html`, `privacy.html`,
`terms.html`, `404.html`). La inconsistencia de NAP es de los errores que mas
castigan el SEO local.

PENDIENTE:

- Ficha de Google Business Profile como **negocio de area de servicio**
  (sin direccion visible, con Heredia y las zonas atendidas). Sin ficha
  verificada no hay paquete local por mas impecable que este el schema.
- URLs de LinkedIn, Instagram y Facebook en `sameAs`.
