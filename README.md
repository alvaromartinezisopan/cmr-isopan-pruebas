# CMR Isopan · PRUEBAS

Nueva interfaz independiente de las apps actuales.

Web: https://alvaromartinezisopan.github.io/cmr-isopan-pruebas/

## Incluido
- Acceso con las cuentas existentes y permisos actuales.
- Inicio con resumen real de ofertas.
- Ofertas: registro, historial, edición según permisos, filtros, columnas y Excel.
- Clientes: lista y ficha, ofertas vinculadas, varios contactos y teléfono/correo clicables.
- Dirección manual opcional y enlace de búsqueda en Google Maps. No requiere clave ni facturación de Places; no se valida geográficamente la dirección.
- Visitas: alta desde ficha o Calendario, fecha/hora y zona horaria, nota y comercial automático; calendario/lista, reprogramación, realizada y cancelada conservando el registro.
- Preparación de visita con contactos, dirección y estadísticas de ofertas. Ofertas ganadas no equivalen a pedidos ni facturación.
- Navegación lateral en escritorio e inferior en móvil; botones contextuales +.

## Datos y permisos
Usa el backend PRUEBAS compartido. Las ofertas, clientes y contactos guardados o editados aquí también están en ese backend. No es una copia aislada.

Cambios aditivos aprobados en PRUEBAS: campos de contacto/dirección en clientes, tabla cliente_contactos y tabla visitas, con RLS por delegado y sin escrituras para solo_lectura. Nombre/país del cliente se mantienen protegidos por su vínculo textual con ofertas. No se han cambiado Auth, cuentas, contraseñas ni configuración de PROD.

## Fuera de esta fase
Sin conexión SAP, pedidos importados, autocompletado Places, invitaciones, sincronización Google Calendar, notificaciones push ni avisos automáticos. La campana muestra un estado vacío real.

## Despliegue
GitHub Pages, rama main, raíz. index.html es la entrada autocontenida. No contiene secretos de servidor; la clave pública no sustituye la sesión ni las reglas RLS.
