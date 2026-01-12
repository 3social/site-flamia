# site-flamia
sitio web Flamia group
# Flamia Group – AI Website (Chat + Voice Call)

Landing page de **Flamia Group** con dos funcionalidades clave impulsadas por IA:

1. **Chat Web con IA**  
   Asistente conversacional que responde consultas sobre servicios de IA y automatización, orientado a conversión (agendar consultoría y calificar leads).

2. **Formulario que dispara una llamada automática**  
   El lead deja sus datos y recibe una llamada en segundos a través de un agente de voz (Vapi + Twilio).

---

## 🧠 Arquitectura General

### Frontend
- HTML + TailwindCSS
- JavaScript vanilla
- Desarrollo local con:
  ```bash
  python -m http.server 8000
Integraciones:

Chat web → Webhook n8n

Formulario de llamada → Webhook n8n

Backend

n8n auto-hosteado (EasyPanel / VPS)

Toda la lógica, seguridad y claves viven en backend

CORS controlado explícitamente

IA

Chat: n8n AI Agent (OpenAI)

Voz: Vapi (orquestación) + Twilio (telefonía)

🔗 Endpoints

Base n8n:
https://personaldev-n8n.aaqnec.easypanel.host
Webhooks:

Chat IA:
/webhook/chatflamia

Llamada de voz:
/webhook/flamia-voice-call

Flujos n8n
Chat IA
Webhook (chatflamia)
→ Preparar Mensaje
→ AI Agent
→ Formatear Respuesta
→ Responder al Frontend

Respuesta esperada:

{
  "reply": "Texto del asistente"
}

Llamada de Voz
Webhook (flamia-voice-call)
→ Normalizar Lead
→ Llamar Vapi
→ Responder al Frontend


Entrada ejemplo:

{
  "name": "Laura Martínez",
  "phone": "+34600000000",
  "email": "laura@empresa.com",
  "source": "landing-flamia-real-estate"
}


Respuesta ejemplo:

{
  "success": true,
  "message": "Llamada iniciada. Nuestro agente IA te estará llamando en segundos."

  Variables de Entorno (EasyPanel)
OPENAI_KEY=sk-...
VAPI_API_KEY=...
N8N_DEFAULT_CORS=TRUE
N8N_CORS_ALLOW_ORIGIN=http://localhost:8000
WEBHOOK_CORS_ALLOWED_ORIGINS=http://localhost:8000
WEBHOOK_CORS_ALLOWED_METHODS=GET,HEAD,POST,OPTIONS
WEBHOOK_CORS_ALLOWED_HEADERS=Content-Type,Authorization