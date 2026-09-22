# CLAUDE.md

Este archivo es memoria de contexto para asistentes de IA (Claude u otros) que trabajen en este proyecto en el futuro. Resume la arquitectura, el historial de un incidente de seguridad real y el estado actual de las protecciones, para evitar repetir errores o perder contexto entre sesiones.

## Resumen del proyecto

Sitio estatico de Flamia Group (HTML mas TailwindCSS mas JavaScript vanilla; el unico paso de build es regenerar el CSS de Tailwind cuando cambian las clases del HTML) con dos integraciones impulsadas por IA: un chat web y un formulario que dispara una llamada de voz automatica via Vapi mas Twilio. El backend de ambas integraciones es un n8n auto-hosteado en EasyPanel. El sitio se publica subiendo archivos a Hostinger. NO usa GitHub Pages: commitear a main no publica nada por si solo.

## Incidente de seguridad, julio 2026

Se detecto una factura inesperada de Vapi (58 dolares) por llamadas automaticas no autorizadas a numeros internacionales (Israel y otros), sin relacion con el formulario del sitio. La causa raiz: el webhook de n8n que dispara la llamada, barra webhook barra flamia-voice-call, no tenia ninguna autenticacion, por lo que cualquiera que conociera la URL podia invocarlo directamente con datos arbitrarios, sin pasar por el formulario del sitio ni por el dominio flamiagroup.com.

Se identifico una IP atacante, 188.161.200.168, visible en los headers de las ejecuciones maliciosas, dato que quedo registrado pero no se uso para bloqueo activo.

## Que se corrigio

Se agrego autenticacion al nodo Webhook de n8n exigiendo un header secreto, X-Flamia-Secret, cuyo valor solo vive como credencial en n8n, Header Auth account, y en el codigo fuente del sitio, index.html, donde se envia junto al fetch del formulario. El sitio fue actualizado y commiteado a GitHub.

Se elimino la Vapi Public API Key antigua, que no tenia restricciones de dominio ni de asistente, y se creo una nueva Public Key restringida al dominio flamiagroup.com y al asistente Sofia. Esta nueva key actualmente no se usa en ningun flujo real, porque n8n llama a la API de Vapi con una Private Key server-side, via credencial Header Auth llamada Vapi. Se deja documentada por si se necesita en el futuro para uso client-side.

A pesar del fix de autenticacion, el abuso continuo un tiempo mas, porque el header secreto, al vivir en el JS del sitio, es visible para cualquiera que inspeccione el codigo fuente y puede ser copiado y reenviado directamente al webhook sin pasar por el sitio. El usuario desactivo manualmente el workflow de n8n para cortar el sangrado mientras se preparaba una mitigacion mejor.

Se implemento rate limiting en el flujo de llamada de voz: un nodo Rate Limit Check, tipo Code, usa workflow static data para contar llamadas en una ventana movil de 10 minutos, y un nodo IF, Rate Limit Excedido, corta el flujo devolviendo HTTP 429 si el conteo llega a 5 o mas en esa ventana, antes de llegar al nodo que llama a Vapi. El workflow fue reactivado y publicado, y se confirmo en produccion, ejecucion real exitosa desde el formulario del sitio, que el flujo funciona correctamente de punta a punta.

## Estado actual de seguridad, riesgo residual

El header secreto sigue siendo visible client-side porque el sitio es estatico. El rate limiting es una mitigacion, limita el dano maximo a unas 5 llamadas cada 10 minutos, pero no elimina la causa raiz. Ademas el limite es global, compartido entre todos los usuarios, no por IP, por lo que un ataque podria agotar el cupo y bloquear temporalmente a un lead legitimo.

Mejoras pendientes recomendadas, en orden de prioridad. Prioridad uno: agregar CAPTCHA, reCAPTCHA v3 invisible o hCaptcha, al formulario del sitio, verificado server-side en n8n antes de continuar el flujo. Prioridad dos: mover el secreto detras de un proxy propio, serverless o worker, para que nunca sea visible en el codigo del cliente. Prioridad tres: sumar rate limiting por IP ademas del limite global actual. Prioridad cuatro: agregar validacion de formato de telefono y email, mas un honeypot field oculto en el formulario, para filtrar bots simples.

## Ubicaciones clave

Repositorio del sitio: github.com barra 3social barra site-flamia. Se publica a mano en Hostinger, no hay deploy automatico.

Hostinger, cuenta u783834143. El document root de flamiagroup.com es barra home barra u783834143 barra domains barra flamiagroup.com barra public_html. De ese mismo public_html cuelgan otros tres proyectos que no se deben tocar al publicar este sitio: la carpeta inmobiliaria, que es el document root de inmobiliaria.flamiagroup.com y contiene una aplicacion Laravel; la carpeta build, que es el document root de ghl.flamiagroup.com; y la carpeta ghl. Existe ademas data-deletion.html, pagina de eliminacion de datos exigida por la app de Meta, que esta en produccion pero no en el repositorio.

