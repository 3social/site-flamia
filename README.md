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
