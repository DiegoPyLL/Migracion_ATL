import axios from "axios";
import { withBase } from "../config/apis";

export interface HistorialDto {
  id?: number;
  idHistorial?: number;
  fecha?: string;
  hora?: string;
  idUsuario?: number | null;
  idDoctor?: number | null;
  diagnostico?: string;
  observaciones?: string;
}

const normalizeFecha = (f?: string) => {
  if (!f) return f;
  return f.includes("T") ? f.split("T")[0] : f;
};

const toHistorial = (h: any): HistorialDto => ({
  id: h?.id ?? h?.idHistorial,
  idHistorial: h?.idHistorial,
  fecha: normalizeFecha(h?.fechaHistorial ?? h?.fecha),
  hora: h?.hora ?? h?.horaInicio,
  idUsuario: h?.idUsuario ?? h?.usuario?.id ?? null,
  idDoctor: h?.idDoctor ?? h?.doctor?.id ?? null,
  diagnostico: h?.diagnostico,
  observaciones: h?.observaciones ?? h?.observacionesHorario
});

export const historialApi = {
  async getByUsuario(uid: number): Promise<HistorialDto[]> {
    const resp = await axios.get(withBase("historial", `/historial/usuario/${uid}`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toHistorial);
  },
  async getByDoctor(idDoctor: number): Promise<HistorialDto[]> {
    const resp = await axios.get(withBase("historial", `/historial/doctor/${idDoctor}`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toHistorial);
  }
};
