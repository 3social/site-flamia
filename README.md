# Flamia Group – AI Website (Chat + Voice Call)

Landing page de Flamia Group con dos funcionalidades clave impulsadas por IA.

Chat Web con IA: asistente conversacional que responde consultas sobre servicios de IA y automatizacion, orientado a conversion (agendar consultoria y calificar leads).

Formulario que dispara una llamada automatica: el lead deja sus datos y recibe una llamada en segundos a traves de un agente de voz (Vapi + Twilio).

## Arquitectura General

Frontend: HTML mas TailwindCSS, JavaScript vanilla, sitio estatico sin build step. Deploy automatico a produccion via GitHub Pages en cada push a main (ver seccion Deploy). Desarrollo local con python -m http.server 8000.

Integraciones: Chat web hacia Webhook n8n. Formulario de llamada hacia Webhook n8n.

Backend: n8n auto-hosteado (EasyPanel / VPS). Toda la logica, seguridad y claves viven en backend. CORS controlado explicitamente. Webhook de llamada de voz protegido con autenticacion por header (ver seccion Seguridad).

IA: Chat con n8n AI Agent (OpenAI). Voz con Vapi (orquestacion) mas Twilio (telefonia).

## Deploy

El sitio se publica automaticamente mediante GitHub Pages en cada push a la rama main (workflow pages build and deployment, visible en la pestana Actions del repo). No hace falta subir archivos manualmente por FTP a ningun hosting: basta con commitear a main y en menos de un minuto el cambio queda live en el dominio.

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
