# Sistema de Gestión de Biblioteca

Este proyecto es una aplicación web integral diseñada para la gestión eficiente de una biblioteca digital. Permite administrar el ciclo de vida completo de los recursos bibliográficos, desde la catalogación de libros y autores hasta el control de préstamos, reservas y multas.

El sistema proporciona una interfaz intuitiva y moderna para diferentes tipos de usuarios (administradores, bibliotecarios y miembros), facilitando el acceso a la información y la gestión de procesos diarios.

---

## Arquitectura y Tecnologías

El proyecto está construido como una **Single Page Application (SPA)**, priorizando la modularidad, el rendimiento y la mantenibilidad.

### Stack Tecnológico
- **Frontend**: [React 19](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/) para un desarrollo robusto y tipado.
- **Build Tool**: [Vite](https://vitejs.dev/) para un entorno de desarrollo ultrarrápido y construcción optimizada.
- **Enrutamiento**: [React Router v7](https://reactrouter.com/) para la navegación y gestión de rutas protegidas.
- **Estilos**: Hooks de CSS y componentes modulares, con [Lucide React](https://lucide.dev/) para la iconografía.
- **Backend (Simulado)**: [JSON Server](https://github.com/typicode/json-server) que actúa como una REST API completa, permitiendo persistencia de datos local en `db.json` durante el desarrollo.
- **Calidad de Código**: ESLint para asegurar buenas prácticas.

---

## Módulos y Funcionalidades

El sistema está estructurado en módulos claros, separando la lógica de negocio (Servicios), la interfaz de usuario (Componentes/Páginas) y el estado global (Contextos).

### 1. Autenticación y Seguridad
- **Login**: Sistema de acceso seguro.
- **Protección de Rutas**: Middleware que restringe el acceso a usuarios no autenticados.
- **Manejo de Roles**: Diferenciación entre administradores, bibliotecarios y miembros (configurado en `db.json`).

### 2. Gestión de Catálogo
- **Libros**: CRUD completo de libros con detalles de ISBN, año de publicación, etc.
- **Autores**: Gestión de información de autores.
- **Editoriales**: Administración de editoriales y orígenes.
- **Categorías**: Clasificación de recursos (e.g., Realismo Mágico, Clásicos).
- **Idiomas**: Soporte para categorización por idioma (Español, Inglés, etc.).

### 3. Gestión de Inventario Físico
- **Ejemplares (Copies)**: Control de unidades físicas de cada libro, códigos de barras y estado (disponible, prestado).
- **Ubicaciones**: Mapeo físico en la biblioteca (Estanterías, Niveles).

### 4. Circulación y Préstamos
- **Préstamos (Loans)**: Registro de salida y devolución de libros.
- **Reservas**: Sistema para reservar libros prestados o no disponibles.
- **Multas (Fines)**: Generación y seguimiento de penalizaciones por retrasos.

### 5. Usuarios y Comunidad
- **Usuarios**: Gestión de perfiles y roles.
- **Reseñas (Reviews)**: Sistema de calificación y comentarios para libros.

### 6. Dashboard
- Vista general con métricas clave y accesos directos a las funcionalidades principales.

---

## Estructura del Proyecto

```bash
src/
├── assets/         # Recursos estáticos (imágenes, fuentes)
├── components/     # Componentes UI reutilizables (Botones, Formularios, Layouts)
├── context/        # Estado global (AuthContext para sesión)
├── hooks/          # Hooks personalizados de React
├── models/         # Interfaces y modelos de datos (Typescript)
├── pages/          # Vistas principales (Rutas de la aplicación)
├── services/       # Lógica de comunicación con la API (Axios/Fetch)
├── styles/         # Archivos CSS globales y módulos
├── types.ts        # Definiciones de tipos globales
└── App.tsx         # Configuración principal de rutas
```

---

## Manual de Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos
- **Node.js**: Versión 18 o superior recomendada.
- **npm**: Gestor de paquetes incluido con Node.js.

### Pasos

1.  **Clonar el repositorio** (si aplica) o descargar los archivos del proyecto.
    ```bash
    git clone <url-del-repositorio>
    cd Biblioteca-main
    ```

2.  **Instalar dependencias**
    Ejecuta el siguiente comando en la raíz del proyecto para descargar todas las librerías necesarias:
    ```bash
    npm install
    ```

3.  **Iniciar el Servidor Backend (API Mock)**
    El sistema utiliza `json-server` para simular la base de datos. Debes ejecutar este servidor en una terminal separada:
    ```bash
    npm run server
    ```
    > El servidor se iniciará en `http://localhost:3001` y observará cambios en el archivo `db.json`.

4.  **Iniciar la Aplicación Frontend**
    En **otra terminal**, inicia el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
    > La aplicación estará disponible generalmente en `http://localhost:5173`.

---

## Credenciales de Acceso (Demo)

Para probar el sistema, puedes utilizar las siguientes credenciales preconfiguradas en `db.json`:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `123` |
| **Bibliotecario** | `librarian` | `123` |
| **Miembro** | `user1` | `123` |

---

## Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes comandos útiles:

- `npm run dev`: Inicia el entorno de desarrollo frontend.
- `npm run build`: Compila la aplicación para producción.
- `npm run server`: Inicia la API simulada (JSON Server).
- `npm run lint`: Ejecuta el linter para buscar errores de código.
- `npm run preview`: Vista previa de la build de producción.
