# MardkownEditor | Arturoiwnl

![Markdown Editor og](https://mdeditor.arturoiwnl.pro/og/og-main.png)


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
## 1.3.2 (19/05/2025)
- Se removio las funcionalidades de guardado en la nube y crud de documentos.
- Se añadio la pagina de changelog.
## 2.0.1 (21/05/2025)
refactor(auth) y agregacion (Persistencia en Nube): Migración de Clerk a Firebase para la autenticación y Usos de Base de datos de Firebase (Firestore Database)

Esta confirmación reemplaza el sistema de autenticación de Clerk con Firebase Auth, utilizando GitHub como proveedor y Una implementacion con Firestore Database para la persistencia de docu,mentos y datos relevantes. Los cambios incluyen:
- Eliminación de dependencias y configuraciones relacionadas con Clerk.
- Incorporación del SDK de Firebase e implementación de la funcionalidad de inicio/cierre de sesión de GitHub.
- Persistencia de Documentos y crud de los mismo
- Actualización de componentes para usar Firebase Auth en lugar de Clerk.
- Incorporación de nuevos componentes para inicio de sesión, perfil de usuario y notificaciones emergentes.
- Ajuste del estilo y la disposición para adaptarse al nuevo sistema de autenticación.