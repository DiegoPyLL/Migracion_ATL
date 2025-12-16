const HISTORIAL_ENV_URL = import.meta.env.VITE_HISTORIAL_API_URL;
const HISTORIAL_API_BASE = HISTORIAL_ENV_URL
  ? HISTORIAL_ENV_URL.replace(/\/historial\/?$/, "")
  : "http://localhost:8081/api/v1";

export const API_HOSTS = {
  usuarios: "http://localhost:8082/api/v1",
  citas: "http://localhost:8080/api/v1",
  historial: HISTORIAL_API_BASE,
  seguros: "http://localhost:8084/api/v1"
};

export type ServiceKey = keyof typeof API_HOSTS;

export const withBase = (service: ServiceKey, path: string) => {
  const base = API_HOSTS[service].replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
};
