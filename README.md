# Clínica a tu Lado – Frontend (Vite + React 19)

Frontend SPA con rutas protegidas por rol (paciente, doctor, administrativo), marketing público y paneles de gestión conectados a microservicios Spring Boot.

## Requisitos

- Node 20+ y npm (usa Vite).
- Backends corriendo en localhost:
  - Auth/Usuarios/Doctores/Especialidades: `http://localhost:8082/api/v1`
  - Citas: `http://localhost:8080/api/v1`
  - Historial clínico: `http://localhost:8083/api/v1`
  - Seguros: `http://localhost:8084/api/v1`
- El cliente espera imágenes/videos en `public/images` y `public/videos`.

## Instalación y scripts

- `npm install`
- `npm run dev` → desarrollo en `http://localhost:5173`
- `npm run build` → build productivo
- `npm run preview` → servir el build
- `npm run lint` → ESLint
- `npm test` / `npm run test:iu` → Vitest (headless / interactivo)

## Configuración de APIs

- Host base por servicio en `src/config/apis.ts` (`API_HOSTS` y helper `withBase`).
- Algunos componentes usan URLs directas; ajústalas si cambias puertos:
  - Login: `POST http://localhost:8082/api/v1/auth/login` (`src/pages/login.tsx`)
  - Registro paciente: `POST http://localhost:8082/api/v1/usuarios` (`src/pages/registro.tsx`)
  - Seguros públicos: `GET http://localhost:8084/api/v1/seguros` (`src/pages/SegurosListado.tsx`)
  - Citas/usuarios/doctores en panel doctor: `src/pages/DoctorDashboard.tsx`
  - Creación de doctores y especialidades en panel admin: `src/pages/AdminDashboard.tsx`
  - Explorador admin (solo GET): ver sección siguiente.
- La sesión se guarda en `localStorage` bajo la clave `usuario` con el campo `role` en minúsculas.

## Rutas y roles

- Público: `/`, `/login`, `/registro`, `/seguros`, `/seguros/venta`, `/seguros/:id/contratar`, `/sobre-nosotros`, `/terminos-y-condiciones`.
- Paciente (RoleProtectedRoute `allowedRole="paciente"`): `/perfil`, `/pedir-hora`, `/seguros/:id/contratar`.
- Doctor: `/doctor-dashboard`.
- Administrativo: `/admin-dashboard`, `/admin/doctores`, `/admin/doctores/:doctorId`, `/admin/seguros`, `/admin/seguros/nuevo`, `/admin/seguros/:id/editar`, `/admin/explorador`.
- La ruta `/` redirige al dashboard según rol si ya hay sesión.

## Funcionalidades destacadas

- Home pública: carrusel multimedia, CTA de reserva, tarjetas de seguros y vitrina de médicos.
- Autenticación con redirección automática por rol; registro de pacientes.
- Listado de seguros en vivo desde el microservicio de seguros, con agrupación por tipo.
- Panel doctor: agenda futura, completadas, edición de diagnósticos/observaciones, métricas (hook `useDoctorStatsFront`), edición de perfil y avatar local.
- Panel administrativo: creación rápida de doctores, gestión básica de especialidades (cliente), edición de perfil y avatar local.
- Explorador de datos admin (`/admin/explorador`): vistas de usuarios/doctores (8082), citas (8080), historial (8083) y seguros/contratos (8084); filtros por texto/ID/estado/mes y paginación client-side. Respuestas 204 se muestran como lista vacía y errores de red/CORS se notifican en el cliente.

## Notas rápidas

- Usa Bootstrap 5 + Bootstrap Icons globales (`src/main.tsx`); React Icons en componentes.
- Los assets de video se cargan desde `/public/videos`; si no existen, reemplázalos o ajusta las rutas.
- Para cambiar el branding (logo, colores) revisa `src/components/header.tsx` y los estilos en `src/styles/`.
