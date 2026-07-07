# Luxe Estate 🏡

Luxe Estate es una plataforma moderna para el sector inmobiliario que permite a los usuarios explorar, buscar y visualizar propiedades exclusivas con una interfaz premium y un diseño dinámico.

## 🚀 Live Demo

El proyecto se encuentra desplegado y accesible públicamente a través de Vercel. Puedes visualizar la aplicación en vivo aquí:
👉 **[Luxe Estate en Vercel](https://vibecoding-luxu-estate-gules.vercel.app)**

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido construido utilizando tecnologías modernas para garantizar rendimiento, escalabilidad y una experiencia de usuario excepcional:

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Estilos**: Vanilla CSS con un enfoque en diseño de alta calidad, animaciones fluidas y accesibilidad.
- **Base de Datos y Backend as a Service (BaaS)**: [Supabase](https://supabase.com/)
- **Despliegue**: [Vercel](https://vercel.com/)

## 🗄️ Supabase y Vercel

El backend de la aplicación, incluyendo la base de datos de propiedades, está gestionado a través de **Supabase**. Supabase ofrece una alternativa open-source a Firebase, proporcionando una base de datos PostgreSQL, autenticación, almacenamiento y APIs en tiempo real.

**Integración:**
El proyecto en Vercel está enlazado directamente con el entorno de Supabase mediante variables de entorno (`.env.local`), lo que permite que el frontend en Next.js se comunique de forma segura con la base de datos para obtener los listados de propiedades mostrados en la aplicación.

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
