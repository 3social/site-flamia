# CLAUDE.md

Este archivo es memoria de contexto para asistentes de IA (Claude u otros) que trabajen en este proyecto en el futuro. Resume la arquitectura, el historial de un incidente de seguridad real y el estado actual de las protecciones, para evitar repetir errores o perder contexto entre sesiones.

## Resumen del proyecto

Sitio estatico de Flamia Group (HTML mas TailwindCSS mas JavaScript vanilla, sin build step) con dos integraciones impulsadas por IA: un chat web y un formulario que dispara una llamada de voz automatica via Vapi mas Twilio. El backend de ambas integraciones es un n8n auto-hosteado en EasyPanel. El sitio se despliega automaticamente a produccion mediante GitHub Pages en cada push a main, no requiere FTP manual.

## Incidente de seguridad, julio 2026

Se detecto una factura inesperada de Vapi (58 dolares) por llamadas automaticas no autorizadas a numeros internacionales (Israel y otros), sin relacion con el formulario del sitio. La causa raiz: el webhook de n8n que dispara la llamada, barra webhook barra flamia-voice-call, no tenia ninguna autenticacion, por lo que cualquiera que conociera la URL podia invocarlo directamente con datos arbitrarios, sin pasar por el formulario del sitio ni por el dominio flamiagroup.com.

Se identifico una IP atacante, 188.161.200.168, visible en los headers de las ejecuciones maliciosas, dato que quedo registrado pero no se uso para bloqueo activo.

## Que se corrigio

Se agrego autenticacion al nodo Webhook de n8n exigiendo un header secreto, X-Flamia-Secret, cuyo valor solo vive como credencial en n8n, Header Auth account, y en el codigo fuente del sitio, index.html, donde se envia junto al fetch del formulario. El sitio fue actualizado y commiteado a GitHub, confirmando que el deploy automatico via GitHub Pages funciona sin pasos manuales.

Se elimino la Vapi Public API Key antigua, que no tenia restricciones de dominio ni de asistente, y se creo una nueva Public Key restringida al dominio flamiagroup.com y al asistente Sofia. Esta nueva key actualmente no se usa en ningun flujo real, porque n8n llama a la API de Vapi con una Private Key server-side, via credencial Header Auth llamada Vapi. Se deja documentada por si se necesita en el futuro para uso client-side.

A pesar del fix de autenticacion, el abuso continuo un tiempo mas, porque el header secreto, al vivir en el JS del sitio, es visible para cualquiera que inspeccione el codigo fuente y puede ser copiado y reenviado directamente al webhook sin pasar por el sitio. El usuario desactivo manualmente el workflow de n8n para cortar el sangrado mientras se preparaba una mitigacion mejor.

Se implemento rate limiting en el flujo de llamada de voz: un nodo Rate Limit Check, tipo Code, usa workflow static data para contar llamadas en una ventana movil de 10 minutos, y un nodo IF, Rate Limit Excedido, corta el flujo devolviendo HTTP 429 si el conteo llega a 5 o mas en esa ventana, antes de llegar al nodo que llama a Vapi. El workflow fue reactivado y publicado, y se confirmo en produccion, ejecucion real exitosa desde el formulario del sitio, que el flujo funciona correctamente de punta a punta.

## Estado actual de seguridad, riesgo residual

El header secreto sigue siendo visible client-side porque el sitio es estatico. El rate limiting es una mitigacion, limita el dano maximo a unas 5 llamadas cada 10 minutos, pero no elimina la causa raiz. Ademas el limite es global, compartido entre todos los usuarios, no por IP, por lo que un ataque podria agotar el cupo y bloquear temporalmente a un lead legitimo.

Mejoras pendientes recomendadas, en orden de prioridad. Prioridad uno: agregar CAPTCHA, reCAPTCHA v3 invisible o hCaptcha, al formulario del sitio, verificado server-side en n8n antes de continuar el flujo. Prioridad dos: mover el secreto detras de un proxy propio, serverless o worker, para que nunca sea visible en el codigo del cliente. Prioridad tres: sumar rate limiting por IP ademas del limite global actual. Prioridad cuatro: agregar validacion de formato de telefono y email, mas un honeypot field oculto en el formulario, para filtrar bots simples.

## Ubicaciones clave

Repositorio del sitio: github.com barra 3social barra site-flamia, rama main, deploy automatico via GitHub Pages.

Workflow de n8n: personaldev-n8n.aaqnec.easypanel.host, workflow Flamia Voice Call Vapi. Nodos relevantes: Webhook Lead Form, Rate Limit Check, Rate Limit Excedido, Normalizar Lead, Llamar Vapi, Formatear Respuesta, Responder al Frontend, Responder Bloqueado 429.

Vapi: assistant Sofia, org threesocial.info arroba gmail.com. Existen ademas otros asistentes, Valeria, Mary, black, no relacionados con este incidente.

## Notas para futuras sesiones

Antes de probar cambios en el flujo de llamada de voz, desactivar el nodo Llamar Vapi para evitar disparar llamadas reales a numeros de prueba o de ataque durante pruebas. Usar datos de prueba fijados, pin data, en el nodo Webhook en vez de invocar el webhook real de produccion. Nunca commitear valores reales de secretos, API keys o tokens en este repositorio, ni siquiera en archivos de documentacion como este. Cualquier cambio de seguridad, borrado de credenciales, o publicacion de workflows debe confirmarse explicitamente con el usuario antes de ejecutarse.


Antes de probar cambios en el flujo de llamada de voz, desactivar el nodo Llamar Vapi para evitar disparar llamadas reales a numeros de prueba o de ataque durante pruebas. Usar datos de prueba fijados, pin data, en el nodo Webhook en vez de invocar el webhook real de produccion. Nunca commitear valores reales de secretos, API keys o tokens en este repositorio, ni siquiera en archivos de documentacion como este. Cualquier cambio de seguridad, borrado de credenciales, o publicacion de workflows debe confirmarse explicitamente con el usuario antes de ejecutarse.