Por esa convivencia, cualquier despliegue que sobrescriba public_html entero, como el deploy de archivo de la API de Hostinger o el Git nativo apuntado a esa carpeta, borraria los otros tres sitios. Nunca usarlos sin resolver antes esa separacion.

Workflow de n8n: personaldev-n8n.aaqnec.easypanel.host, workflow Flamia Voice Call Vapi. Nodos relevantes: Webhook Lead Form, Rate Limit Check, Rate Limit Excedido, Normalizar Lead, Llamar Vapi, Formatear Respuesta, Responder al Frontend, Responder Bloqueado 429.

Vapi: assistant Sofia, org threesocial.info arroba gmail.com. Existen ademas otros asistentes, Valeria, Mary, black, no relacionados con este incidente.

## Segundo incidente, septiembre 2026: documentacion interna servida en publico

Se detecto que CLAUDE.md, README.md y flammeta.json.template vivian dentro de
public_html y se servian publicamente. Confirmado: flamiagroup.com barra
CLAUDE.md devolvia este mismo archivo a cualquiera.

Gravedad: este documento describe el host de n8n, la ruta del webhook, el
nombre del header de autenticacion, que el secreto es legible en el codigo
fuente del sitio y cual es el limite de llamadas de la ventana de rate
limiting. Es el manual completo del ataque de julio, publicado en el propio
dominio atacado.

Corregido en dos capas. Primero, estructural: el repositorio separa ahora
public, que es lo unico que se sube, del resto. La documentacion interna vive
en la raiz del repositorio y no puede llegar al servidor por descuido.
Segundo, en el servidor: los tres archivos fueron eliminados de public_html, y
el .htaccess devuelve 404 ante cualquier ruta que termine en punto md o punto
template y ante cualquier archivo oculto, con .well-known como excepcion.

PENDIENTE Y URGENTE: rotar el X-Flamia-Secret. El archivo estuvo accesible
durante un periodo indeterminado; quien lo haya leido conoce la arquitectura
completa aunque no el valor del secreto, que de todos modos siempre fue
legible en el HTML del sitio.

## Tercer incidente, septiembre 2026: el repositorio subido al servidor

Tras fusionar a main se subio el repositorio completo a public_html en vez
del contenido de public. Efecto doble: index.html dejo de estar en la raiz,
con lo que el dominio se quedo sin pagina de inicio y el sitio estuvo caido,
y CLAUDE.md, README.md, flammeta.json.template, package.sh y .gitignore
volvieron al servidor.

La exposicion no llego a producirse porque el .htaccess de la raiz devuelve
404 ante rutas terminadas en punto md, punto template y punto sh, y ante
archivos ocultos. La segunda capa aguanto, que es exactamente para lo que
esta.

Se recupero moviendo el contenido de public a la raiz. Quedaron sin borrar
CLAUDE.md, README.md, flammeta.json.template, .gitignore, package.sh y una
carpeta sobrante assets.4171: son inaccesibles desde fuera, pero conviene
limpiarlos.

REGLA: al servidor va unicamente el contenido de public, con los archivos en
la raiz del ZIP. Se genera con package.sh. Descargar el ZIP desde GitHub con
Code y Download ZIP NO sirve: ese ZIP es el repositorio, no el sitio.

## Estado del sitio, septiembre 2026

Se reescribio el SEO y el rendimiento. Lo relevante para no deshacerlo sin
querer:

El sitio ya no carga nada de CDN externos. Tailwind Play CDN, que compilaba
el CSS en el navegador de cada visitante, fue sustituido por
public barra assets barra tailwind.css, que es un archivo GENERADO: si se
agregan o cambian clases de Tailwind en el HTML hay que regenerarlo o esas
clases quedan sin estilo. El comando esta en el README. La tipografia Inter
se sirve desde public barra assets barra fonts.

El posicionamiento es local para Costa Rica. El NAP del negocio, Flamia
Group, telefono mas 506 8940 1202, correo contacto arroba flamiagroup.com,
Heredia Costa Rica, aparece identico en el pie de TODAS las paginas y en el
JSON-LD. Si cambia, hay que cambiarlo en todas a la vez: la inconsistencia de
NAP castiga el SEO local. Ya no hace falta recordarlo de memoria: el valor
canonico esta declarado en las variables del principio de check-seo.sh, y el
script señala cada archivo que falte actualizar.

Los datos estructurados son un unico bloque JSON-LD en el head de index.html,
con Organization mas ProfessionalService, WebSite, WebPage, Service y
FAQPage. La seccion visible con identificador faq y el bloque FAQPage tienen
que decir lo mismo: si se edita una, se edita la otra.

La direccion del PostalAddress declara localidad Heredia y pais CR, sin
calle, a proposito: Flamia es un negocio digital sin local de atencion al
publico, y una direccion fisica inventada rompe la coincidencia con Google
Business Profile.

## Notas para futuras sesiones

