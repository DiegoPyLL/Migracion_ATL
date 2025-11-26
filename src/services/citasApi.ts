import axios from "axios";
import { withBase } from "../config/apis";

export interface CitaDto {
  id: number;
  fechaCita?: string;
  horaInicio?: string;
  horaFin?: string;
  estado?: string;
  idUsuario?: number | null;
  idDoctor?: number;
  disponible?: boolean;
}

const normalizeFecha = (f?: string) => {
  if (!f) return f;
  return f.includes("T") ? f.split("T")[0] : f;
};

const toCita = (c: any): CitaDto => ({
  id: c?.id,
  fechaCita: normalizeFecha(c?.fechaCita),
  horaInicio: c?.horaInicio,
  horaFin: c?.horaFin,
  estado: (c?.estado || "").toString().toUpperCase(),
  idUsuario: c?.idUsuario ?? c?.usuario?.id ?? null,
  idDoctor: c?.idDoctor ?? c?.doctor?.id,
  disponible: c?.disponible ?? c?.estado?.toLowerCase?.() === "disponible"
});

export const citasApi = {
  async getAll(): Promise<CitaDto[]> {
    const resp = await axios.get(withBase("citas", "/citas"));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toCita);
  },
  async getById(id: number): Promise<CitaDto> {
    const resp = await axios.get(withBase("citas", `/citas/${id}`));
    return toCita(resp.data);
  },
  async getByUsuario(uid: number): Promise<CitaDto[]> {
    const resp = await axios.get(withBase("citas", `/citas/usuario/${uid}`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toCita);
  },
  async getProximasByDoctor(idDoctor: number): Promise<CitaDto[]> {
    const resp = await axios.get(withBase("citas", `/citas/doctor/${idDoctor}/proximas`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toCita);
  },
  async getByDoctorAndFecha(idDoctor: number, yyyyMmDd: string): Promise<CitaDto[]> {
    const resp = await axios.get(withBase("citas", `/citas/doctor/${idDoctor}/fecha/${yyyyMmDd}`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toCita);
  }
};
