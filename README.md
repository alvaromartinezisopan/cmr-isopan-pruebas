# CMR Isopan · PRUEBAS

Primera versión de la nueva interfaz, separada de los repositorios actuales.

Web: https://alvaromartinezisopan.github.io/cmr-isopan-pruebas/

## Incluido
- Acceso con las cuentas existentes.
- Ofertas: registro, historial, edición según permisos, filtros, columnas y exportación Excel.
- Navegación lateral expandible en escritorio y barra inferior en móvil.
- Botón + para Nueva oferta y perfil con cierre de sesión.

## Datos compartidos
Usa el backend actual de PRUEBAS. Las ofertas y clientes guardados o editados aquí también cambian en la app actual. No es una copia aislada de los datos.

No se han cambiado tablas, reglas, usuarios, contraseñas ni configuración del backend. La recuperación de contraseña abre el acceso anterior para conservar su configuración.

## Pendiente
Clientes, Calendario/Visitas y avisos están marcados como próximas fases. No guardan contactos ni visitas todavía. Sin conexión SAP ni importaciones.

## Despliegue
GitHub Pages, rama main, raíz. index.html es la entrada autocontenida. No se requieren secretos de servidor para publicar el frontend. El acceso a datos depende de la sesión y las reglas del backend existente.