Antes de probar cambios en el flujo de llamada de voz, desactivar el nodo Llamar Vapi para evitar disparar llamadas reales a numeros de prueba o de ataque durante pruebas. Usar datos de prueba fijados, pin data, en el nodo Webhook en vez de invocar el webhook real de produccion. Nunca commitear valores reales de secretos, API keys o tokens en este repositorio, ni siquiera en archivos de documentacion como este. Y no mover este archivo dentro de la carpeta public: es documentacion interna y no debe volver a servirse en publico. Cualquier cambio de seguridad, borrado de credenciales, o publicacion de workflows debe confirmarse explicitamente con el usuario antes de ejecutarse.


Antes de probar cambios en el flujo de llamada de voz, desactivar el nodo Llamar Vapi para evitar disparar llamadas reales a numeros de prueba o de ataque durante pruebas. Usar datos de prueba fijados, pin data, en el nodo Webhook en vez de invocar el webhook real de produccion. Nunca commitear valores reales de secretos, API keys o tokens en este repositorio, ni siquiera en archivos de documentacion como este. Cualquier cambio de seguridad, borrado de credenciales, o publicacion de workflows debe confirmarse explicitamente con el usuario antes de ejecutarse.

## Cuarta tanda, septiembre 2026: paginas de servicio y consolidacion

Se trabajo sobre una auditoria SEO externa. Dos de sus recomendaciones no se
aplicaron, y conviene saber por que antes de que alguien las retome:

Reescribir el title y la meta del home. Se descarto. La auditoria lo pedia
por un CTR de cero, pero la muestra en la que se apoyaba era de 19
impresiones en nueve dias: con ese volumen, cero clics es el resultado
esperado y no dice nada del snippet. Ademas el H1 y el title ya contenian lo
que la auditoria proponia anadir. Reescribirlos reinicia el poco aprendizaje
acumulado y deja sin linea base. NO TOCAR hasta tener varios cientos de
impresiones.

Abrir un blog con dos articulos al mes. Se descarto por realismo operativo:
el sitio se publica subiendo un ZIP a mano, sin CMS, y un blog abandonado con
tres entradas es peor señal que no tener blog. En su lugar se amplio el
FAQPage que ya existia, de 7 a 12 preguntas, cubriendo las mismas busquedas
long-tail con cero infraestructura nueva.

Lo que si se hizo. El sitio pasa de una pagina indexable util a cuatro: se
crearon /gohighlevel, /agente-de-voz-ia y /agentes-ia-whatsapp, de unas 900 a
1000 palabras cada una, con JSON-LD propio (WebPage, BreadcrumbList, Service)
que referencia por @id la Organization que declara el home. Se sirven sin
extension mediante dos reglas del .htaccess, y se enlazan entre si y desde el
home: una pagina de servicio que solo existe en el sitemap nace huerfana.

El bloque style de 15 KB que vivia dentro de index.html se extrajo a
public/assets/site.css para que las paginas de servicio compartan el sistema
de diseño en vez de duplicarlo.

Sobre ghl.flamiagroup.com: NO es un portal de clientes, es una pagina de
VENTA. Por eso no lleva noindex. Su problema es que vende desde un
subdominio, y para Google un subdominio es practicamente otro sitio, asi que
su autoridad no alimenta al dominio principal. La decision fue consolidar: el
contenido vive ahora en /gohighlevel, los botones del nav apuntan ahi, y el
subdominio debe redirigir con un 301. El snippet esta en
deploy/ghl-301-a-gohighlevel.htaccess y empieza en 302 a proposito, porque un
301 se cachea en el navegador de forma casi permanente y haria irreversible
un error. AL ESCRIBIR ESTO EL 301 AUN NO ESTABA APLICADO.

inmobiliaria.flamiagroup.com sigue sin decidir: si es un sitio de cliente con
vida propia no se toca; si es un entorno interno, conviene que no se indexe.

## check-seo.sh: las invariantes dejaron de depender de la memoria

Varias reglas de este documento y del README se sostenian a mano y se rompian
igual. check-seo.sh las verifica y package.sh lo ejecuta antes de empaquetar,
de modo que una desincronizacion no puede llegar al servidor: NAP identico en
todas las paginas y en el JSON-LD, ningun otro numero mas 506 fuera de los
placeholder de formulario, la seccion faq visible y el bloque FAQPage con el
mismo numero de preguntas, toda pagina publicable en sitemap.xml, cada pagina
servida sin extension con su redireccion 301, y ninguna pagina enlazando a
ghl.flamiagroup.com.

Al crear una pagina de servicio nueva hay cuatro pasos, detallados en el
README. El script verifica tres; el cuarto, enlazarla desde el home, no se
puede automatizar y es el que mas duele olvidar.

## Despliegue, septiembre 2026: la trampa del campo de carpeta

Al extraer el ZIP, el Administrador de archivos de Hostinger pide una ruta.
Es la ruta de DESTINO, no el nombre de una carpeta nueva. Hay que pegar
barra home barra u783834143 barra domains barra flamiagroup.com barra
public_html. Escribir un nombre cualquiera deja el sitio dentro de una
subcarpeta y el dominio sin index.html en la raiz, que es exactamente el
tercer incidente de este documento. Se repite porque el campo parece pedir un
nombre.
