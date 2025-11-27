import axios from "axios";
import { withBase } from "../config/apis";
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
  const usuario = d?.usuario;
  const id = d?.id ?? d?.idDoctor ?? d?.doctorId;
  const idUsuario = d?.idUsuario ?? d?.id_usuario ?? usuario?.id;
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
    doctorId: d?.doctorId,
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
    tarifaConsulta: d?.tarifaConsulta ?? d?.tarifa_consulta
  };
};

export const doctoresApi = {
  async getAll(): Promise<DoctorDto[]> {
    const resp = await axios.get(withBase("usuarios", "/doctores"));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toDoctor);
  },
  async getById(id: number): Promise<DoctorDto> {
    const resp = await axios.get(withBase("usuarios", `/doctores/${id}`));
    return toDoctor(resp.data);
  }
};
