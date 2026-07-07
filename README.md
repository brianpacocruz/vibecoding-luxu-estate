<div align="center">
  <h1>Luxe Estate 🏡</h1>
  <p>Una plataforma moderna para el sector inmobiliario que permite explorar, buscar y visualizar propiedades exclusivas con una interfaz premium y un diseño dinámico.</p>

  <!-- Badges / Logos -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  </p>
</div>

---

## 🚀 Live Demo

El proyecto se encuentra desplegado y accesible públicamente a través de Vercel. Puedes visualizar la aplicación en vivo aquí:
👉 **[Luxe Estate en Vercel](https://vibecoding-luxu-estate-gules.vercel.app)**

## 📋 Especificaciones

El proyecto está diseñado bajo los siguientes lineamientos técnicos y de negocio:

- **Arquitectura Frontend**: Creado con **Next.js**, aprovechando Server-Side Rendering (SSR) y Static Site Generation (SSG) para un SEO optimizado y tiempos de carga rápidos.
- **Base de Datos y Backend (BaaS)**: **Supabase** es utilizado como backend principal. Gestiona la base de datos PostgreSQL donde residen las propiedades, la autenticación de usuarios (si aplica) y el almacenamiento de imágenes o recursos (Storage).
- **Diseño UI/UX**: Se prioriza un aspecto premium, limpio y moderno. Interfaz responsiva adaptada a móviles, tablets y escritorio utilizando **Vanilla CSS**.
- **Gestión de Entornos**: Integración directa entre el entorno de desarrollo local (mediante variables `.env.local`) y Vercel para producción.

## 🗄️ Integración con Supabase y Vercel

El backend de la aplicación, incluyendo la base de datos de propiedades, está gestionado a través de **Supabase**. Supabase ofrece una alternativa open-source a Firebase, proporcionando una base de datos robusta, APIs en tiempo real y almacenamiento.

**Flujo de Datos:**
El proyecto desplegado en **Vercel** está enlazado directamente con el entorno de Supabase mediante variables de entorno, lo que permite que el frontend en Next.js se comunique de forma segura con la base de datos (PostgreSQL) para obtener los listados de propiedades mostrados en la aplicación.

## ⚙️ Configuración Local

Si deseas ejecutar este proyecto en tu entorno local:

1. **Clona el repositorio**
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Configura las variables de entorno**:
   Asegúrate de crear un archivo `.env.local` en la raíz del proyecto e incluye tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
4. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## ⏳ Tareas Pendientes (To-Do)

A medida que el proyecto evoluciona, estas son las funcionalidades y mejoras planeadas:

- [ ] **Sistema de Autenticación**: Permitir a los usuarios crear cuentas, iniciar sesión y guardar propiedades en "Favoritos".
- [ ] **Panel de Administración (Dashboard)**: Crear una sección privada para que administradores puedan agregar, editar o eliminar propiedades del catálogo.
- [ ] **Filtros Avanzados**: Implementar búsqueda por rango de precio, ubicación, número de habitaciones/baños, y tipo de propiedad.
- [ ] **Internacionalización (i18n)**: Soporte multi-idioma (Ej. Español / Inglés) para ampliar el alcance del público.
- [ ] **Galería Interactiva de Imágenes**: Mejorar el carrusel de propiedades con opciones de pantalla completa.
- [ ] **Integración de Mapas**: Mostrar la ubicación exacta de las propiedades usando Google Maps o Mapbox.
- [ ] **Optimización de Rendimiento**: Lazy loading de imágenes y mejoras en las métricas de Core Web Vitals.
