# Directiva: Endpoint de Email de Reactivación

## Objetivo
Enviar UN email de reactivación a todos los usuarios de la base de datos (Supabase) que NO tienen conectado su \`meta_access_token\`. El email sirve como recordatorio para que completen la configuración en Aditor AI.

## Entradas
- Cabecera \`authorization\` con el \`CRON_SECRET\` válido.
- Registros en la tabla \`profiles\` de Supabase.

## Salidas
- Emails enviados a través de Resend usando una plantilla HTML en modo oscuro (dark mode).
- Respuesta JSON con la cantidad total de usuarios encontrados, los enviados exitosamente y el detalle de cada envío.

## Lógica y Pasos
1. Validar \`authorization\` header usando \`process.env.CRON_SECRET\`. Si es incorrecto, devolver 401.
2. Inicializar cliente con rol de servicio de Supabase (\`SUPABASE_SERVICE_ROLE_KEY\`).
3. Buscar usuarios en la tabla \`profiles\` donde \`meta_access_token\` sea null.
4. Si no hay usuarios o hay un error, devolver 404.
5. Inicializar el cliente de Resend (\`RESEND_API_KEY\`).
6. Iterar sobre cada usuario encontrado:
   - Extraer el primer nombre.
   - Construir y enviar el email usando la plantilla HTML diseñada con variables como el nombre y el \`APP_URL\`.
   - Capturar el resultado o el error en un array de \`results\`.
7. Responder con el resumen de la operación.

## Trampas Conocidas / Casos Borde
- *Nota*: La cabecera \`authorization\` debe tener el formato exacto \`Bearer $CRON_SECRET\`.
- *Nota*: Es importante manejar el posible valor null en el nombre del usuario y hacer un split seguro (ej. \`split(' ')[0] || 'ahí'\`).
- *Nota*: Controlar errores por cada usuario iterado de Resend (usar un bloque try-catch) para no interrumpir el proceso de envío al resto de los usuarios en la lista.
