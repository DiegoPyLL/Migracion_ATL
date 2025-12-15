import axios from "axios";
import { API_HOSTS, withBase } from "../config/apis";
import { UsuarioDto } from "./usuariosApi";

export interface DoctorDto {
  id?: number;
  idDoctor?: number;
  doctorId?: number;
  idUsuario?: number;
  usuario?: UsuarioDto;
  nombreCompleto?: string;
  especialidad?: string;
  tarifaConsulta?: number;
}

const toDoctor = (d: any): DoctorDto => {
  const usuario = d?.usuario ?? (d?.nombre || d?.apellido || d?.correo ? {
    id: d?.id ?? d?.idUsuario ?? d?.id_usuario,
    nombre: d?.nombre,
    apellido: d?.apellido,
    correo: d?.correo,
    telefono: d?.telefono,
    rol: d?.rol
  } : undefined);

  const doctorInfo = d?.doctor; // posible forma nueva: usuario con doctor anidado

  const id = d?.idDoctor ?? d?.doctorId ?? doctorInfo?.id ?? d?.id;
  const idUsuario = d?.idUsuario ?? d?.id_usuario ?? usuario?.id ?? d?.id;

  const nombreCompleto = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim()
    : `${d?.nombre || ""} ${d?.apellido || ""}`.trim();

  const especialidadesArray = Array.isArray(d?.especialidades) ? d.especialidades : [];
  const especialidadDesdeArray = especialidadesArray
    .map((esp: any) => esp?.nombre ?? esp?.nombreEspecialidad)
    .find((value): value is string => Boolean(value));

  return {
    id,
    idDoctor: d?.idDoctor,
    doctorId: d?.doctorId ?? doctorInfo?.id,
    idUsuario,
    usuario,
    nombreCompleto: nombreCompleto || undefined,
    especialidad:
      d?.especialidad?.nombre ??
      d?.especialidad ??
      d?.especialidadPrincipal ??
      d?.especialidad?.nombreEspecialidad ??
      d?.nombreEspecialidad ??
      especialidadDesdeArray,
    tarifaConsulta: d?.tarifaConsulta ?? d?.tarifa_consulta ?? doctorInfo?.tarifaConsulta
  };
};

export const doctoresApi = {
  async getAll(): Promise<DoctorDto[]> {
    const url = withBase("usuarios", "/doctores");
    const resp = await axios.get(url, { validateStatus: (s) => (s >= 200 && s < 300) || s === 204 });
    if (resp.status === 204) return [];
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toDoctor);
  },
  async getById(id: number): Promise<DoctorDto> {
    const url = withBase("usuarios", `/doctores/${id}`);
    const resp = await axios.get(url);
    return toDoctor(resp.data);
  }
};
