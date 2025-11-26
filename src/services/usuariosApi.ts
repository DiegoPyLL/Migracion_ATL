import axios from "axios";
import { withBase } from "../config/apis";

export interface UsuarioDto {
  id?: number;
  id_usuario?: number;
  idUsuario?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  rol?: any;
}

const toUsuario = (u: any): UsuarioDto => ({
  id: u?.id ?? u?.id_usuario ?? u?.idUsuario,
  id_usuario: u?.id_usuario,
  idUsuario: u?.idUsuario,
  nombre: u?.nombre,
  apellido: u?.apellido,
  correo: u?.correo,
  telefono: u?.telefono,
  rol: u?.rol
});

export const usuariosApi = {
  async getAll(): Promise<UsuarioDto[]> {
    const resp = await axios.get(withBase("usuarios", "/usuarios"));
    const data = Array.isArray(resp.data) ? resp.data : [];
    return data.map(toUsuario);
  },
  async getById(id: number): Promise<UsuarioDto> {
    const resp = await axios.get(withBase("usuarios", `/usuarios/${id}`));
    return toUsuario(resp.data);
  }
};
