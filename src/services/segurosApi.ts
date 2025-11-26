import axios from "axios";
import { withBase } from "../config/apis";

export interface SeguroDto {
  id?: number;
  id_seguro?: number;
  nombre_seguro?: string;
  descripcion?: string;
  valor?: number;
}

export interface ContratoSeguroDto {
  id_contrato?: number;
  id?: number;
  id_usuario?: number;
  idUsuario?: number;
  estado?: string;
  fecha_contratacion?: string;
  metodo_pago?: string;
}

const toSeguro = (s: any): SeguroDto => ({
  id: s?.id ?? s?.id_seguro,
  id_seguro: s?.id_seguro,
  nombre_seguro: s?.nombre_seguro ?? s?.nombreSeguro,
  descripcion: s?.descripcion,
  valor: s?.valor
});

const normalizeFecha = (f?: string) => {
  if (!f) return f;
  return f.includes("T") ? f.split("T")[0] : f;
};

const toContrato = (c: any): ContratoSeguroDto => ({
  id_contrato: c?.id_contrato ?? c?.id,
  id: c?.id,
  id_usuario: c?.id_usuario ?? c?.idUsuario,
  idUsuario: c?.idUsuario,
  estado: c?.estado,
  fecha_contratacion: normalizeFecha(c?.fecha_contratacion ?? c?.fechaContratacion),
  metodo_pago: c?.metodo_pago ?? c?.metodoPago
});

export const segurosApi = {
  async getAll(): Promise<SeguroDto[]> {
    const resp = await axios.get(withBase("seguros", "/seguros"));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toSeguro);
  },
  async getContratosByUsuario(uid: number): Promise<ContratoSeguroDto[]> {
    const resp = await axios.get(withBase("seguros", `/seguros/contratos/usuario/${uid}`));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toContrato);
  }
};
