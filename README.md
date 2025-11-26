# Explorador de Datos (Admin)

- Ruta: `/admin/explorador` (solo administradores).
- Configura hosts/puertos en `src/config/apis.ts`.
- Endpoints usados (solo GET):
  - Usuarios/Doctores: 8082 (`/usuarios`, `/doctores`).
  - Citas: 8080 (`/citas`, `/citas/{id}`, `/citas/usuario/{id}`, `/citas/doctor/{id}/proximas`, `/citas/doctor/{id}/fecha/{yyyy-MM-dd}`).
  - Historial: 8083 (`/historial/usuario/{id}`, `/historial/doctor/{id}` si existe).
  - Seguros: 8084 (`/seguros`, `/seguros/contratos/usuario/{id}`).
- Búsquedas: barra superior con “Consultar por ID” (Enter), filtro texto, estado (citas) y mes (citas/historial). Paginación client-side.
- Si un servicio responde 204, se muestra lista vacía; los errores de red/CORS se notifican en el cliente.
