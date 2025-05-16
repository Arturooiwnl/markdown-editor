# MardkownEditor | Arturoiwnl

Herramienta para editar y crear archivos markdown.

version 0.1.1

# CHANGELOG
## 0.1.0 (13/05/2025)
- Creacion de la landing Page.
## 1.1.1 (13/05/2025)
- Cambio de 'slogan' en el footer.
## 0.1.1 (15/05/2025)
 - auth: Integrar Clerk para la autenticación de usuarios y la gestión de sesiones.

> Añadir middleware de Clerk, componentes de autenticación y gestión de sesiones de 
> usuario. Actualizar los estilos y dependencias globales para la integración con Clerk. 
> Refactorizar los componentes de encabezado y editor para incluir la funcionalidad de
> inicio y cierre de sesión y la gestión de perfiles de usuario. Añadir nuevos iconos y
> una barra lateral para mejorar la navegación.
## 1.2.1 (16/05/2025)
- Característica: Incorporación de la gestión de documentos e integración del tema oscuro de Clerk

> - Se añadió la dependencia `@clerk/themes` para la compatibilidad con el tema oscuro
> - Se crearon los componentes `DocumentsList` y `EditorSaver` para la gestión de documentos
> - Se integró el cliente Supabase para operaciones CRUD de documentos
> - Se actualizó `EditorMarkdown` con función de guardado automático y edición de documentos
> - Se eliminaron dependencias no utilizadas y se limpió el código
## 1.2.2 (16/05/2025)
- Se modificó el archivo EditorsSection.astro para actualizar la etiqueta de versión y agregar la etiqueta beta.
